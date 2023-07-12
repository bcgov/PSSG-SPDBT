using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Payment
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<CreatePaymentCmd, spd_payment>()
                .ForMember(d => d.spd_paymentid, opt => opt.MapFrom(s => Guid.NewGuid()))
                .ForMember(d => d.spd_amount, opt => opt.MapFrom(s => s.TransAmount))
                .ForMember(d => d.spd_datetimeofpayment, opt => opt.MapFrom(s => s.TransDate))
                .ForMember(d => d.spd_errordescription, opt => opt.MapFrom(s => s.MessageText))
                .ForMember(d => d.spd_manualpayment, opt => opt.MapFrom(s => YesNoOptionSet.No))
                .ForMember(d => d.spd_ordernumber, opt => opt.MapFrom(s => s.TransOrderId))
                .ForMember(d => d.spd_transactionid, opt => opt.MapFrom(s => s.TransNumber))
                .ForMember(d => d.spd_paymenttype, opt => opt.MapFrom(s => PaymentTypeOptionSet.CreditCard))
                .ForMember(d => d.spd_response, opt => opt.MapFrom(s => s.Success ? ResponseOptionSet.Success : ResponseOptionSet.Failure));

            _ = CreateMap<CreatePaymentCmd, spd_payment>()
    .ForMember(d => d.spd_paymentid, opt => opt.MapFrom(s => Guid.NewGuid()))
    .ForMember(d => d.spd_amount, opt => opt.MapFrom(s => s.TransAmount))
    .ForMember(d => d.spd_datetimeofpayment, opt => opt.MapFrom(s => s.TransDate))
    .ForMember(d => d.spd_errordescription, opt => opt.MapFrom(s => s.MessageText))
    .ForMember(d => d.spd_manualpayment, opt => opt.MapFrom(s => YesNoOptionSet.No))
    .ForMember(d => d.spd_ordernumber, opt => opt.MapFrom(s => s.TransOrderId))
    .ForMember(d => d.spd_transactionid, opt => opt.MapFrom(s => s.TransNumber))
    .ForMember(d => d.spd_paymenttype, opt => opt.MapFrom(s => PaymentTypeOptionSet.CreditCard))
    .ForMember(d => d.spd_response, opt => opt.MapFrom(s => s.Success ? ResponseOptionSet.Success : ResponseOptionSet.Failure));
        }


    }
}
