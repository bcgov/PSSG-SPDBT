using AutoMapper;
using Spd.Resource.Repository.Event;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Printing;

namespace Spd.Manager.Printing;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<SendResponse, ResultResponse>()
            .ForMember(d => d.Status, opt => opt.MapFrom(s => GetStatusCode(s.Status)));

        CreateMap<ReportResponse, ResultResponse>()
           .ForMember(d => d.Status, opt => opt.MapFrom(s => GetStatusCode(s.Status)));

        CreateMap<ResultResponse, EventUpdateCmd>()
            .ForMember(d => d.LastExeTime, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
            .ForMember(d => d.JobId, opt => opt.MapFrom(s => s.PrintJobId))
            .ForMember(d => d.StateCode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Inactive))
            .ForMember(d => d.ErrorDescription, opt => opt.MapFrom(s => s.Error))
            .ForMember(d => d.EventStatusReasonEnum, opt => opt.MapFrom(s => s.Status));
    }

    private static JobStatusCode GetStatusCode(JobStatus status)
    {
        return status switch
        {
            JobStatus.Failed => JobStatusCode.Fail,
            JobStatus.Completed => JobStatusCode.Success,
            JobStatus.InProgress => JobStatusCode.Processed,
            _ => JobStatusCode.Ready
        };
    }

}