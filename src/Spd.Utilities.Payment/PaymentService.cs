using AutoMapper;
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

        public PaymentService(IOptions<PayBCSettings> config, ITokenProviderResolver tokenProviderResolver, IMapper mapper)
        {
            _config = config.Value;
            _tokenProviderResolver = tokenProviderResolver;
            _mapper = mapper;
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
    }
}
