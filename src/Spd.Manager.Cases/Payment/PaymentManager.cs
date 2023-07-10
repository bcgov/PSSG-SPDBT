using MediatR;
using Spd.Manager.Cases.Application;
using Spd.Utilities.Payment;
using Spd.Utilities.Shared.ManagerContract;

namespace Spd.Manager.Cases.Payment
{
    internal class PaymentManager :
        IRequestHandler<PaymentLinkCreateCommand, PaymentLinkResponse>,
        IPaymentManager
    {
        private readonly IPaymentService _paymentService;

        public PaymentManager(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        public async Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand request, CancellationToken ct)
        {
            //get config from Dynamics
            //config Repository

            //generate the link string 
            //payment utility
            var linkResult = (CreateDirectPaymentLinkResult)await _paymentService.HandleCommand(
                new CreateDirectPaymentLinkCommand
                {
                    RevenueAccount = "039.18ACE.14691.8928.1800000.000000.0000",
                    PbcRefNumber= "10015",
                    Amount=50.27M,
                    Description="peggytest",
                    PaymentMethod=PaymentMethodEnum.CC,
                    RedirectUrl= "https://spd-screening-portal-dev.apps.emerald.devops.gov.bc.ca",
                    Ref1="ref1",
                    Ref2="ref2",
                    Ref3="ref3"
                }, ct);


            return new PaymentLinkResponse
            {
                PaymentLinkUrl = linkResult.PaymentLinkUrl,
            };
        }
    }
}