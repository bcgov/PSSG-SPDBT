using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Payment
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<PaymentCmd, spd_payment>()
                .ForMember(d => d.spd_paymentid, opt => opt.MapFrom(s => Guid.NewGuid()))
                .ForMember(d => d.spd_amount, opt => opt.MapFrom(s => s.TransAmount))
                .ForMember(d => d.spd_manualpayment, opt => opt.MapFrom(s => (int)YesNoOptionSet.No))
                .ForMember(d => d.spd_transactionid, opt => opt.MapFrom(s => s.TransNumber))
                .ForMember(d => d.spd_paymenttype, opt => opt.MapFrom(s => (int)Enum.Parse<PaymentTypeOptionSet>(s.PaymentType.ToString())));

            _ = CreateMap<CreatePaymentCmd, spd_payment>()
                .IncludeBase<PaymentCmd, spd_payment>()
                .ForMember(d => d.statuscode, opt => opt.MapFrom(s => PaymentStatusCodeOptionSet.Pending))
                .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active));

            _ = CreateMap<UpdatePaymentCmd, spd_payment>()
                .ForMember(d => d.spd_manualpayment, opt => opt.MapFrom(s => (int)YesNoOptionSet.No))
                .ForMember(d => d.spd_response, opt => opt.MapFrom(s => GetResponseCode(s.Success)))
                .ForMember(d => d.spd_datetimeofpayment, opt => opt.MapFrom(s => s.TransDateTime))
                .ForMember(d => d.spd_errordescription, opt => opt.MapFrom(s => s.MessageText))
                .ForMember(d => d.spd_ordernumber, opt => opt.MapFrom(s => s.TransOrderId))
                .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Inactive))
                .ForMember(d => d.statuscode, opt => opt.MapFrom(s => (bool)s.Success ? (int)PaymentStatusCodeOptionSet.Successful : (int)PaymentStatusCodeOptionSet.Failure));

            _ = CreateMap<spd_payment, PaymentResp>()
                .ForMember(d => d.PaymentId, opt => opt.MapFrom(s => s.spd_paymentid))
                .ForMember(d => d.PaidSuccess, opt => opt.MapFrom(s => s.spd_response == (int)ResponseOptionSet.Success))
                .ForMember(d => d.PaymentStatus, opt => opt.MapFrom(s => GetPaymentStatus(s.spd_response)))
                .ForMember(d => d.Message, opt => opt.MapFrom(s => s.spd_errordescription))
                .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
                .ForMember(d => d.TransAmount, opt => opt.MapFrom(s => s.spd_amount))
                .ForMember(d => d.TransOrderId, opt => opt.MapFrom(s => s.spd_ordernumber))
                .ForMember(d => d.TransDateTime, opt => opt.MapFrom(s => s.spd_datetimeofpayment))
                .ForMember(d => d.PaymentType, opt => opt.MapFrom(s => GetPaymentType(s.spd_paymenttype)))
                .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_ApplicationId.spd_name));
        }

        private int? GetResponseCode(bool? success)
        {
            if (success == null) return null;
            if ((bool)success) return (int)ResponseOptionSet.Success;
            else return (int)ResponseOptionSet.Failure;
        }

        private PaymentStatusEnum GetPaymentStatus(int? response)
        {
            if (response == null) return PaymentStatusEnum.Cancelled;
            if (response == (int)ResponseOptionSet.Failure) return PaymentStatusEnum.Failure;
            return PaymentStatusEnum.Success;
        }

        private PaymentTypeEnum? GetPaymentType(int? paymentType)
        {
            if (paymentType == null) return null;

            return Enum.Parse<PaymentTypeEnum>(Enum.GetName(typeof(PaymentTypeOptionSet), paymentType));
        }
    }
}
