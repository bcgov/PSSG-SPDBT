using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.GDSDApp;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.RetiredDogApp;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<RetiredDogApp, spd_application>()
        .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
        .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
        .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName))
        .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
        .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
        .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<ApplicationOriginTypeEnum, ApplicationOriginOptionSet>(s.ApplicationOriginTypeCode)))
        .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
        .ForMember(d => d.spd_nameofapplicantorlegalguardian, opt => opt.MapFrom(s => s.ApplicantOrLegalGuardianName))
        .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine1)))
        .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine2)))
        .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.City)))
        .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.PostalCode)))
        .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Province)))
        .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Country)))
        .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
        .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
        .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(s.LicenceTermCode)))
        .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDeclarationDate(s.AgreeToCompleteAndAccurate)))
        .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => SharedMappingFuncs.GetIdentityConfirmed(s.ApplicationOriginTypeCode, s.ApplicationTypeCode.Value)))
        .ForMember(d => d.spd_dogsretirementdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DogRetiredDate)))
        .ForMember(d => d.spd_gdsdcertificatenumber, opt => opt.MapFrom(s => s.CurrentGDSDCertificateNumber))
        .ForMember(d => d.spd_dogtype, opt => opt.MapFrom(s => (int)DogTypeOptionSet.ServiceDog))
        .ForMember(d => d.spd_willdoglivewithhandlerinretirement, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.ConfirmDogLiveWithYouAfterRetire)))
        .AfterMap((s, d, context) =>
        {
            context.Mapper.Map<DogInfo, spd_application>(s.DogInfo, d);
        })
        .ReverseMap()
        .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
        .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(s.spd_origin)))
        .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
        .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
        .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.spd_dateofbirth)))
        .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)))
        .ForMember(d => d.DogInfo, opt => opt.MapFrom((src, dest, destMember, context) => GetDogInfo(src, context)))
        .ForMember(d => d.DogRetiredDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.spd_dogsretirementdate)))
        .ForMember(d => d.ConfirmDogLiveWithYouAfterRetire, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_willdoglivewithhandlerinretirement)));

        _ = CreateMap<RetiredDogApp, contact>()
        .ForMember(d => d.contactid, opt => opt.Condition((src, dest, srcMember) => dest.contactid == null))
        .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName)))
        .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
        .ForMember(d => d.middlename, opt => opt.Ignore())
        .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
        .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
        .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine1)))
        .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine2)))
        .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.City)))
        .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.PostalCode)))
        .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Province)))
        .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Country)))
        .ReverseMap()
        .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
        .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)));

        _ = CreateMap<DogInfo, spd_application>()
        .ForMember(d => d.spd_dogname, opt => opt.MapFrom(s => s.DogName))
        .ForMember(d => d.spd_dogsdateofbirth, opt => opt.MapFrom(s => s.DogDateOfBirth))
        .ForMember(d => d.spd_dogbreed, opt => opt.MapFrom(s => s.DogBreed))
        .ForMember(d => d.spd_dogcolourandmarkings, opt => opt.MapFrom(s => s.DogColorAndMarkings))
        .ForMember(d => d.spd_dogsgender, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<GenderEnum, GenderOptionSet>(s.DogGender)))
        .ForMember(d => d.spd_microchipnumber, opt => opt.MapFrom(s => s.MicrochipNumber))
        .ReverseMap()
        .ForMember(d => d.DogGender, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<GenderOptionSet, GenderEnum>(s.spd_dogsgender)))
        ;

        CreateMap<SaveRetiredDogAppCmd, spd_application>()
         .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
         .ForMember(d => d.spd_applicationid, opt => opt.Ignore())
         .IncludeBase<RetiredDogApp, spd_application>();

        CreateMap<CreateRetiredDogAppCmd, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .IncludeBase<RetiredDogApp, spd_application>();

        _ = CreateMap<spd_application, RetiredDogAppResp>()
         .IncludeBase<spd_application, RetiredDogApp>()
          .ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
          .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
          .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
          .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s._spd_applicantid_value))
          ;
    }

    private static DogInfo? GetDogInfo(spd_application app, ResolutionContext context)
    {
        return context.Mapper.Map<DogInfo>(app);
    }

}
