using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

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
             .ForMember(d => d.FilterStr, opt => opt.MapFrom(s => s.bcgov_ScheduleJobId.bcgov_fetchxml))
             ;

            _ = CreateMap<UpdateScheduleJobSessionCmd, bcgov_schedulejobsession>()
             .ForMember(d => d.statecode, opt => opt.MapFrom(s => s.JobSessionStatusCode == JobSessionStatusCode.Success ? DynamicsConstants.StateCode_Inactive : DynamicsConstants.StateCode_Active))
             .ForMember(d => d.statuscode, opt => opt.MapFrom(s => s.JobSessionStatusCode == JobSessionStatusCode.Success ? (int)BcGoV_ScheduleJObsession_StatusCode_OptionSet.Success : (int)BcGoV_ScheduleJObsession_StatusCode_OptionSet.Failed))
             .ForMember(d => d.bcgov_error, opt => opt.MapFrom(s => s.ErrorMsg ?? string.Empty))
             .ForMember(d => d.bcgov_duration, opt => opt.Ignore());
        }
    }
}
