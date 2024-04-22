using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Biz
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<Biz, account>()
            .ForMember(d => d.accountid, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.AddressCity))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.AddressCountry))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.AddressPostalCode))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.AddressProvince))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ReverseMap();

            _ = CreateMap<account, BizResult>()
            .IncludeBase<account, Biz>()
            .ForMember(d => d.BizName, opt => opt.MapFrom(s => s.name))
            .ForMember(d => d.BizLegalName, opt => opt.MapFrom(s => s.spd_organizationlegalname))
            .ForMember(d => d.MaxContacts, opt => opt.MapFrom(s => s.spd_maximumnumberofcontacts))
            .ForMember(d => d.ParentBizId, opt => opt.MapFrom(s => s._parentaccountid_value))
            .ForMember(d => d.MaxPrimaryContacts, opt => opt.MapFrom(s => s.spd_noofprimaryauthorizedcontacts))
            .ForMember(d => d.ServiceTypes, opt => opt.MapFrom(s => GetServiceTypeEnums(s.spd_account_spd_servicetype)))
            .ForMember(d => d.AccessCode, opt => opt.MapFrom(s => s.spd_accesscode))
            .ForMember(d => d.HasInvoiceSupport, opt => opt.MapFrom(s => s.spd_eligibleforcreditpayment != null && s.spd_eligibleforcreditpayment == (int)YesNoOptionSet.Yes));
        }

        private static IEnumerable<ServiceTypeEnum>? GetServiceTypeEnums(IEnumerable<spd_servicetype> servicetypes)
        {
            return servicetypes.Select(s => Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(s.spd_servicetypeid))).ToArray();
        }
    }
}
