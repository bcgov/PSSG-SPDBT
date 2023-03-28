using AutoMapper;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<ScreeningInviteCreateCommand, ScreeningInviteCreateCmd>();
            CreateMap<ScreeningInviteCreateRequest, ScreeningInviteCreateReq>();
            CreateMap<ScreeningInviteCreateResp, ScreeningInviteCreateResponse>();
        }
    }
}
