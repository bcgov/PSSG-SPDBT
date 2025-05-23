﻿using AutoMapper;
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
         .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<ApplicationOriginTypeEnum, ApplicationOriginOptionSet>(s.ApplicationOriginTypeCode)))
         .ForMember(d => d.spd_payer, opt => opt.MapFrom(s => (int)PayerPreferenceOptionSet.Applicant))
         .ForMember(d => d.spd_businesstype, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizType(s.BizTypeCode)))
         .ForMember(d => d.spd_requestdogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.UseDogs)))
         .ForMember(d => d.spd_requestdogsreasons, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonOptionSets(s.IsDogsPurposeDetectionDrugs, s.IsDogsPurposeProtection, s.IsDogsPurposeDetectionExplosives)))
         .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
         .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
         .ForMember(d => d.spd_uploadeddocuments, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentOptionSets(s.UploadedDocumentEnums)))
         .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .ForMember(d => d.spd_nologoorbranding, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.NoBranding)))
         .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(s.LicenceTermCode)))
         .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDeclarationDate(s.AgreeToCompleteAndAccurate)))
         .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => SharedMappingFuncs.GetIdentityConfirmed(s.ApplicationOriginTypeCode, s.ApplicationTypeCode)))
         .ReverseMap()
         .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
         .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(s.spd_origin)))
         .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
         .ForMember(d => d.BizTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeEnum(s.spd_businesstype)))
         .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
         .ForMember(d => d.NoBranding, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_nologoorbranding)))
         .ForMember(d => d.UseDogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestdogs)))
         .ForMember(d => d.IsDogsPurposeProtection, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.Protection)))
         .ForMember(d => d.IsDogsPurposeDetectionDrugs, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionDrugs)))
         .ForMember(d => d.IsDogsPurposeDetectionExplosives, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionExplosives)))
         .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => SharedMappingFuncs.GetWorkerCategoryTypeEnums(s.spd_application_spd_licencecategory)))
         .ForMember(d => d.UploadedDocumentEnums, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentEnums(s.spd_uploadeddocuments)))
         .ForMember(d => d.ExpiredLicenceNumber, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licencenumber))
         .ForMember(d => d.ApplicantIsBizManager, opt => opt.MapFrom(s => IsApplicantBizManager(s)));

        CreateMap<SaveBizLicApplicationCmd, spd_application>()
         .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => s.LicenceAppId ?? Guid.NewGuid()))
         .IncludeBase<BizLicApplication, spd_application>();
        //.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<CreateBizLicApplicationCmd, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .ForMember(d => d.spd_updatesummary, opt => opt.MapFrom(s => s.ChangeSummary))
         .IncludeBase<BizLicApplication, spd_application>();
        //.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

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
         .ForMember(d => d.PrivateInvestigatorSwlInfo, opt => opt.Ignore())
         .ForMember(d => d.SoleProprietorSWLAppId, opt => opt.MapFrom(s => GetSwlAppId(s.spd_businessapplication_spd_workerapplication.ToList())))
         .ForMember(d => d.SoleProprietorSWLAppOriginTypeCode, opt => opt.MapFrom(s => GetSwlAppOrigin(s.spd_businessapplication_spd_workerapplication.ToList())))
         .ForMember(d => d.NonSwlControllingMemberCrcAppIds, opt => opt.MapFrom(s => GetNonSwlCmAppIds(s.spd_businessapplication_spd_workerapplication.ToList())))
         .IncludeBase<spd_application, BizLicApplication>();

        _ = CreateMap<PrivateInvestigatorSwlContactInfo, spd_businesscontact>()
         .ForMember(d => d.spd_businesscontactid, opt => opt.MapFrom(s => s.BizContactId))
         .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
         .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
         .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
         .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
         .ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => $"{s.Surname}, {s.GivenName}"))
         .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.EmailAddress));
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

    private static Guid? GetSwlAppId(List<spd_application> apps)
    {
        Guid? swlServiceTypeId = DynamicsContextLookupHelpers.GetServiceTypeGuid(ServiceTypeEnum.SecurityWorkerLicence.ToString());
        return apps.Where(a => a._spd_servicetypeid_value == swlServiceTypeId)
            .OrderByDescending(a => a.createdon)
            .FirstOrDefault()?.spd_applicationid;
    }
    private static ApplicationOriginTypeEnum? GetSwlAppOrigin(List<spd_application> apps)
    {
        Guid? swlServiceTypeId = DynamicsContextLookupHelpers.GetServiceTypeGuid(ServiceTypeEnum.SecurityWorkerLicence.ToString());
        //is it valid query?
        int? spd_origin = apps.Where(a => a._spd_servicetypeid_value == swlServiceTypeId)
           .OrderByDescending(a => a.createdon)
           .FirstOrDefault()?.spd_origin;

        return SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(spd_origin);
    }

    private static IEnumerable<Guid> GetNonSwlCmAppIds(List<spd_application> apps)
    {
        Guid? serviceTypeId = DynamicsContextLookupHelpers.GetServiceTypeGuid(ServiceTypeEnum.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC.ToString());
        return apps.Where(a => a._spd_servicetypeid_value == serviceTypeId).Select(a => a.spd_applicationid.Value).ToList();
    }
}
