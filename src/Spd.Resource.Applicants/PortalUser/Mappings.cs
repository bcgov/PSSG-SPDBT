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

            _ = CreateMap<CreatePortalUserCmd, spd_portaluser> ()
            .ForMember(d => d.spd_portaluserid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress));
        }
    }
}
