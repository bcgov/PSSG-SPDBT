using AutoMapper;
using Spd.Resource.Organizations.User;

namespace Spd.Manager.Screening
{
    internal class OrgUserMappings : Profile
    {
        public OrgUserMappings()
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
