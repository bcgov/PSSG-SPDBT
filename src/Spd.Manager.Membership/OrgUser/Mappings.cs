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
            CreateMap<UserInfoResult, OrgUserResponse>();
            CreateMap<OrgUserCreateRequest, UserInfo>();
            CreateMap<OrgUserCreateRequest, UserInfoResult>()
               .ForMember(d => d.Id, opt => opt.Ignore())
               .IncludeBase<OrgUserCreateRequest, UserInfo>();
            CreateMap<OrgUserUpdateRequest, UserInfo>();
        }
    }
}
