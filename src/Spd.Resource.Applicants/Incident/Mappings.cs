using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Applicants.Incident
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<incident, IncidentResp>()
            .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
            .ForMember(d => d.IncidentId, opt => opt.MapFrom(s => s.incidentid))
            .ForMember(d => d.Title, opt => opt.MapFrom(s => s.title));
        }
    }
}
