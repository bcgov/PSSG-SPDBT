using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.DogTrainerApp;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<DogTrainerApp, spd_application>()
        .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
        .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.TrainerGivenName))
        .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.TrainerSurname))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.TrainerMiddleName))
        .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.TrainerDateOfBirth)))
        .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.TrainerEmailAddress))
        .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.TrainerPhoneNumber))
        .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<ApplicationOriginTypeEnum, ApplicationOriginOptionSet>(s.ApplicationOriginTypeCode)))
        .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
        .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.AddressLine1)))
        .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.AddressLine2)))
        .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.City)))
        .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.PostalCode)))
        .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.Province)))
        .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.Country)))
        .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
        .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
        .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(s.LicenceTermCode)))
        .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => true))
        .ReverseMap()
        .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
        .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(s.spd_origin)))
        .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
        .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
        .ForMember(d => d.TrainerDateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.spd_dateofbirth)))
        .ForMember(d => d.TrainerMailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)))
        ;

        _ = CreateMap<DogTrainerApp, contact>()
        .ForMember(d => d.contactid, opt => opt.Condition((src, dest, srcMember) => dest.contactid == null))
        .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.TrainerGivenName)))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.TrainerMiddleName)))
        .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.TrainerSurname)))
        .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.TrainerEmailAddress))
        .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.TrainerDateOfBirth)))
        .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.TrainerPhoneNumber))
        .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.AddressLine1)))
        .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.AddressLine2)))
        .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.City)))
        .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.PostalCode)))
        .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.Province)))
        .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.Country)))
        .ReverseMap()
        .ForMember(d => d.TrainerDateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
        .ForMember(d => d.TrainerMailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)))
        ;

        _ = CreateMap<CreateDogTrainerAppCmd, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .IncludeBase<DogTrainerApp, spd_application>();

        _ = CreateMap<CreateDogTrainerAppCmd, spd_dogtrainingschool>()
         .ForMember(d => d.spd_dogtrainingschoolid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_trainingschoolname, opt => opt.MapFrom(s => s.AccreditedSchoolName))
         .ForMember(d => d.spd_contactemail, opt => opt.MapFrom(s => s.SchoolContactEmailAddress))
         .ForMember(d => d.spd_contactphone, opt => opt.MapFrom(s => s.SchoolContactPhoneNumber))
         .ForMember(d => d.spd_trainingschooltype, opt => opt.MapFrom(s => (int)DogTrainingSchoolTypeOptionSet.DogTrainerAccreditedSchool))
         .ForMember(d => d.spd_chiefexecutivelegalfirstname, opt => opt.MapFrom(s => s.SchoolDirectorGivenName))
         .ForMember(d => d.spd_chiefexecutivelegalmiddlename, opt => opt.MapFrom(s => s.SchoolDirectorMiddleName))
         .ForMember(d => d.spd_chiefexecutivelegalsurname, opt => opt.MapFrom(s => s.SchoolDirectorSurname));

        _ = CreateMap<spd_dogtrainingschool, DogTrainerApp>()
           .ForMember(d => d.AccreditedSchoolId, opt => opt.MapFrom(s => s._spd_organizationid_value))
           .ForMember(d => d.AccreditedSchoolName, opt => opt.MapFrom(s => s.spd_trainingschoolname))
           .ForMember(d => d.SchoolContactEmailAddress, opt => opt.MapFrom(s => s.spd_contactemail))
           .ForMember(d => d.SchoolContactPhoneNumber, opt => opt.MapFrom(s => s.spd_contactphone))
           .ForMember(d => d.SchoolDirectorGivenName, opt => opt.MapFrom(s => s.spd_chiefexecutivelegalfirstname))
           .ForMember(d => d.SchoolDirectorMiddleName, opt => opt.MapFrom(s => s.spd_chiefexecutivelegalmiddlename))
           .ForMember(d => d.SchoolDirectorSurname, opt => opt.MapFrom(s => s.spd_chiefexecutivelegalsurname));

        _ = CreateMap<spd_application, DogTrainerAppResp>()
            .IncludeBase<spd_application, DogTrainerApp>()
            .ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
            .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
            .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
            .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.spd_ApplicantId_contact.contactid))
            ;

        _ = CreateMap<spd_dogtrainingschool, DogTrainerAppResp>()
            .IncludeBase<spd_dogtrainingschool, DogTrainerApp>();
    }
}
