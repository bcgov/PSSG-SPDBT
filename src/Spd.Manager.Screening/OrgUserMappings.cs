using AutoMapper;
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
               .ForMember(d => d.ContactAuthorizationTypeCode, opt => opt.MapFrom(s => ContactAuthorizationTypeCode.Primary))
               .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName))
               .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName))
               .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email));
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
