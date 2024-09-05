using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Users;

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

        CreateMap<BizPortalUserCreateRequest, CreatePortalUserCmd>()
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.BizId))
            .ForMember(d => d.ContactRoleCode, opt => opt.MapFrom(s => s.ContactAuthorizationTypeCode))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.PortalUserServiceCategory, opt => opt.MapFrom(s => PortalUserServiceCategory.Licensing));

        CreateMap<BizPortalUserUpdateRequest, UpdatePortalUserCmd>()
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.BizId))
            .ForMember(d => d.ContactRoleCode, opt => opt.MapFrom(s => s.ContactAuthorizationTypeCode))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.TermAgreeTime, opt => opt.MapFrom(s => DateTimeOffset.UtcNow));

        CreateMap<PortalUserResp, BizPortalUserResponse>()
            .ForMember(d => d.ContactAuthorizationTypeCode, opt => opt.MapFrom(s => s.ContactRoleCode))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.UserEmail))
            .ForMember(d => d.BizId, opt => opt.MapFrom(s => s.OrganizationId));
    }
}
