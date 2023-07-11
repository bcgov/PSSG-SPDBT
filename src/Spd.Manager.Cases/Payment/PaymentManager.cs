using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Resource.Organizations.Config;
using Spd.Utilities.Payment;
using System.Text;

namespace Spd.Manager.Cases.Payment
{
    internal class PaymentManager :
        IRequestHandler<PaymentLinkCreateCommand, PaymentLinkResponse>,
        IRequestHandler<PaymentCreateCommand, PaymentResponse>,
        IPaymentManager
    {
        private readonly IPaymentService _paymentService;
        private readonly IConfigRepository _configRepository;
        private readonly IDistributedCache _cache;

        public PaymentManager(IPaymentService paymentService, IConfigRepository configRepository, IDistributedCache cache)
        {
            _paymentService = paymentService;
            _configRepository = configRepository;
            _cache = cache;
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
            string cost = refBytes != null ? Encoding.Default.GetString(costBytes) : null;
            if (pbcRef == null)
            {
                var config = await _configRepository.Query(
                    new ConfigQuery(IConfigRepository.PAYBCS_SERVICECOST_KEY, IConfigRepository.PAYBC_GROUP),
                    ct);
                cost = config.Value;
                _cache.Set("serviceCost", Encoding.UTF8.GetBytes(cost), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = new TimeSpan(1, 0, 0) });
            }

            //generate the link string 
            //payment utility
            var linkResult = (CreateDirectPaymentLinkResult)await _paymentService.HandleCommand(
                new CreateDirectPaymentLinkCommand
                {
                    RevenueAccount = revenueAccount,
                    PbcRefNumber = pbcRef,
                    Amount = Decimal.Round(Decimal.Parse(cost), 2),
                    Description = command.PaymentLinkCreateRequest.Description,
                    PaymentMethod = PaymentMethodEnum.CC,
                    RedirectUrl = command.RedirectUrl,
                    Ref1 = command.Ref1,
                    Ref2 = command.Ref2,
                    Ref3 = command.Ref3
                }, ct);


            return new PaymentLinkResponse
            {
                PaymentLinkUrl = linkResult.PaymentLinkUrl,
            };
        }

        public async Task<PaymentResponse> Handle(PaymentCreateCommand command, CancellationToken ct)
        {
            return null;
        }
    }
}