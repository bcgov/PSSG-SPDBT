using AutoMapper;
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
               .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.OrganizationId));
        }
    }
}
