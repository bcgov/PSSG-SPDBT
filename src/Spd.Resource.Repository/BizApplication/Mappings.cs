using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.BizApplication;
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
         .ForMember(d => d.spd_uploadeddocuments, opt => opt.MapFrom(s => GetUploadedDocumentOptionSets(s.UploadedDocumentEnums)))
         .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .ForMember(d => d.spd_nologoorbranding, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.NoBranding)))
         .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => GetLicenceTerm(s.LicenceTermCode)))
         .ReverseMap()
         .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
         .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
         .ForMember(d => d.BizTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeEnum(s.spd_businesstype)))
         .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
         .ForMember(d => d.UseDogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestdogs)))
         .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetWorkerCategoryTypeEnums(s.spd_application_spd_licencecategory)))
         .ForMember(d => d.UploadedDocumentEnums, opt => opt.MapFrom(s => GetUploadedDocumentEnums(s.spd_uploadeddocuments)))
         .ForMember(d => d.ExpiredLicenceId, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licenceid))
         .ForMember(d => d.ExpiredLicenceNumber, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licencenumber));

        _ = CreateMap<SaveBizLicApplicationCmd, spd_application>()
          .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
          .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => s.LicenceAppId ?? Guid.NewGuid()))
          .IncludeBase<BizLicApplication, spd_application>();
    }

    private static int? GetLicenceTerm(LicenceTermEnum? code)
    {
        if (code == null) return null;
        return (int)Enum.Parse<LicenceTermOptionSet>(code.ToString());
    }

    private static WorkerCategoryTypeEnum[] GetWorkerCategoryTypeEnums(ICollection<spd_licencecategory> categories)
    {
        List<WorkerCategoryTypeEnum> codes = new() { };
        foreach (spd_licencecategory cat in categories)
        {
            codes.Add(Enum.Parse<WorkerCategoryTypeEnum>(DynamicsContextLookupHelpers.LookupLicenceCategoryKey(cat.spd_licencecategoryid)));
        }
        return codes.ToArray();
    }

    private static string? GetUploadedDocumentOptionSets(IEnumerable<UploadedDocumentEnum>? uploadDocs)
    {
        if (uploadDocs == null) return null;
        var result = String.Join(',', uploadDocs.Select(p => ((int)Enum.Parse<UploadedDocumentOptionSet>(p.ToString())).ToString()).ToArray());
        return string.IsNullOrWhiteSpace(result) ? null : result;
    }

    private static IEnumerable<UploadedDocumentEnum> GetUploadedDocumentEnums(string? optionsetStr)
    {
        if (optionsetStr == null) return null;
        string[] strs = optionsetStr.Split(',');
        return strs.Select(s => Enum.Parse<UploadedDocumentEnum>(Enum.GetName(typeof(UploadedDocumentOptionSet), Int32.Parse(s)))).ToList();
    }
}
