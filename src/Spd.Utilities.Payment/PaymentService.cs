using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService : IPaymentService
    {
        private readonly PayBCSettings _config;
        private readonly ITokenProviderResolver _tokenProviderResolver;
        private readonly IMapper _mapper;
        private readonly ILogger<IPaymentService> _logger;

        public PaymentService(IOptions<PayBCSettings> config, ITokenProviderResolver tokenProviderResolver, IMapper mapper, ILogger<IPaymentService> logger)
        {
            _config = config.Value;
            _tokenProviderResolver = tokenProviderResolver;
            _mapper = mapper;
            _logger = logger;
        }
        public async Task<PaymentResult> HandleCommand(PaymentCommand cmd)
        {
            return cmd switch
            {
                CreateDirectPaymentLinkCommand c => await CreateDirectPaymentLinkAsync(c),
                ValidatePaymentResultStrCommand c => await ValidatePaymentResultStrAsync(c),
                CreateInvoiceCmd c => await CreateInvoiceAsync(c),
                RefundPaymentCmd c => await RefundDirectPaymentAsync(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<PaymentResult> HandleQuery(PaymentQuery cmd)
        {
            return cmd switch
            {
                InvoiceStatusQuery c => await GetInvoiceStatusAsync(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }
    }
}
