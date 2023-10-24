using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Applicants.Payment;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Licence
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<SaveLicenceCmd, spd_application>()
                .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
                .ForMember(d => d.spd_amount, opt => opt.MapFrom(s => s.TransAmount))
                .ForMember(d => d.spd_manualpayment, opt => opt.MapFrom(s => 0))
                .ForMember(d => d.spd_transactionid, opt => opt.MapFrom(s => s.TransNumber))
                .ForMember(d => d.spd_paymenttype, opt => opt.MapFrom(s => (int)Enum.Parse<PaymentTypeOptionSet>(s.PaymentType.ToString())))
                .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
                .ForMember(d => d.spd_response, opt => opt.MapFrom(s => GetResponseCode(s.Success)))
                .ForMember(d => d.spd_datetimeofpayment, opt => opt.MapFrom(s => s.TransDateTime))
                .ForMember(d => d.spd_errordescription, opt => opt.MapFrom(s => s.MessageText))
                .ForMember(d => d.spd_ordernumber, opt => opt.MapFrom(s => s.TransOrderId))
                .ForMember(d => d.statuscode, opt => opt.MapFrom(s => PaymentStatusCodeOptionSet.Pending));
        }

    }
}
