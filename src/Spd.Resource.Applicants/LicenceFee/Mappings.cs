using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.LicenceFee;

internal class Mappings : Profile
{
    public Mappings()
    {

        _ = CreateMap<spd_licencefee, LicenceFeeResp>()
         .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.LookupServiceTypeKey(s._spd_servicetypeid_value)))
         .ForMember(d => d.BusinessTypeCode, opt => opt.MapFrom(s => GetBusinessTypeEnum(s.spd_businesstype)))
         .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => GetLicenceApplicationTypeEnum(s.spd_type)))
         .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => GetLicenceTermEnum(s.spd_term)))
         .ForMember(d => d.Amount, opt => opt.MapFrom(s => s.spd_amount));
    }


    private static ApplicationTypeEnum? GetLicenceApplicationTypeEnum(int? applicationTypeOptionSet)
    {
        if (applicationTypeOptionSet == null)
            return null;
        return applicationTypeOptionSet switch
        {
            (int)LicenceApplicationTypeOptionSet.Update => ApplicationTypeEnum.Update,
            (int)LicenceApplicationTypeOptionSet.Replacement => ApplicationTypeEnum.Replacement,
            (int)LicenceApplicationTypeOptionSet.New_Expired => ApplicationTypeEnum.New,
            (int)LicenceApplicationTypeOptionSet.Renewal => ApplicationTypeEnum.Renewal,
            _ => throw new ArgumentException("invalid int application type option set")
        };
    }

    private static LicenceTermEnum? GetLicenceTermEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<LicenceTermEnum>(Enum.GetName(typeof(LicenceTermOptionSet), optionset));
    }

    private static BusinessTypeEnum? GetBusinessTypeEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<BusinessTypeEnum>(Enum.GetName(typeof(BusinessTypeOptionSet), optionset));
    }
}

