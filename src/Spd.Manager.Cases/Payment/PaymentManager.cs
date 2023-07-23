using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Payment;
using Spd.Resource.Organizations.Config;
using Spd.Utilities.Cache;
using Spd.Utilities.Payment;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Cases.Payment
{
    internal class PaymentManager :
        IRequestHandler<PaymentLinkCreateCommand, PaymentLinkResponse>,
        IRequestHandler<PaymenCreateCommand, Guid>,
        IRequestHandler<PaymentQuery, PaymentResponse>,
        IRequestHandler<PaymentFailedAttemptCountQuery, int>,
        IRequestHandler<PrePaymentLinkCreateCommand, PrePaymentLinkResponse>,
        IPaymentManager
    {
        private readonly IPaymentService _paymentService;
        private readonly IConfigRepository _configRepository;
        private readonly IDistributedCache _cache;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;
        private readonly IApplicationRepository _appRepository;
        private readonly ITimeLimitedDataProtector _dataProtector;

        public PaymentManager(IPaymentService paymentService,
            IConfigRepository configRepository,
            IDistributedCache cache,
            IPaymentRepository paymentRepository,
            IMapper mapper,
            IApplicationRepository appRepository,
            IDataProtectionProvider dpProvider)
        {
            _paymentService = paymentService;
            _configRepository = configRepository;
            _cache = cache;
            _paymentRepository = paymentRepository;
            _mapper = mapper;
            _appRepository = appRepository;
            _dataProtector = dpProvider.CreateProtector(nameof(PrePaymentLinkCreateCommand)).ToTimeLimitedDataProtector();
        }

        public async Task<PrePaymentLinkResponse> Handle(PrePaymentLinkCreateCommand command, CancellationToken ct)
        {
            var app = await _appRepository.QueryApplicationAsync(new ApplicationQry(command.ApplicationId), ct);
            if (app == null)
                throw new ApiException(HttpStatusCode.BadRequest, "application does not exist.");
            if (app.PaidOn != null)
                throw new ApiException(HttpStatusCode.BadRequest, "application has already been paid.");

            //todo, the valid days needs to get from biz, current days is temporary
            var encryptedApplicationId = WebUtility.UrlEncode(_dataProtector.Protect(command.ApplicationId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.APPLICATION_INVITE_VALID_DAYS)));

            var paymentId = Guid.NewGuid();
            var encryptedPaymentId = WebUtility.UrlEncode(_dataProtector.Protect(paymentId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.APPLICATION_INVITE_VALID_DAYS)));
            return new PrePaymentLinkResponse($"{command.ScreeningAppPaymentUrl}?encodedAppId={encryptedApplicationId}&encodedPaymentId={encryptedPaymentId}");
        }

        public async Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand command, CancellationToken ct)
        {
            Guid applicationId;
            Guid paymentId;
            bool isFromSecurePaymentLink;
            if (command.PaymentLinkCreateRequest is PaymentLinkFromSecureLinkCreateRequest request)
            {
                try
                {
                    string appIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(request.EncodedApplicationId));
                    applicationId = Guid.Parse(appIdStr);
                    string paymentIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(request.EncodedPaymentId));
                    paymentId = Guid.Parse(paymentIdStr);
                }
                catch
                {
                    throw new ApiException(HttpStatusCode.Accepted, "The payment link is no longer valid.");
                }
                isFromSecurePaymentLink = true;
                //secure payment link can only be used once.
                var existingPayment = await _paymentRepository.QueryAsync(new PaymentQry(applicationId, paymentId), ct);
                if (existingPayment.Items.Any())
                    throw new ApiException(HttpStatusCode.Accepted, "The payment link has already been used.");
            }
            else
            {
                applicationId = (Guid)command.PaymentLinkCreateRequest.ApplicationId;
                paymentId = Guid.NewGuid();
                isFromSecurePaymentLink = false;
            }

            //validation
            var app = await _appRepository.QueryApplicationAsync(new ApplicationQry(applicationId), ct);
            if (app.PaidOn != null)
                throw new ApiException(HttpStatusCode.BadRequest, "application has already been paid.");
            if (app.NumberOfAttempts > command.MaxFailedTimes && !isFromSecurePaymentLink)
                throw new ApiException(HttpStatusCode.BadRequest, $"Payment can only be tried no more than {command.MaxFailedTimes} times.");

            //get config from cache or Dynamics
            SpdPaymentConfig spdPaymentConfig = await GetSpdPaymentConfigAsync(ct);
            Guid transNumber = Guid.NewGuid();

            //generate the link string 
            //payment utility
            var linkResult = (CreateDirectPaymentLinkResult)_paymentService.HandleCommand(
                new CreateDirectPaymentLinkCommand
                {
                    RevenueAccount = spdPaymentConfig.PaybcRevenueAccount,
                    TransNumber = transNumber.ToString(),
                    PbcRefNumber = spdPaymentConfig.PbcRefNumber,
                    Amount = spdPaymentConfig.ServiceCost,
                    Description = command.PaymentLinkCreateRequest.Description,
                    PaymentMethod = Spd.Utilities.Payment.PaymentMethodEnum.CC,
                    RedirectUrl = command.RedirectUrl,
                    Ref1 = paymentId.ToString(), //put payment id to ref1
                    Ref2 = applicationId.ToString(), //application id to ref2
                    Ref3 = isFromSecurePaymentLink.ToString()
                });

            return new PaymentLinkResponse(linkResult.PaymentLinkUrl);
        }

        public async Task<Guid> Handle(PaymenCreateCommand command, CancellationToken ct)
        {
            //validate hashcode
            PaymentValidationResult validated = (PaymentValidationResult)_paymentService.HandleCommand(new ValidatePaymentResultStrCommand() { QueryStr = command.QueryStr });
            if (!validated.ValidationPassed)
            {
                throw new ApiException(HttpStatusCode.InternalServerError, "payment result from paybc is not validated.");
            }

            var createCmd = _mapper.Map<CreatePaymentCmd>(command.PaybcPaymentResult);
            await _paymentRepository.ManageAsync(createCmd, ct);
            var updateCmd = _mapper.Map<UpdatePaymentCmd>(command.PaybcPaymentResult);
            return await _paymentRepository.ManageAsync(updateCmd, ct);
        }

        public async Task<PaymentResponse> Handle(PaymentQuery query, CancellationToken ct)
        {
            var respList = await _paymentRepository.QueryAsync(new PaymentQry(null, query.PaymentId), ct);
            return _mapper.Map<PaymentResponse>(respList.Items.First());
        }

        public async Task<int> Handle(PaymentFailedAttemptCountQuery query, CancellationToken ct)
        {
            var respList = await _paymentRepository.QueryAsync(new PaymentQry(query.ApplicationId), ct);
            return respList.Items.Count(i => !i.PaidSuccess && i.PaymentType == PaymentTypeEnum.PayBC_OnSubmission);
        }

        private async Task<SpdPaymentConfig> GetSpdPaymentConfigAsync(CancellationToken ct)
        {
            SpdPaymentConfig? spdPaymentConfig = await _cache.Get<SpdPaymentConfig>("spdPaymentConfig");
            if (spdPaymentConfig != null) return spdPaymentConfig;

            var configs = await _configRepository.Query(new ConfigQuery(null, IConfigRepository.PAYBC_GROUP), ct);
            var pbcRefnumberConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_PBCREFNUMBER_KEY);
            if (pbcRefnumberConfig == null)
                throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set pbcRefNumber correctly.");

            var PaybcRevenueAccountConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_REVENUEACCOUNT_KEY);
            if (PaybcRevenueAccountConfig == null)
                throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set paybc revenue account correctly.");

            var serviceCostConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBCS_SERVICECOST_KEY);
            if (serviceCostConfig == null)
                throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set service cost correctly.");

            spdPaymentConfig = new SpdPaymentConfig()
            {
                PbcRefNumber = pbcRefnumberConfig.Value,
                PaybcRevenueAccount = PaybcRevenueAccountConfig.Value,
                ServiceCost = Decimal.Round(Decimal.Parse(serviceCostConfig.Value), 2)
            };
            await _cache.Set<SpdPaymentConfig>("spdPaymentConfig", spdPaymentConfig, new TimeSpan(1, 0, 0));
            return spdPaymentConfig;
        }

        private record SpdPaymentConfig
        {
            public string PbcRefNumber { get; set; }
            public string PaybcRevenueAccount { get; set; }
            public decimal ServiceCost { get; set; }
        }
    }
}