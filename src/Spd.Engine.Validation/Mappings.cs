using AutoMapper;

namespace Spd.Engine.Validation;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<AppBulkDuplicateCheck, AppBulkDuplicateCheckResult>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname)); 
    }
}
