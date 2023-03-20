using AutoMapper;
using Spd.Resource.Organizations.User;

namespace Spd.Manager.Membership.OrgUser
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUserCreateRequest, UserCreateCommand>();
            CreateMap<OrgUserUpdateRequest, UserUpdateCommand>();
            CreateMap<UserResponse, OrgUserResponse>();
            CreateMap<OrgUserCreateRequest, UserResponse>();
            CreateMap<OrgUserUpdateRequest, UserResponse>();
            CreateMap<OrgUserListResponse, OrgUserListResponse>();
        }
    }
}
