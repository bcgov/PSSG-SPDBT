using AutoMapper;
using Spd.Resource.Applicants.Payment;

namespace Spd.Manager.Cases.Payment
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<PaybcPaymentResult, CreatePaymentCmd>()
                .ForMember(d => d.PaymentType, opt => opt.MapFrom(s => s.IsFromSecurePaymentLink ? PaymentTypeEnum.PayBC_SecurePaymentLink : PaymentTypeEnum.PayBC_OnSubmission));
            CreateMap<PaybcPaymentResult, UpdatePaymentCmd>();
            CreateMap<PaymentResp, PaymentResponse>()
                .ForMember(d => d.PaymentStatus, opt => opt.MapFrom(s => s.PaidSuccess? PaymentStatusCode.Success: PaymentStatusCode.Failure));
        }
    }
}
