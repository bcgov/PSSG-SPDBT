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
        IRequestHandler<PaymentUpdateCommand, Guid>,
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

            return new PrePaymentLinkResponse($"{command.ScreeningAppPaymentUrl}?encodedAppId={encryptedApplicationId}");
        }

        public async Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand command, CancellationToken ct)
        {
            Guid applicationId;
            if (command.PaymentLinkCreateRequest.ApplicationId == null && command.PaymentLinkCreateRequest.EncodedApplicationId != null)
            {
                try
                {
                    string appIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(command.PaymentLinkCreateRequest.EncodedApplicationId));
                    applicationId = Guid.Parse(appIdStr);
                }
                catch
                {
                    throw new ApiException(HttpStatusCode.Accepted, "The payment link is no longer valid.");
                }
            }
            else
            {
                applicationId = (Guid)command.PaymentLinkCreateRequest.ApplicationId;
            }

            //validation
            var app = await _appRepository.QueryApplicationAsync(new ApplicationQry(applicationId), ct);
            if (app.PaidOn != null)
                throw new ApiException(HttpStatusCode.BadRequest, "application has already been paid.");
            if (app.NumberOfAttempts > command.MaxFailedTimes && !command.IsFromSecurePaymentLink)
                throw new ApiException(HttpStatusCode.BadRequest, $"Payment can only be tried no more than {command.MaxFailedTimes} times.");

            //get config from cache or Dynamics
            SpdPaymentConfig spdPaymentConfig = await GetSpdPaymentConfigAsync(ct);
            string transNumber = Guid.NewGuid().ToString();

            //create payment
            Guid paymentId = await _paymentRepository.ManageAsync(
                new CreatePaymentCmd()
                {
                    ApplicationId = applicationId,
                    PaymentMethod = Resource.Applicants.Payment.PaymentMethodEnum.CreditCard,
                    TransAmount = spdPaymentConfig.ServiceCost,
                    TransNumber = transNumber,
                    PaymentType = command.IsFromSecurePaymentLink ? PaymentTypeEnum.PayBC_SecurePaymentLink : PaymentTypeEnum.PayBC_OnSubmission
                }, ct);

            //generate the link string 
            //payment utility
            var linkResult = (CreateDirectPaymentLinkResult)_paymentService.HandleCommand(
                new CreateDirectPaymentLinkCommand
                {
                    RevenueAccount = spdPaymentConfig.PaybcRevenueAccount,
                    TransNumber = transNumber,
                    PbcRefNumber = spdPaymentConfig.PbcRefNumber,
                    Amount = spdPaymentConfig.ServiceCost,
                    Description = command.PaymentLinkCreateRequest.Description,
                    PaymentMethod = Spd.Utilities.Payment.PaymentMethodEnum.CC,
                    RedirectUrl = command.RedirectUrl,
                    Ref1 = paymentId.ToString(), //put payment id to ref1
                    Ref2 = command.PaymentLinkCreateRequest.ApplicationId.ToString(), //application id to ref2
                });

            return new PaymentLinkResponse(linkResult.PaymentLinkUrl);
        }

        public async Task<Guid> Handle(PaymentUpdateCommand command, CancellationToken ct)
        {
            //validate hashcode
            PaymentValidationResult validated = (PaymentValidationResult)_paymentService.HandleCommand(new ValidatePaymentResultStrCommand() { QueryStr = command.QueryStr });
            if (!validated.ValidationPassed)
            {
                throw new ApiException(HttpStatusCode.InternalServerError, "payment result from paybc is not validated.");
            }

            var cmd = _mapper.Map<UpdatePaymentCmd>(command.PaybcPaymentResult);
            return await _paymentRepository.ManageAsync(cmd, ct);
        }

        public async Task<PaymentResponse> Handle(PaymentQuery query, CancellationToken ct)
        {
            var respList = await _paymentRepository.QueryAsync(new PaymentQry(null, query.PaymentId), ct);
            return _mapper.Map<PaymentResponse>(respList.Items.First());
        }

        public async Task<int> Handle(PaymentFailedAttemptCountQuery query, CancellationToken ct)
        {
            var respList = await _paymentRepository.QueryAsync(new PaymentQry(query.ApplicationId), ct);
            return respList.Items.Count(i => i.PaymentStatus == PaymentStatusEnum.Failure && i.PaymentType == PaymentTypeEnum.PayBC_OnSubmission);
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