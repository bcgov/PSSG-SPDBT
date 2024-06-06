using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.LicenceFee;

internal class Mappings : Profile
{
    public Mappings()
    {

        _ = CreateMap<spd_licencefee, LicenceFeeResp>()
         .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetServiceTypeName(s._spd_servicetypeid_value)))
         .ForMember(d => d.BizTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeEnum(s.spd_businesstype)))
         .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_type)))
         .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_term)))
         .ForMember(d => d.HasValidSwl90DayLicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_hasvalidswl90daylicence)))
         .ForMember(d => d.Amount, opt => opt.MapFrom(s => s.spd_amount));
    }
}

