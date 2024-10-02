using Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository;
internal static class SharedMappingFuncs
{
    internal static int? GetYesNo(bool? value)
    {
        if (value == null) return null;
        return value.Value ? (int)YesNoOptionSet.Yes : (int)YesNoOptionSet.No;
    }

    internal static bool? GetBool(int? value)
    {
        if (value == null) return null;
        if (value == (int)YesNoOptionSet.Yes) return true;
        return false;
    }

    internal static int? GetGender(GenderEnum? code)
    {
        if (code == null) return null;
        return (int)Enum.Parse<GenderOptionSet>(code.ToString());
    }

    internal static GenderEnum? GetGenderEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<GenderEnum>(Enum.GetName(typeof(GenderOptionSet), optionset));
    }
    internal static DateOnly? GetDateOnly(Date? date)
    {
        if (date == null) return null;
        return new DateOnly(date.Value.Year, date.Value.Month, date.Value.Day);
    }

    internal static DateTimeOffset? GetDateTimeOffset(Date? date)
    {
        if (date == null) return null;
        return new DateTimeOffset(date.Value.Year, date.Value.Month, date.Value.Day, 0, 0, 0, TimeSpan.Zero);
    }

    internal static Date? GetDateFromDateOnly(DateOnly? dateOnly)
    {
        if (dateOnly == null) return null;
        return new Microsoft.OData.Edm.Date(dateOnly.Value.Year, dateOnly.Value.Month, dateOnly.Value.Day);
    }

    internal static Date? GetDate(DateTimeOffset? datetime)
    {
        if (datetime == null) return null;
        return new Microsoft.OData.Edm.Date(datetime.Value.Year, datetime.Value.Month, datetime.Value.Day);
    }

    internal static DateOnly? GetDateOnlyFromDateTimeOffset(DateTimeOffset? datetime)
    {
        if (datetime == null) return null;
        return new DateOnly(datetime.Value.Year, datetime.Value.Month, datetime.Value.Day);
    }

    internal static LicenceTermEnum? GetLicenceTermEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<LicenceTermEnum>(Enum.GetName(typeof(LicenceTermOptionSet), optionset));
    }

    internal static ServiceTypeEnum? GetServiceType(Guid? serviceTypeGuid)
    {
        if (serviceTypeGuid == null) return null;
        return Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.GetServiceTypeName(serviceTypeGuid));
    }

    internal static BizTypeEnum? GetBizTypeEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<BizTypeEnum>(Enum.GetName(typeof(BizTypeOptionSet), optionset));
    }

    internal static int? GetBizType(BizTypeEnum? code)
    {
        if (code == null) return (int)BizTypeOptionSet.None;
        return (int)Enum.Parse<BizTypeOptionSet>(code.ToString());
    }

    internal static ApplicationTypeEnum? GetLicenceApplicationTypeEnum(int? applicationTypeOptionSet)
    {
        if (applicationTypeOptionSet == null)
            return null;
        return applicationTypeOptionSet switch
        {
            (int)LicenceApplicationTypeOptionSet.Update => ApplicationTypeEnum.Update,
            (int)LicenceApplicationTypeOptionSet.Replacement => ApplicationTypeEnum.Replacement,
            (int)LicenceApplicationTypeOptionSet.New => ApplicationTypeEnum.New,
            (int)LicenceApplicationTypeOptionSet.Renewal => ApplicationTypeEnum.Renewal,
            _ => throw new ArgumentException("invalid int application type option set")
        };
    }

    internal static int? GetLicenceApplicationTypeOptionSet(ApplicationTypeEnum? applicationType)
    {
        if (applicationType == null)
            return null;
        return applicationType switch
        {
            ApplicationTypeEnum.Update => (int)LicenceApplicationTypeOptionSet.Update,
            ApplicationTypeEnum.Replacement => (int)LicenceApplicationTypeOptionSet.Replacement,
            ApplicationTypeEnum.New => (int)LicenceApplicationTypeOptionSet.New,
            ApplicationTypeEnum.Renewal => (int)LicenceApplicationTypeOptionSet.Renewal,
            _ => throw new ArgumentException("invalid application type code")
        };
    }

    internal static int? GetApplicationStatus(ApplicationStatusEnum? code)
    {
        if (code == null) return (int)ApplicationStatusOptionSet.Incomplete;
        return (int)Enum.Parse<ApplicationStatusOptionSet>(code.ToString());
    }

    internal static ApplicationStatusEnum? GetApplicationStatusEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<ApplicationStatusEnum>(Enum.GetName(typeof(ApplicationStatusOptionSet), optionset));
    }
    internal static int? GetPoliceRoleOptionSet(PoliceOfficerRoleEnum? policeRole)
    {
        if (policeRole == null)
            return (int) PoliceOfficerRoleOptionSet.None;
        return (int)Enum.Parse<PoliceOfficerRoleOptionSet>(policeRole.ToString());
    }

    internal static PoliceOfficerRoleEnum? GetPoliceRoleEnum(int? optionset)
    {
        if (optionset == null || optionset == (int) PoliceOfficerRoleOptionSet.None) return null;
        return Enum.Parse<PoliceOfficerRoleEnum>(Enum.GetName(typeof(PoliceOfficerRoleOptionSet), optionset));
    }

    internal static string? GetPermitPurposeOptionSets(IEnumerable<PermitPurposeEnum>? permitPurposes)
    {
        if (permitPurposes == null) return null;
        var result = String.Join(',', permitPurposes.Select(p => ((int)Enum.Parse<PermitPurposeOptionSet>(p.ToString())).ToString()).ToArray());
        return string.IsNullOrWhiteSpace(result) ? null : result;
    }

    internal static IEnumerable<PermitPurposeEnum> GetPermitPurposeEnums(string? optionsetStr)
    {
        if (optionsetStr == null) return null;
        string[] strs = optionsetStr.Split(',');
        return strs.Select(s => Enum.Parse<PermitPurposeEnum>(Enum.GetName(typeof(PermitPurposeOptionSet), Int32.Parse(s)))).ToList();
    }

    internal static int? GetBizTypeOptionSet(BizTypeEnum? bizType)
    {
        if (bizType == null)
            return null;
        return (int)Enum.Parse<BizTypeOptionSet>(bizType.ToString());
    }

    internal static O? GetOptionset<E, O>(E? code)
        where E : struct, Enum
        where O : struct, Enum
    {
        if (code == null) return null;
        return Enum.Parse<O>(code.ToString());
    }

    internal static E? GetEnum<O, E>(int? optionset)
        where O : struct, Enum
        where E : struct, Enum
    {
        if (optionset == null) return null;
        return Enum.Parse<E>(Enum.GetName(typeof(O), optionset));
    }

    internal static WorkerCategoryTypeEnum[] GetWorkerCategoryTypeEnums(ICollection<spd_licencecategory> categories)
    {
        List<WorkerCategoryTypeEnum> codes = new() { };
        foreach (spd_licencecategory cat in categories)
        {
            codes.Add(Enum.Parse<WorkerCategoryTypeEnum>(DynamicsContextLookupHelpers.LookupLicenceCategoryKey(cat.spd_licencecategoryid)));
        }
        return codes.ToArray();
    }

    internal static string? GetUploadedDocumentOptionSets(IEnumerable<UploadedDocumentEnum>? uploadDocs)
    {
        if (uploadDocs == null) return null;
        var result = String.Join(',', uploadDocs.Select(p => ((int)Enum.Parse<UploadedDocumentOptionSet>(p.ToString())).ToString()).ToArray());
        return string.IsNullOrWhiteSpace(result) ? null : result;
    }

    internal static IEnumerable<UploadedDocumentEnum> GetUploadedDocumentEnums(string? optionsetStr)
    {
        if (optionsetStr == null) return null;
        string[] strs = optionsetStr.Split(',');
        return strs.Select(s => Enum.Parse<UploadedDocumentEnum>(Enum.GetName(typeof(UploadedDocumentOptionSet), Int32.Parse(s)))).ToList();
    }

    internal static ContactRoleCode? GetContactRoleCode(IEnumerable<spd_role> spdRoles)
    {
        spd_role role = spdRoles.FirstOrDefault();
        if (role == null) return null;
        return Enum.Parse<ContactRoleCode>(
           DynamicsContextLookupHelpers.RoleGuidDictionary.FirstOrDefault(x => x.Value == role.spd_roleid).Key);
    }
    internal static bool GetIdentityConfirmed(ApplicationOriginTypeCode? origin, ApplicationTypeEnum type)
    {
        bool isNotPortal = origin != ApplicationOriginTypeCode.Portal;
        bool isNewOrRenewal = type == ApplicationTypeEnum.New ||
                              type == ApplicationTypeEnum.Renewal;

        return !(isNotPortal && isNewOrRenewal);
    }
    internal static string? GetDogReasonOptionSets(bool? IsDogsPurposeDetectionDrugs, bool? IsDogsPurposeProtection, bool? IsDogsPurposeDetectionExplosives)
    {
        List<string> reasons = new();

        if (IsDogsPurposeDetectionDrugs != null && IsDogsPurposeDetectionDrugs == true)
            reasons.Add(((int)RequestDogPurposeOptionSet.DetectionDrugs).ToString());
        if (IsDogsPurposeDetectionExplosives != null && IsDogsPurposeDetectionExplosives == true)
            reasons.Add(((int)RequestDogPurposeOptionSet.DetectionExplosives).ToString());
        if (IsDogsPurposeProtection != null && IsDogsPurposeProtection == true)
            reasons.Add(((int)RequestDogPurposeOptionSet.Protection).ToString());
        var result = String.Join(',', reasons.ToArray());

        return string.IsNullOrWhiteSpace(result) ? null : result;
    }
    internal static bool? GetDogReasonFlag(string dogreasonsStr, RequestDogPurposeOptionSet type)
    {
        if (dogreasonsStr == null) return null;
        string[] reasons = dogreasonsStr.Split(',');
        string str = ((int)type).ToString();
        if (reasons.Any(s => s == str)) return true;

        return false;
    }
}