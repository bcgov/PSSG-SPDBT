using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.JobSchedule.ScheduleJobSession
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<bcgov_schedulejobsession, ScheduleJobSessionResp>()
             .ForMember(d => d.ScheduleJobSessionId, opt => opt.MapFrom(s => s.bcgov_schedulejobsessionid))
             .ForMember(d => d.ScheduleJobId, opt => opt.MapFrom(s => s._bcgov_schedulejobid_value))
             .ForMember(d => d.PrimaryEntity, opt => opt.MapFrom(s => s.bcgov_ScheduleJobId.bcgov_primaryentity))
             .ForMember(d => d.EndPoint, opt => opt.MapFrom(s => s.bcgov_ScheduleJobId.bcgov_endpoint))
             ;
        }
    }
}
