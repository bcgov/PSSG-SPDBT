using AutoMapper;
using Spd.Resource.Organizations.User;

namespace Spd.Manager.Membership.OrgUser
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUserCreateRequest, UserCreateCmd>();
            CreateMap<OrgUserUpdateRequest, UserUpdateCmd>();
            CreateMap<UserResp, OrgUserResponse>();
            CreateMap<OrgUserCreateRequest, UserResp>();
            CreateMap<OrgUserUpdateRequest, UserResp>();
            CreateMap<OrgUsersResp, OrgUserListResponse>();
        }
    }
}
