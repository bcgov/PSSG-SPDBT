using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<CreateRegistrationCmd, Spd_orgregistration>()
            .ForMember(d => d.Spd_source, opt => opt.MapFrom(s => SourceOptionSet.Online))
            .ForMember(d => d.Spd_orgregistrationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.Spd_registrationtype, opt => opt.MapFrom(s => (int)Enum.Parse<RegistrationTypeOptionSet>(s.RegistrationTypeCode.ToString())))
            .ForMember(d => d.Spd_employerorganizationtype, opt =>
            {
                opt.PreCondition(s => s.EmployerOrganizationTypeCode.HasValue);
                opt.MapFrom(s => (int)Enum.Parse<EmployerOrganizationTypeOptionSet>(s.EmployerOrganizationTypeCode.ToString()));
            })
            .ForMember(d => d.Spd_volunteerorganizationtype, opt =>
            {
                opt.PreCondition(s => s.VolunteerOrganizationTypeCode.HasValue);
                opt.MapFrom(s => (int)Enum.Parse<VolunteerOrganizationTypeOptionSet>(s.VolunteerOrganizationTypeCode.ToString()));
            })
            .ForMember(d => d.Spd_fundsfrombcgovtexceedsthreshold, opt => opt.MapFrom(s => (int)Enum.Parse<FundsFromBcGovtExceedsThresholdOptionSet>(s.OperatingBudgetFlag.ToString())))
            .ForMember(d => d.Spd_workswith, opt => opt.MapFrom(s => (int)Enum.Parse<WorksWithChildrenOptionSet>(s.EmployeeInteractionFlag.ToString())))
            .ForMember(d => d.Spd_estimatedapplicationssubmittedperyear, opt => opt.MapFrom(s => (int)Enum.Parse<EstimatedApplicationsSubmittedPerYearOptionSet>(s.ScreeningsCount.ToString())))
            .ForMember(d => d.Spd_payerpreference, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayerPreference.ToString())))
            .ForMember(d => d.Spd_receivemoneycompensation, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.EmployeeMonetaryCompensationFlag.ToString())))
            .ForMember(d => d.Spd_city, opt => opt.MapFrom(s => s.MailingCity))
            .ForMember(d => d.Spd_country, opt => opt.MapFrom(s => s.MailingCountry))
            .ForMember(d => d.Spd_postalcode, opt => opt.MapFrom(s => s.MailingPostalCode))
            .ForMember(d => d.Spd_province, opt => opt.MapFrom(s => s.MailingProvince))
            .ForMember(d => d.Spd_street1, opt => opt.MapFrom(s => s.MailingAddressLine1))
            .ForMember(d => d.Spd_street2, opt => opt.MapFrom(s => s.MailingAddressLine2))
            .ForMember(d => d.Spd_authorizedcontactdateofbirth, opt => opt.MapFrom(s => s.ContactDateOfBirth))
            .ForMember(d => d.Spd_authorizedcontactemail, opt => opt.MapFrom(s => s.ContactEmail))
            .ForMember(d => d.Spd_authorizedcontactgivenname, opt => opt.MapFrom(s => s.ContactGivenName))
            .ForMember(d => d.Spd_authorizedcontactsurname, opt => opt.MapFrom(s => s.ContactSurname))
            .ForMember(d => d.Spd_jobtitle, opt => opt.MapFrom(s => s.ContactJobTitle))
            .ForMember(d => d.Spd_authorizedcontactphonenumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
            .ForMember(d => d.Spd_organizationname, opt => opt.MapFrom(s => s.OrganizationName))
            .ForMember(d => d.Spd_email, opt => opt.MapFrom(s => s.GenericEmail))
            .ForMember(d => d.Spd_phonenumber, opt => opt.MapFrom(s => s.GenericPhoneNumber));
        }
    }
}
