using AutoMapper;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.User;

namespace Spd.Manager.Licence;
internal class BizPortalUserMapping : Profile
{
    public BizPortalUserMapping()
    {
        CreateMap<PortalUserResp, UserResult>()
            .ForMember(d => d.UserGuid, opt => opt.Ignore())
            .ForMember(d => d.IsActive, opt => opt.Ignore())
            .ForMember(d => d.ContactAuthorizationTypeCode, opt => opt.MapFrom(s => s.ContactRoleCode))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.UserEmail));
        CreateMap<BizPortalUserCreateRequest, User>();
        CreateMap<BizPortalUserCreateRequest, UserResult>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .IncludeBase<BizPortalUserCreateRequest, User>();
    }
}
