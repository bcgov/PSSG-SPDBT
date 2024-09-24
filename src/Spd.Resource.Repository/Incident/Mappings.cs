using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.Incident
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<incident, IncidentResp>()
            .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
            .ForMember(d => d.IncidentId, opt => opt.MapFrom(s => s.incidentid))
            .ForMember(d => d.Conditions, opt => opt.MapFrom(s => s.spd_incident_spd_licencecondition))
            .ForMember(d => d.Title, opt => opt.MapFrom(s => s.title));

            _ = CreateMap<spd_licencecondition, Condition>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_licenceconditionid))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.spd_conditionname));
        }
    }
}
