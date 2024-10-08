using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Payment
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<CreatePaymentCmd, spd_payment>()
                .ForMember(d => d.spd_paymentid, opt => opt.MapFrom(s => s.PaymentId))
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

            _ = CreateMap<UpdatePaymentCmd, spd_payment>()
               .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Inactive))
               .ForMember(d => d.spd_refunderrordescription, opt => opt.MapFrom(s => s.RefundErrorMsg))
               .ForMember(d => d.spd_refundid, opt => opt.MapFrom(s => s.RefundId))
               .ForMember(d => d.spd_refunddate, opt => opt.MapFrom(s => s.RefundTxnDateTime));

            _ = CreateMap<spd_payment, PaymentResp>()
                .ForMember(d => d.PaymentId, opt => opt.MapFrom(s => s.spd_paymentid))
                .ForMember(d => d.PaidSuccess, opt => opt.MapFrom(s => s.spd_response == (int)ResponseOptionSet.Success))
                .ForMember(d => d.Message, opt => opt.MapFrom(s => s.spd_errordescription))
                .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
                .ForMember(d => d.TransAmount, opt => opt.MapFrom(s => s.spd_amount))
                .ForMember(d => d.TransOrderId, opt => opt.MapFrom(s => s.spd_ordernumber))
                .ForMember(d => d.TransDateTime, opt => opt.MapFrom(s => s.spd_datetimeofpayment))
                .ForMember(d => d.TransactionNumber, opt => opt.MapFrom(s => s.spd_transactionid))
                .ForMember(d => d.PaymentType, opt => opt.MapFrom(s => GetPaymentType(s.spd_paymenttype)))
                .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_ApplicationId.spd_licenceterm)))
                .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_ApplicationId.spd_licenceapplicationtype)))
                .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_ApplicationId.spd_name))
                .ForMember(d => d.Refunded, opt => opt.MapFrom(s => s.statuscode == (int)PaymentStatusCodeOptionSet.Refunded))
                .ForMember(d => d.ApplicationEmail, opt => opt.MapFrom(s => s.spd_ApplicationId.spd_emailaddress1))
                .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s.spd_ApplicationId._spd_organizationid_value))
                .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => SharedMappingFuncs.GetPayeeType(s.spd_ApplicationId.spd_payer)))
                .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s.spd_ApplicationId._spd_servicetypeid_value)));
        }

        private int? GetResponseCode(bool? success)
        {
            if (success == null) return null;
            if ((bool)success) return (int)ResponseOptionSet.Success;
            else return (int)ResponseOptionSet.Failure;
        }

        private PaymentTypeEnum? GetPaymentType(int? paymentType)
        {
            if (paymentType == null) return null;

            return Enum.Parse<PaymentTypeEnum>(Enum.GetName(typeof(PaymentTypeOptionSet), paymentType));
        }
    }
}
