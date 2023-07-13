using AutoMapper;
using Spd.Resource.Applicants.Payment;

namespace Spd.Manager.Cases.Payment
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<PaybcPaymentResult, UpdatePaymentCmd>();
            CreateMap<PaymentResp, PaymentResponse>();
        }


    }
}
