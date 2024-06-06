using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Org
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
            .ForMember(d => d.spd_workswith, opt => opt.MapFrom(s => GetWorkWithOptionSet(s.EmployeeInteractionType)))
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_payerpreference, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayerPreference.ToString())))
            .ForMember(d => d.spd_havecontractors, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.ContractorsNeedVulnerableSectorScreening.ToString())))
            .ForMember(d => d.spd_havelicenseesorregistrants, opt => opt.MapFrom(s => GetLicenseesNeedVulnerableSectorScreening(s.LicenseesNeedVulnerableSectorScreening)))
            .ReverseMap()
            .ForMember(d => d.PayerPreference, opt => opt.MapFrom(s => GetPayerPreferenceType(s.spd_payerpreference)))
            .ForMember(d => d.ContractorsNeedVulnerableSectorScreening, opt => opt.MapFrom(s => GetBooleanType(s.spd_havecontractors)))
            .ForMember(d => d.EmployeeInteractionType, opt => opt.MapFrom(s => GetEmployeeInteractionCode(s.spd_workswith)))
            .ForMember(d => d.LicenseesNeedVulnerableSectorScreening, opt => opt.MapFrom(s => GetBooleanType(s.spd_havelicenseesorregistrants)));

            _ = CreateMap<account, OrgResult>()
            .IncludeBase<account, Org>()
            .ForMember(d => d.GenericUploadEnabled, opt => opt.MapFrom(s => s.spd_allowgenericuploads != null && s.spd_allowgenericuploads == (int)YesNoOptionSet.Yes))
            .ForMember(d => d.OrganizationName, opt => opt.MapFrom(s => s.name))
            .ForMember(d => d.OrganizationLegalName, opt => opt.MapFrom(s => s.spd_organizationlegalname))
            .ForMember(d => d.MaxContacts, opt => opt.MapFrom(s => s.spd_maximumnumberofcontacts))
            .ForMember(d => d.ParentOrgId, opt => opt.MapFrom(s => s._parentaccountid_value))
            .ForMember(d => d.MaxPrimaryContacts, opt => opt.MapFrom(s => s.spd_noofprimaryauthorizedcontacts))
            .ForMember(d => d.ServiceTypes, opt => opt.MapFrom(s => GetServiceTypeEnums(s.spd_account_spd_servicetype)))
            .ForMember(d => d.AccessCode, opt => opt.MapFrom(s => s.spd_accesscode))
            .ForMember(d => d.HasInvoiceSupport, opt => opt.MapFrom(s => s.spd_eligibleforcreditpayment != null && s.spd_eligibleforcreditpayment == (int)YesNoOptionSet.Yes))
            .ForMember(d => d.EmployeeOrganizationTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetTypeFromTypeId(s._spd_organizationtypeid_value).Item1))
            .ForMember(d => d.VolunteerOrganizationTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetTypeFromTypeId(s._spd_organizationtypeid_value).Item2));
        }

        private static int? GetLicenseesNeedVulnerableSectorScreening(BooleanTypeCode? code)
        {
            if (code == null) return null;
            return (int)Enum.Parse<YesNoOptionSet>(code.ToString());
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

        private static EmployeeInteractionTypeCode? GetEmployeeInteractionCode(int? code)
        {
            if (code == null) return null;
            string? enumName = Enum.GetName(typeof(WorksWithChildrenOptionSet), code);
            if (enumName == null) return null;
            return Enum.Parse<EmployeeInteractionTypeCode>(enumName);
        }

        private static WorksWithChildrenOptionSet? GetWorkWithOptionSet(EmployeeInteractionTypeCode? code)
        {
            if (code == null || code == EmployeeInteractionTypeCode.Neither) return null;
            return Enum.Parse<WorksWithChildrenOptionSet>(code.ToString());
        }

        private static IEnumerable<ServiceTypeEnum>? GetServiceTypeEnums(IEnumerable<spd_servicetype> servicetypes)
        {
            return servicetypes.Select(s => Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.GetServiceTypeName(s.spd_servicetypeid))).ToArray();
        }
    }
}
