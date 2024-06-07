using AutoMapper;
using Spd.Resource.Repository.Event;
using Spd.Utilities.Printing;

namespace Spd.Manager.Printing;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<SendResponse, ResultResponse>()
            .ForMember(d => d.Status, opt => opt.MapFrom(s => GetStatusCode(s)));

        CreateMap<ReportResponse, ResultResponse>()
           .ForMember(d => d.Status, opt => opt.MapFrom(s => GetStatusCode(s)));

        CreateMap<ResultResponse, EventUpdateCmd>()
            .ForMember(d => d.LastExeTime, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
            .ForMember(d => d.JobId, opt => opt.MapFrom(s => s.PrintJobId))
            .ForMember(d => d.StateCode, opt => opt.MapFrom(s => GetStateCode(s)))
            .ForMember(d => d.ErrorDescription, opt => opt.MapFrom(s => s.Error))
            .ForMember(d => d.EventStatusReasonEnum, opt => opt.MapFrom(s => s.Status));
    }

    private static JobStatusCode GetStatusCode(SendResponse sendResponse)
    {
        return string.IsNullOrWhiteSpace(sendResponse.PrintJobId) ? JobStatusCode.Error : JobStatusCode.Processed;
    }

    private static JobStatusCode GetStatusCode(ReportResponse reportResponse)
    {
        return reportResponse.Status switch
        {
            JobStatus.Failed => JobStatusCode.Fail,
            JobStatus.Completed => JobStatusCode.Success,
            JobStatus.InProgress => JobStatusCode.Processed
        };
    }

    private static int GetStateCode(ResultResponse result)
    {
        return string.IsNullOrWhiteSpace(result.PrintJobId) ? 0 : 1;
    }

}