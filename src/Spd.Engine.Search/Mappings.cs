using AutoMapper;
using Spd.Resource.Repository.Application;

namespace Spd.Engine.Search;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<ClearanceResp, ShareableClearance>();
    }
}
