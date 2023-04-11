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
            CreateMap<UserResult, OrgUserResponse>();
            CreateMap<OrgUserCreateRequest, User>();
            CreateMap<OrgUserCreateRequest, UserResult>()
               .ForMember(d => d.Id, opt => opt.Ignore())
               .IncludeBase<OrgUserCreateRequest, User>();
            CreateMap<OrgUserUpdateRequest, User>();
        }
    }
}
