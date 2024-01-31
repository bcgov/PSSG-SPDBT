using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.Config
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<bcgov_config, ConfigItem>()
             .ForMember(d => d.Key, opt => opt.MapFrom(s => s.bcgov_key))
             .ForMember(d => d.Group, opt => opt.MapFrom(s => s.bcgov_group))
             .ForMember(d => d.Value, opt => opt.MapFrom(s => s.bcgov_value));
        }
    }
}
