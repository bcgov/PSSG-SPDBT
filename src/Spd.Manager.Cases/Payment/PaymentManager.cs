using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Resource.Applicants.Payment;
using Spd.Resource.Organizations.Config;
using Spd.Utilities.Payment;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Text;

namespace Spd.Manager.Cases.Payment
{
    internal class PaymentManager :
        IRequestHandler<PaymentLinkCreateCommand, PaymentLinkResponse>,
        IRequestHandler<PaymentUpdateCommand, Guid>,
        IRequestHandler<PaymentQuery, PaymentResponse>,
        IPaymentManager
    {
        private readonly IPaymentService _paymentService;
        private readonly IConfigRepository _configRepository;
        private readonly IDistributedCache _cache;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;

        public PaymentManager(IPaymentService paymentService,
            IConfigRepository configRepository,
            IDistributedCache cache,
            IPaymentRepository paymentRepository,
            IMapper mapper)
        {
            _paymentService = paymentService;
            _configRepository = configRepository;
            _cache = cache;
            _paymentRepository = paymentRepository;
            _mapper = mapper;
        }

        public async Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand command, CancellationToken ct)
        {
            //get config from cache or Dynamics
            var raBytes = _cache.Get("paybcRevenueAccount");
            string revenueAccount = raBytes != null ? Encoding.Default.GetString(raBytes) : null;
            if (revenueAccount == null)
            {
                var config = await _configRepository.Query(
                    new ConfigQuery(IConfigRepository.PAYBC_REVENUEACCOUNT_KEY, IConfigRepository.PAYBC_GROUP),
                    ct);
                revenueAccount = config.Value;
                _cache.Set("paybcRevenueAccount", Encoding.UTF8.GetBytes(revenueAccount), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = new TimeSpan(10, 0, 0) });
            }
            var refBytes = _cache.Get("pbcRefNumber");
            string pbcRef = refBytes != null ? Encoding.Default.GetString(refBytes) : null;
            if (pbcRef == null)
            {
                var config = await _configRepository.Query(
                    new ConfigQuery(IConfigRepository.PAYBC_PBCREFNUMBER_KEY, IConfigRepository.PAYBC_GROUP),
                    ct);
                pbcRef = config.Value;
                _cache.Set("pbcRefNumber", Encoding.UTF8.GetBytes(pbcRef), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = new TimeSpan(10, 0, 0) });
            }
            var costBytes = _cache.Get("serviceCost");
            string cost = costBytes != null ? Encoding.Default.GetString(costBytes) : null;
            if (cost == null)
            {
                var config = await _configRepository.Query(
                    new ConfigQuery(IConfigRepository.PAYBCS_SERVICECOST_KEY, IConfigRepository.PAYBC_GROUP),
                    ct);
                cost = config.Value;
                _cache.Set("serviceCost", Encoding.UTF8.GetBytes(cost), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = new TimeSpan(1, 0, 0) });
            }
            decimal price = Decimal.Round(Decimal.Parse(cost), 2);
            string transNumber = Guid.NewGuid().ToString();

            //create payment
            Guid paymentId = await _paymentRepository.ManageAsync(
                new CreatePaymentCmd()
                {
                    ApplicationId = command.PaymentLinkCreateRequest.ApplicationId,
                    PaymentMethod = Resource.Applicants.Payment.PaymentMethodEnum.CreditCard,
                    TransAmount = price,
                    TransNumber = transNumber,
                }, ct);

            //generate the link string 
            //payment utility
            var linkResult = (CreateDirectPaymentLinkResult)_paymentService.HandleCommand(
                new CreateDirectPaymentLinkCommand
                {
                    RevenueAccount = revenueAccount,
                    TransNumber = transNumber,
                    PbcRefNumber = pbcRef,
                    Amount = price,
                    Description = command.PaymentLinkCreateRequest.Description,
                    PaymentMethod = Spd.Utilities.Payment.PaymentMethodEnum.CC,
                    RedirectUrl = command.RedirectUrl,
                    Ref1 = paymentId.ToString(), //put payment id to ref1
                    Ref2 = command.PaymentLinkCreateRequest.ApplicationId.ToString(), //application id to ref2
                });


            return new PaymentLinkResponse
            {
                PaymentLinkUrl = linkResult.PaymentLinkUrl,
            };
        }

        public async Task<Guid> Handle(PaymentUpdateCommand command, CancellationToken ct)
        {
            //validate hashcode
            ValidationResult validated = (ValidationResult)_paymentService.HandleCommand(new ValidatePaymentResultStrCommand() { QueryStr = command.QueryStr });
            if (!validated.ValidationPassed)
            {
                throw new ApiException(HttpStatusCode.InternalServerError, "payment result from paybc is not validated.");
            }

            var cmd = _mapper.Map<UpdatePaymentCmd>(command.PaybcPaymentResult);
            cmd.PaymentId = command.PaymentId;
            cmd.ApplicationId = command.ApplicationId;
            return await _paymentRepository.ManageAsync(cmd, ct);
        }

        public async Task<PaymentResponse> Handle(PaymentQuery query, CancellationToken ct)
        {
            var respList = await _paymentRepository.QueryAsync(new PaymentQry(null, query.PaymentId), ct);
            return _mapper.Map<PaymentResponse>(respList.Items.First());
        }
    }
}