using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.Org
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<Org, account>()
            .ForMember(d => d.accountid, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.AddressCity))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.AddressCountry))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.AddressPostalCode))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.AddressProvince))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.address1_telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_payerpreference, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayerPreference.ToString())))
            .ForMember(d => d.spd_havecontractors, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.ContractorsNeedVulnerableSectorScreening.ToString())))
            .ForMember(d => d.spd_havelicenseesorregistrants, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.LicenseesNeedVulnerableSectorScreening.ToString())))
            .ReverseMap()
            .ForMember(d => d.PayerPreference, opt => opt.MapFrom(s => GetPayerPreferenceType(s.spd_payerpreference)))
            .ForMember(d => d.ContractorsNeedVulnerableSectorScreening, opt => opt.MapFrom(s => GetBooleanType(s.spd_havecontractors)))
            .ForMember(d => d.LicenseesNeedVulnerableSectorScreening, opt => opt.MapFrom(s => GetBooleanType(s.spd_havelicenseesorregistrants)));

            _ = CreateMap<account, OrgResult>()
            .IncludeBase<account, Org>()
            .ForMember(d => d.OrganizationName, opt => opt.MapFrom(s => s.name))
            .ForMember(d => d.OrganizationLegalName, opt => opt.MapFrom(s => s.spd_organizationlegalname))
            .ForMember(d => d.MaxContacts, opt => opt.MapFrom(s => s.spd_maximumnumberofcontacts))
            .ForMember(d => d.MaxPrimaryContacts, opt => opt.MapFrom(s => s.spd_noofprimaryauthorizedcontacts))
            .ForMember(d => d.AccessCode, opt => opt.MapFrom(s => s.spd_accesscode));
        }

        private static string? GetPayerPreferenceType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(PayerPreferenceOptionSet), code);
        }

        private static string? GetBooleanType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(YesNoOptionSet), code);
        }
    }
}
