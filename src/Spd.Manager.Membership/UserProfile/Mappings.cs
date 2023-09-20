using AutoMapper;
using Spd.Resource.Applicants.PortalUser;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.User;

namespace Spd.Manager.Membership.UserProfile
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgResult, OrgSettings>();
            CreateMap<UserResult, UserInfo>()
               .ForMember(d => d.OrgName, opt => opt.Ignore())
               .ForMember(d => d.OrgSettings, opt => opt.Ignore())
               .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id))
               .ForMember(d => d.OrgRegistrationId, opt => opt.Ignore())
               .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.OrganizationId));

            CreateMap<Identity, ApplicantProfileResponse>()
                .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.ContactId));

            CreateMap<PortalUserResp, IdirUserProfileResponse>()
               .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.OrganizationId))
               .ForMember(d => d.IdentityProviderType, opt => opt.MapFrom(s => IdentityProviderTypeCode.Idir))
               .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id));
        }
    }
}
