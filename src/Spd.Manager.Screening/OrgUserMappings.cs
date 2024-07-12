using AutoMapper;
using Spd.Manager.Shared;
using Spd.Resource.Repository.User;
using Spd.Utilities.LogonUser;

namespace Spd.Manager.Screening
{
    internal class OrgUserMappings : Profile
    {
        public OrgUserMappings()
        {
            CreateMap<OrgUserCreateRequest, UserCreateCmd>();
            CreateMap<BceidIdentityInfo, User>()
               .ForMember(d => d.ContactAuthorizationTypeCode, opt => opt.MapFrom(s => ContactAuthorizationTypeCode.Primary));
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
