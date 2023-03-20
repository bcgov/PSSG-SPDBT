using AutoMapper;
using Spd.Resource.Organizations.User;

namespace Spd.Manager.Membership.OrgUser
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUserCreateRequest, CreateUserCmd>();
            CreateMap<OrgUserUpdateRequest, UpdateUserCmd>();
            CreateMap<UserResponse, OrgUserResponse>();
            CreateMap<OrgUserCreateRequest, UserResponse>();
            CreateMap<OrgUserUpdateRequest, UserResponse>();
            CreateMap<OrgUserListCmdResponse, OrgUserListResponse>();
        }
    }
}
