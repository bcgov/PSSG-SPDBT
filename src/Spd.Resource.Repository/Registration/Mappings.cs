using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.Registration
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<OrgRegistration, spd_orgregistration>()
            .ForMember(d => d.spd_orgregistrationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_workswith, opt => opt.MapFrom(s => (int)Enum.Parse<WorksWithChildrenOptionSet>(s.EmployeeInteractionFlag.ToString())))
            .ForMember(d => d.spd_estimatedapplicationssubmittedperyear, opt => opt.MapFrom(s => (int)Enum.Parse<EstimatedApplicationsSubmittedPerYearOptionSet>(s.ScreeningsCount.ToString())))
            .ForMember(d => d.spd_payerpreference, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayerPreference.ToString())))
            .ForMember(d => d.spd_receivemoneycompensation, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.EmployeeMonetaryCompensationFlag.ToString())))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.MailingCity))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.MailingCountry))
            .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToTermsAndConditions))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.MailingPostalCode))
            .ForMember(d => d.spd_province, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MailingProvince)))
            .ForMember(d => d.spd_street1, opt => opt.MapFrom(s => s.MailingAddressLine1))
            .ForMember(d => d.spd_street2, opt => opt.MapFrom(s => s.MailingAddressLine2))
            .ForMember(d => d.spd_authorizedcontactemail, opt => opt.MapFrom(s => s.ContactEmail))
            .ForMember(d => d.spd_authorizedcontactgivenname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.ContactGivenName)))
            .ForMember(d => d.spd_authorizedcontactsurname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.ContactSurname)))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.ContactJobTitle)))
            .ForMember(d => d.spd_authorizedcontactphonenumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
            .ForMember(d => d.spd_organizationname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.OrganizationName)))
            .ForMember(d => d.spd_organizationlegalname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.OrganizationLegalName)))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.GenericEmail))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.GenericPhoneNumber))
            .ForMember(d => d.spd_identityguid, opt => opt.MapFrom(s => s.BizIdentityGuid))
            .ForMember(d => d.spd_identityprovider, opt => opt.MapFrom(s => GetPortalUserIdentityType(s.IdentityProviderTypeCode)))
            .ForMember(d => d.spd_portaluseridentityguid, opt => opt.MapFrom(s => s.BCeIDUserGuid))
            .ForMember(d => d.spd_potentialduplicate, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.HasPotentialDuplicate.ToString())))
            .ReverseMap()
            .ForMember(d => d.MailingProvince, opt => opt.MapFrom(s => s.spd_province))
            .ForMember(d => d.ContactGivenName, opt => opt.MapFrom(s => s.spd_authorizedcontactgivenname))
            .ForMember(d => d.ContactSurname, opt => opt.MapFrom(s => s.spd_authorizedcontactsurname))
            .ForMember(d => d.ContactJobTitle, opt => opt.MapFrom(s => s.spd_jobtitle))
            .ForMember(d => d.OrganizationName, opt => opt.MapFrom(s => s.spd_organizationname));

            _ = CreateMap<spd_orgregistration, OrgRegistrationResult>()
            .IncludeBase<spd_orgregistration, OrgRegistration>()
            .ForMember(d => d.CreatedOn, opt => opt.MapFrom(s => s.createdon))
            .ForMember(d => d.OrgRegistrationNumber, opt => opt.MapFrom(s => s.spd_registrationnumber))
            .ForMember(d => d.OrgRegistrationId, opt => opt.MapFrom(s => s.spd_orgregistrationid))
            .ForMember(d => d.OrgRegistrationStatusStr, opt => opt.MapFrom(s => ((OrgRegistrationStatus)s.statuscode).ToString()));
        }

        private static int? GetPortalUserIdentityType(IdentityProviderTypeEnum? code)
        {
            if (code == null) return null;
            return (int)Enum.Parse<IdentityTypeOptionSet>(code.ToString());
        }

    }
}
