using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Ministry
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<account, MinistryResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.accountid))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.name))
            .ForMember(d => d.IsActive, opt => opt.MapFrom(s => s.statecode == DynamicsConstants.StateCode_Active));
        }
    }
}
