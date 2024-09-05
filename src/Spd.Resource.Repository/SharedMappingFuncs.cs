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

    internal static int? GetGender(Gender? code)
    {
        if (code == null) return null;
        return (int)Enum.Parse<GenderOptionSet>(code.ToString()!);
    }

    internal static Gender? GetGenderEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<Gender>(Enum.GetName(typeof(GenderOptionSet), optionset)!);
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

    internal static LicenceTerm? GetLicenceTermEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<LicenceTerm>(Enum.GetName(typeof(LicenceTermOptionSet), optionset)!);
    }

    internal static ServiceTypeCode? GetServiceType(Guid? serviceTypeGuid)
    {
        if (serviceTypeGuid == null) return null;
        return Enum.Parse<ServiceTypeCode>(DynamicsContextLookupHelpers.GetServiceTypeName(serviceTypeGuid));
    }

    internal static BizType? GetBizTypeEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<BizType>(Enum.GetName(typeof(BizTypeOptionSet), optionset)!);
    }

    internal static int? GetBizType(BizType? code)
    {
        if (code == null) return (int)BizTypeOptionSet.None;
        return (int)Enum.Parse<BizTypeOptionSet>(code.ToString()!);
    }

    internal static ApplicationType? GetLicenceApplicationTypeEnum(int? applicationTypeOptionSet)
    {
        if (applicationTypeOptionSet == null)
            return null;
        return applicationTypeOptionSet switch
        {
            (int)LicenceApplicationTypeOptionSet.Update => ApplicationType.Update,
            (int)LicenceApplicationTypeOptionSet.Replacement => ApplicationType.Replacement,
            (int)LicenceApplicationTypeOptionSet.New => ApplicationType.New,
            (int)LicenceApplicationTypeOptionSet.Renewal => ApplicationType.Renewal,
            _ => throw new ArgumentException("invalid int application type option set")
        };
    }

    internal static int? GetLicenceApplicationTypeOptionSet(ApplicationType? applicationType)
    {
        if (applicationType == null)
            return null;
        return applicationType switch
        {
            ApplicationType.Update => (int)LicenceApplicationTypeOptionSet.Update,
            ApplicationType.Replacement => (int)LicenceApplicationTypeOptionSet.Replacement,
            ApplicationType.New => (int)LicenceApplicationTypeOptionSet.New,
            ApplicationType.Renewal => (int)LicenceApplicationTypeOptionSet.Renewal,
            _ => throw new ArgumentException("invalid application type code")
        };
    }

    internal static int? GetApplicationStatus(ApplicationStatusEnum? code)
    {
        if (code == null) return (int)ApplicationStatusOptionSet.Incomplete;
        return (int)Enum.Parse<ApplicationStatusOptionSet>(code.ToString()!);
    }

    internal static ApplicationStatusEnum? GetApplicationStatusEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<ApplicationStatusEnum>(Enum.GetName(typeof(ApplicationStatusOptionSet), optionset)!);
    }

    internal static int? GetPoliceRoleOptionSet(PoliceOfficerRole? policeRole)
    {
        if (policeRole == null)
            return (int)PoliceOfficerRoleOptionSet.None;
        return (int)Enum.Parse<PoliceOfficerRoleOptionSet>(policeRole.ToString()!);
    }

    internal static PoliceOfficerRole? GetPoliceRoleEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<PoliceOfficerRole>(Enum.GetName(typeof(PoliceOfficerRoleOptionSet), optionset)!);
    }

    internal static string? GetPermitPurposeOptionSets(IEnumerable<PermitPurpose>? permitPurposes)
    {
        if (permitPurposes == null) return null;
        var result = String.Join(',', permitPurposes.Select(p => ((int)Enum.Parse<PermitPurposeOptionSet>(p.ToString())).ToString()).ToArray());
        return string.IsNullOrWhiteSpace(result) ? null : result;
    }

    internal static IEnumerable<PermitPurpose> GetPermitPurposeEnums(string? optionsetStr)
    {
        if (optionsetStr == null) return [];
        string[] strs = optionsetStr.Split(',');
        return strs.Select(s => Enum.Parse<PermitPurpose>(Enum.GetName(typeof(PermitPurposeOptionSet), Int32.Parse(s))!)).ToList();
    }

    internal static int? GetBizTypeOptionSet(BizType? bizType)
    {
        if (bizType == null)
            return null;
        return (int)Enum.Parse<BizTypeOptionSet>(bizType.ToString()!);
    }

    internal static O? GetOptionset<E, O>(E? code)
        where E : struct, Enum
        where O : struct, Enum
    {
        if (code == null) return null;
        return Enum.Parse<O>(code.ToString()!);
    }

    internal static E? GetEnum<O, E>(int? optionset)
        where O : struct, Enum
        where E : struct, Enum
    {
        if (optionset == null) return null;
        return Enum.Parse<E>(Enum.GetName(typeof(O), optionset)!);
    }

    internal static WorkerCategoryType[] GetWorkerCategoryTypeEnums(ICollection<spd_licencecategory> categories)
    {
        List<WorkerCategoryType> codes = new() { };
        foreach (spd_licencecategory cat in categories)
        {
            codes.Add(Enum.Parse<WorkerCategoryType>(DynamicsContextLookupHelpers.LookupLicenceCategoryKey(cat.spd_licencecategoryid)));
        }
        return codes.ToArray();
    }

    internal static string? GetUploadedDocumentOptionSets(IEnumerable<UploadedDocument>? uploadDocs)
    {
        if (uploadDocs == null) return null;
        var result = String.Join(',', uploadDocs.Select(p => ((int)Enum.Parse<UploadedDocumentOptionSet>(p.ToString())).ToString()).ToArray());
        return string.IsNullOrWhiteSpace(result) ? null : result;
    }

    internal static IEnumerable<UploadedDocument> GetUploadedDocumentEnums(string? optionsetStr)
    {
        if (optionsetStr == null) return [];
        string[] strs = optionsetStr.Split(',');
        return strs.Select(s => Enum.Parse<UploadedDocument>(Enum.GetName(typeof(UploadedDocumentOptionSet), Int32.Parse(s))!)).ToList();
    }

    internal static ContactRoleCode? GetContactRoleCode(IEnumerable<spd_role> spdRoles)
    {
        var role = spdRoles.FirstOrDefault();
        if (role == null) return null;
        return Enum.Parse<ContactRoleCode>(DynamicsContextLookupHelpers.RoleGuidDictionary.FirstOrDefault(x => x.Value == role.spd_roleid).Key);
    }
}