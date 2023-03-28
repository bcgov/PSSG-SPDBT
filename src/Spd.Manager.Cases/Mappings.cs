using AutoMapper;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<ApplicationInviteCreateCommand, ApplicationInviteCreateCmd>();
            CreateMap<ApplicationInviteCreateRequest, ApplicationInviteCreateReq>();
            CreateMap<ApplicationInviteCreateResp, ApplicationInviteCreateResponse>();
        }
    }
}
