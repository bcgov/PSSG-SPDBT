using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Event
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_eventqueue, EventResp>()
             .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_eventqueueid))
             .ForMember(d => d.EventTypeEnum, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<EventTypeOptionSet, EventTypeEnum>(s.spd_eventtype)))
             .ForMember(d => d.RegardingObjectId, opt => opt.MapFrom(s => s.spd_regardingobjectid))
             .ForMember(d => d.JobId, opt => opt.MapFrom(s => s.spd_jobid))
             .ForMember(d => d.LastExeTime, opt => opt.MapFrom(s => s.spd_timestamp))
             .ForMember(d => d.RegardingObjectName, opt => opt.MapFrom(s => s.spd_regardingobjectlogicalname));

            _ = CreateMap<EventUpdateCmd, spd_eventqueue>()
             .ForMember(d => d.spd_timestamp, opt => opt.MapFrom(s => s.LastExeTime))
             .ForMember(d => d.spd_errordescription, opt => opt.MapFrom(s => s.ErrorDescription))
             .ForMember(d => d.spd_jobid, opt => opt.MapFrom(s => s.JobId))
             .ForMember(d => d.statecode, opt => opt.MapFrom(s => s.StateCode))
             .ForMember(d => d.statuscode, opt => opt.MapFrom(s => (int)SharedMappingFuncs.GetOptionset<EventStatusReasonEnum, EventStatusReasonOptionSet>(s.EventStatusReasonEnum)));
        }
    }
}
