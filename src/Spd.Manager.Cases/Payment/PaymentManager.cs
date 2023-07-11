using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Resource.Organizations.Config;
using Spd.Utilities.Payment;
using System.Text;

namespace Spd.Manager.Cases.Payment
{
    internal class PaymentManager :
        IRequestHandler<PaymentLinkCreateCommand, PaymentLinkResponse>,
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
                revenueAccount = (await _configRepository.Query(new ConfigQuery(IConfigRepository.PAYBC_REVENUEACCOUNT_KEY), ct)).Value;
                _cache.Set("paybcRevenueAccount", Encoding.UTF8.GetBytes(revenueAccount), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = new TimeSpan(10, 0, 0) });
            }
            var refBytes = _cache.Get("pbcRefNumber");
            string pbcRef = refBytes != null ? Encoding.Default.GetString(refBytes) : null;
            if (pbcRef == null)
            {
                pbcRef = (await _configRepository.Query(new ConfigQuery(IConfigRepository.PAYBC_PBCREFNUMBER_KEY), ct)).Value;
                _cache.Set("pbcRefNumber", Encoding.UTF8.GetBytes(pbcRef), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = new TimeSpan(10, 0, 0) });
            }

            //generate the link string 
            //payment utility
            var linkResult = (CreateDirectPaymentLinkResult)await _paymentService.HandleCommand(
                new CreateDirectPaymentLinkCommand
                {
                    RevenueAccount = revenueAccount,
                    PbcRefNumber = pbcRef,
                    Amount = command.PaymentLinkCreateRequest.Amount,
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
    }
}