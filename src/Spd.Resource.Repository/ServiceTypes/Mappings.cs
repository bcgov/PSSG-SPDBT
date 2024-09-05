using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.ServiceTypes;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<spd_servicetype, ServiceTypeResp>()
         .ForMember(d => d.ServiceTypeName, opt => opt.MapFrom(s => s.spd_servicetypename))
         .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_servicetypeid))
         .ForMember(d => d.ServiceCategoryCode, opt => opt.MapFrom(s => GetServiceTypeCategoryEnum(s.spd_servicecategory)))
         .ForMember(d => d.ScreeningCost, opt => opt.MapFrom(s => s.spd_screeningcost));
    }

    internal static ServiceTypeCategory? GetServiceTypeCategoryEnum(int? serviceCategory)
    {
        if (serviceCategory == null)
            return null;
        return serviceCategory switch
        {
            (int)ServiceTypeCategoryOptionSet.Screening => ServiceTypeCategory.Screening,
            (int)ServiceTypeCategoryOptionSet.Licensing => ServiceTypeCategory.Licensing,
            _ => throw new ArgumentException("invalid int application type option set")
        };
    }
}

