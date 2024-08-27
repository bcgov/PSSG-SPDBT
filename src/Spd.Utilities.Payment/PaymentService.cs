using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService(
        IOptions<PayBCSettings> settings,
        ITokenProviderResolver tokenProviderResolver,
        IMapper mapper,
        IHttpClientFactory httpClientFactory,
        ILogger<PaymentService> logger) : IPaymentService
    {
        private readonly PayBCSettings _config = settings.Value;

        public async Task<PaymentResult> HandleCommand(PaymentCommand cmd, CancellationToken ct = default)
        {
            return cmd switch
            {
                CreateDirectPaymentLinkCommand c => CreateDirectPaymentLinkAsync(c),
                ValidatePaymentResultStrCommand c => ValidatePaymentResultStrAsync(c),
                CreateInvoiceCmd c => await CreateInvoiceAsync(c, ct),
                RefundPaymentCmd c => await RefundDirectPaymentAsync(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<PaymentResult> HandleQuery(PaymentQuery cmd, CancellationToken ct = default)
        {
            return cmd switch
            {
                InvoiceStatusQuery c => await GetInvoiceStatusAsync(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }
    }
}