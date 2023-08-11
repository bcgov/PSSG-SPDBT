using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Ministry
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_ministry, MinistryResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_ministryid))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.spd_ministry_name))
            .ForMember(d => d.IsActive, opt => opt.MapFrom(s => s.statecode == DynamicsConstants.StateCode_Active));
        }
    }
}
