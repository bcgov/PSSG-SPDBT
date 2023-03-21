using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.Org
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<OrgUpdateCmd, account>()
            .ForMember(d => d.accountid, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.name, opt => opt.MapFrom(s => s.OrganizationName))
            .ForMember(d => d.spd_organizationlegalname, opt => opt.MapFrom(s => s.OrganizationLegalName))
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
            .ForMember(d => d.spd_havelicenseesorregistrants, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.LicenseesNeedVulnerableSectorScreening.ToString())));

            _ = CreateMap<account, OrgResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.accountid))
            .ForMember(d => d.OrganizationName, opt => opt.MapFrom(s => s.name))
            .ForMember(d => d.OrganizationLegalName, opt => opt.MapFrom(s => s.spd_organizationlegalname))
            .ForMember(d => d.AddressCity, opt => opt.MapFrom(s => s.address1_city))
            .ForMember(d => d.AddressCountry, opt => opt.MapFrom(s => s.address1_country))
            .ForMember(d => d.AddressPostalCode, opt => opt.MapFrom(s => s.address1_postalcode))
            .ForMember(d => d.AddressProvince, opt => opt.MapFrom(s => s.address1_stateorprovince))
            .ForMember(d => d.AddressLine1, opt => opt.MapFrom(s => s.address1_line1))
            .ForMember(d => d.AddressLine2, opt => opt.MapFrom(s => s.address1_line2))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.emailaddress1))
            .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.address1_telephone1))
            .ForMember(d => d.PayerPreference, opt => opt.MapFrom(s => GetPayerPreferenceType(s.spd_payerpreference)))
            .ForMember(d => d.ContractorsNeedVulnerableSectorScreening, opt => opt.MapFrom(s => GetBooleanType(s.spd_havecontractors)))
            .ForMember(d => d.LicenseesNeedVulnerableSectorScreening, opt => opt.MapFrom(s => GetBooleanType(s.spd_havelicenseesorregistrants)));
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
