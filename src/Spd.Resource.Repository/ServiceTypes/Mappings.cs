using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.ServiceTypes;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<spd_servicetype, ServiceTypeResp>()
         .ForMember(d => d.ServiceTypeName, opt => opt.MapFrom(s => s.spd_servicetypename))
         .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_servicetypeid))
         .ForMember(d => d.ServiceCategoryCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_servicecategory)))
         .ForMember(d => d.ScreeningCost, opt => opt.MapFrom(s => s.spd_screeningcost));
    }
}

