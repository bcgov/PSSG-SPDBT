using AutoMapper;
using Spd.Resource.Applicants.Application;

namespace Spd.Engine.Search;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<ClearanceResp, ShareableClearance>();
    }
}
