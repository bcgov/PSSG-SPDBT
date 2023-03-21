using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.Registration
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<OrgRegistrationCreateCmd, spd_orgregistration>()
            .ForMember(d => d.spd_orgregistrationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_fundsfrombcgovtexceedsthreshold, opt => opt.MapFrom(s => (int)Enum.Parse<FundsFromBcGovtExceedsThresholdOptionSet>(s.OperatingBudgetFlag.ToString())))
            .ForMember(d => d.spd_workswith, opt => opt.MapFrom(s => (int)Enum.Parse<WorksWithChildrenOptionSet>(s.EmployeeInteractionFlag.ToString())))
            .ForMember(d => d.spd_estimatedapplicationssubmittedperyear, opt => opt.MapFrom(s => (int)Enum.Parse<EstimatedApplicationsSubmittedPerYearOptionSet>(s.ScreeningsCount.ToString())))
            .ForMember(d => d.spd_payerpreference, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayerPreference.ToString())))
            .ForMember(d => d.spd_receivemoneycompensation, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.EmployeeMonetaryCompensationFlag.ToString())))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.MailingCity))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.MailingCountry))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.MailingPostalCode))
            .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.MailingProvince))
            .ForMember(d => d.spd_street1, opt => opt.MapFrom(s => s.MailingAddressLine1))
            .ForMember(d => d.spd_street2, opt => opt.MapFrom(s => s.MailingAddressLine2))
            .ForMember(d => d.spd_authorizedcontactdateofbirth, opt => opt.MapFrom(s => s.ContactDateOfBirth))
            .ForMember(d => d.spd_authorizedcontactemail, opt => opt.MapFrom(s => s.ContactEmail))
            .ForMember(d => d.spd_authorizedcontactgivenname, opt => opt.MapFrom(s => s.ContactGivenName))
            .ForMember(d => d.spd_authorizedcontactsurname, opt => opt.MapFrom(s => s.ContactSurname))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.ContactJobTitle))
            .ForMember(d => d.spd_authorizedcontactphonenumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
            .ForMember(d => d.spd_organizationname, opt => opt.MapFrom(s => s.OrganizationName))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.GenericEmail))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.GenericPhoneNumber))
            .ForMember(d => d.spd_identityguid, opt => opt.MapFrom(s => s.LoginIdentityGuid))
            .ForMember(d => d.spd_identityprovider, opt => opt.MapFrom(s => s.LoginIdentityProvider))
            .ForMember(d => d.spd_portaluseridentityguid, opt => opt.MapFrom(s => GetPortalUserIdentityType(s.PortalUserIdentityTypeCode)));
        }

        private static int? GetPortalUserIdentityType(PortalUserIdentityTypeCode? code)
        {
            if (code == null) return null;
            return (int)Enum.Parse<PortalUserIdentityTypeCode>(code.ToString());
        }

    }
}
