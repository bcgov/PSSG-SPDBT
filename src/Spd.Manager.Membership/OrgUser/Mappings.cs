using AutoMapper;
using Spd.Resource.Organizations;

namespace Spd.Manager.Membership.OrgUser
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUserCreateRequest, CreateUserCmd>();
            CreateMap<OrgUserUpdateRequest, UpdateUserCmd>();
            CreateMap<UserCmdResponse, OrgUserResponse>();
            CreateMap<OrgUserListCmdResponse, OrgUserListResponse>();
        }
    }
}
