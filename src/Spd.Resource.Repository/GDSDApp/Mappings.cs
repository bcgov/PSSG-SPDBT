using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.GDSDApp;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<GDSDApp, spd_application>()
        .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
        .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
        .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName))
        .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.ContactEmailAddress))
        .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
        .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<ApplicationOriginTypeEnum, ApplicationOriginOptionSet>(s.ApplicationOriginTypeCode)))
        .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
        .ForMember(d => d.spd_nameofapplicantorlegalguardian, opt => opt.MapFrom(s => s.ApplicantOrLegalGuardianName))
        .ForMember(d => d.spd_dogstrainingaccredited, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsDogTrainedByAccreditedSchool)))
        //.ForMember(d => d.spd_dogname, opt => opt.MapFrom(s => s.IsDogTrainedByAccreditedSchool? s.DogInfoNewAccreditedSchool.DogName: s.DogInfoNewWithoutAccreditedSchool.DogName)) //refine
        .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine1)))
        .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine2)))
        .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.City)))
        .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.PostalCode)))
        .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Province)))
        .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Country)))
        .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
        .ForMember(d => d.spd_uploadeddocuments, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentOptionSets(s.UploadedDocumentEnums)))
        .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
        .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(s.LicenceTermCode)))
        .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDeclarationDate(s.AgreeToCompleteAndAccurate)))
        .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => SharedMappingFuncs.GetIdentityConfirmed(s.ApplicationOriginTypeCode, s.ApplicationTypeCode.Value)))
        .ReverseMap()
        .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
        .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(s.spd_origin)))
        .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
        .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
        .ForMember(d => d.UploadedDocumentEnums, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentEnums(s.spd_uploadeddocuments)));
        //.ForMember(d => d.ExpiredLicenceNumber, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licencenumber));

        _ = CreateMap<DogInfoRenew, spd_application>()
        .ForMember(d => d.spd_dogname, opt => opt.MapFrom(s => s.DogName))
        // .ForMember(d => d.spd_do, opt => opt.MapFrom(s => s.IsAssistanceStillRequired))
        //.ForMember(d => d.spd_do, opt => opt.MapFrom(s => s.CurrentDogCertificate))
        ;

        _ = CreateMap<DogInfoNewAccreditedSchool, spd_application>()
        .ForMember(d => d.spd_dogtype, opt => opt.MapFrom(s => s.IsGuideDog)) //refine
        .ForMember(d => d.spd_dogsassistanceindailyliving, opt => opt.MapFrom(s => s.ServiceDogTasks)) //refine
        .IncludeBase<DogInfoNew, spd_application>();
        ;

        _ = CreateMap<DogInfoNew, spd_application>()
        .ForMember(d => d.spd_dogname, opt => opt.MapFrom(s => s.DogName))
        .ForMember(d => d.spd_dogsdateofbirth, opt => opt.MapFrom(s => s.DogDateOfBirth))
        .ForMember(d => d.spd_dogbreed, opt => opt.MapFrom(s => s.DogBreed))
        .ForMember(d => d.spd_dogcolourandmarkings, opt => opt.MapFrom(s => s.DogColorAndMarkings))
        .ForMember(d => d.spd_dogsgender, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<GenderEnum, GenderOptionSet>(s.DogGender)))
        .ForMember(d => d.spd_microchipnumber, opt => opt.MapFrom(s => s.MicrochipNumber))
        ;

        _ = CreateMap<GraduationInfo, spd_dogtrainingschool>();
        //.ForMember(d => d.spd_, opt => opt.MapFrom(s => s.DogName))
        //.ForMember(d => d.spd_dogsdateofbirth, opt => opt.MapFrom(s => s.DogDateOfBirth))
        //.ForMember(d => d.spd_dogbreed, opt => opt.MapFrom(s => s.DogBreed))
        //.ForMember(d => d.spd_dogcolourandmarkings, opt => opt.MapFrom(s => s.DogColorAndMarkings))
        //.ForMember(d => d.spd_dogsgender, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<GenderEnum, GenderOptionSet>(s.DogGender)))
        //.ForMember(d => d.spd_microchipnumber, opt => opt.MapFrom(s => s.MicrochipNumber));

        CreateMap<SaveGDSDAppCmd, spd_application>()
         .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => s.LicenceAppId ?? Guid.NewGuid()))
         .IncludeBase<GDSDApp, spd_application>();

        CreateMap<CreateGDSDAppCmd, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .IncludeBase<GDSDApp, spd_application>();

        _ = CreateMap<spd_application, GDSDAppResp>()
         //.ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.spd_ApplicantId_contact.contactid))
         //.ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_CurrentExpiredLicenceId.spd_expirydate)))
         //.ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
         //.ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
         //.ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
         //.ForMember(d => d.OriginalLicenceTermCode, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : SharedMappingFuncs.GetLicenceTermEnum(s.spd_CurrentExpiredLicenceId.spd_licenceterm)))
         //.ForMember(d => d.BizId, opt => opt.MapFrom(s => s.spd_ApplicantId_account == null ? null : s.spd_ApplicantId_account.accountid))
         //.ForMember(d => d.ExpiredLicenceId, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licenceid))
         //.ForMember(d => d.HasExpiredLicence, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? false : true))
         //.ForMember(d => d.PrivateInvestigatorSwlInfo, opt => opt.Ignore())
         //.ForMember(d => d.SoleProprietorSWLAppId, opt => opt.MapFrom(s => GetSwlAppId(s.spd_businessapplication_spd_workerapplication.ToList())))
         //.ForMember(d => d.SoleProprietorSWLAppOriginTypeCode, opt => opt.MapFrom(s => GetSwlAppOrigin(s.spd_businessapplication_spd_workerapplication.ToList())))
         //.ForMember(d => d.NonSwlControllingMemberCrcAppIds, opt => opt.MapFrom(s => GetNonSwlCmAppIds(s.spd_businessapplication_spd_workerapplication.ToList())))
         .IncludeBase<spd_application, GDSDApp>();
    }

}
