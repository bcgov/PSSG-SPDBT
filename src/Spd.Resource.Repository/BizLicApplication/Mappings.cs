using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.BizLicApplication;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<BizLicApplication, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
         .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
         .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
         .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
         .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
         .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
         .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
         .ForMember(d => d.spd_businessmanagerfirstname, opt => opt.MapFrom(s => s.ManagerGivenName))
         .ForMember(d => d.spd_businessmanagersurname, opt => opt.MapFrom(s => s.ManagerSurname))
         .ForMember(d => d.spd_businessmanagermiddlename1, opt => opt.MapFrom(s => s.ManagerMiddleName1))
         .ForMember(d => d.spd_businessmanagermiddlename2, opt => opt.MapFrom(s => s.ManagerMiddleName2))
         .ForMember(d => d.spd_businessmanageremail, opt => opt.MapFrom(s => s.ManagerEmailAddress))
         .ForMember(d => d.spd_businessmanagerphone, opt => opt.MapFrom(s => s.ManagerPhoneNumber))
         .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => (int)ApplicationOriginOptionSet.Portal))
         .ForMember(d => d.spd_payer, opt => opt.MapFrom(s => (int)PayerPreferenceOptionSet.Applicant))
         .ForMember(d => d.spd_businesstype, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizType(s.BizTypeCode)))
         .ForMember(d => d.spd_requestdogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.UseDogs)))
         .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
         .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
         .ForMember(d => d.spd_uploadeddocuments, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentOptionSets(s.UploadedDocumentEnums)))
         .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .ForMember(d => d.spd_nologoorbranding, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.NoBranding)))
         .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => GetLicenceTerm(s.LicenceTermCode)))
         .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => GetDeclarationDate(s)))
         .ReverseMap()
         .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
         .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
         .ForMember(d => d.BizTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeEnum(s.spd_businesstype)))
         .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
         .ForMember(d => d.NoBranding, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_nologoorbranding)))
         .ForMember(d => d.UseDogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestdogs)))
         .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => SharedMappingFuncs.GetWorkerCategoryTypeEnums(s.spd_application_spd_licencecategory)))
         .ForMember(d => d.UploadedDocumentEnums, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentEnums(s.spd_uploadeddocuments)))
         .ForMember(d => d.ExpiredLicenceNumber, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licencenumber))
         .ForMember(d => d.ApplicantIsBizManager, opt => opt.MapFrom(s => IsApplicantBizManager(s)));

        _ = CreateMap<SaveBizLicApplicationCmd, spd_application>()
         .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => s.LicenceAppId ?? Guid.NewGuid()))
         .IncludeBase<BizLicApplication, spd_application>();

        _ = CreateMap<CreateBizLicApplicationCmd, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .IncludeBase<BizLicApplication, spd_application>();

        _ = CreateMap<spd_application, BizLicApplicationResp>()
         .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.spd_ApplicantId_contact.contactid))
         .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_CurrentExpiredLicenceId.spd_expirydate)))
         .ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
         .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
         .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
         .ForMember(d => d.OriginalLicenceTermCode, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : SharedMappingFuncs.GetLicenceTermEnum(s.spd_CurrentExpiredLicenceId.spd_licenceterm)))
         .ForMember(d => d.BizId, opt => opt.MapFrom(s => s.spd_ApplicantId_account == null ? null : s.spd_ApplicantId_account.accountid))
         .ForMember(d => d.ExpiredLicenceId, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licenceid))
         .ForMember(d => d.HasExpiredLicence, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? false : true))
         //.ForPath(d => d.PrivateInvestigatorSwlInfo.LicenceId, opt => opt.MapFrom(s => GetPrivateInvestigatorLicenceId(s.spd_application_spd_licence_manager))) //comment out temporary: when Dynamics complete the schema change, redo this part.
         .IncludeBase<spd_application, BizLicApplication>();
    }

    private static int? GetLicenceTerm(LicenceTermEnum? code)
    {
        if (code == null) return null;
        return (int)Enum.Parse<LicenceTermOptionSet>(code.ToString());
    }

    private static Guid? GetPrivateInvestigatorLicenceId(IEnumerable<spd_licence>? privateInvestigators)
    {
        if (privateInvestigators == null || privateInvestigators.Any() == false)
            return null;

        return privateInvestigators.FirstOrDefault(i => i.statecode == DynamicsConstants.StateCode_Active)?.spd_licenceid;
    }

    private static bool IsApplicantBizManager(spd_application application)
    {
        if (application.spd_businessmanagerfirstname == application.spd_firstname &&
            application.spd_businessmanagersurname == application.spd_lastname &&
            application.spd_businessmanagermiddlename1 == application.spd_middlename1 &&
            application.spd_businessmanagermiddlename2 == application.spd_middlename2 &&
            application.spd_businessmanageremail == application.spd_emailaddress1)
            return true;

        return false;
    }

    private static DateTimeOffset? GetDeclarationDate(BizLicApplication app)
    {
        return app.AgreeToCompleteAndAccurate != null && app.AgreeToCompleteAndAccurate == true ? DateTime.Now : null;
    }
}
