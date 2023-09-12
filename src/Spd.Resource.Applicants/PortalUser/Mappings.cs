using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Applicants.PortalUser
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_portaluser, PortalUserResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portaluserid));
        }
    }
}
