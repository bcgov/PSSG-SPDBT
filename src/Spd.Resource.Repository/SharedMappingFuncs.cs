using Microsoft.OData.Edm;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.LicenceApplication;
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
        if (code == null) return (int)GenderOptionSet.U;
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
        return Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(serviceTypeGuid));
    }

    internal static BusinessTypeEnum? GetBusinessTypeEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<BusinessTypeEnum>(Enum.GetName(typeof(BusinessTypeOptionSet), optionset));
    }

    internal static int? GetBusinessType(BusinessTypeEnum? code)
    {
        if (code == null) return (int)BusinessTypeOptionSet.None;
        return (int)Enum.Parse<BusinessTypeOptionSet>(code.ToString());
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
            return null;
        return (int)Enum.Parse<PoliceOfficerRoleOptionSet>(policeRole.ToString());
    }

    internal static PoliceOfficerRoleEnum? GetPoliceRoleEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<PoliceOfficerRoleEnum>(Enum.GetName(typeof(PoliceOfficerRoleOptionSet), optionset));
    }
}
