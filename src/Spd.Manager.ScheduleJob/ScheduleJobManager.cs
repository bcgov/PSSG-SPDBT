using MediatR;
using Spd.Resource.Repository.JobSchedule.Org;
using Spd.Resource.Repository.JobSchedule.ScheduleJobSession;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.ScheduleJob;

public class ScheduleJobManager :
    IRequestHandler<RunScheduleJobSessionCommand, Unit>,
    IScheduleJobManager
{
    private readonly IScheduleJobSessionRepository _scheduleJobSessionRepository;
    private readonly IOrgRepository _orgRepository;
    public ScheduleJobManager(IScheduleJobSessionRepository scheduleJobSessionRepository, IOrgRepository orgRepository)
    {
        _scheduleJobSessionRepository = scheduleJobSessionRepository;
        _orgRepository = orgRepository;
    }
    public async Task<Unit> Handle(RunScheduleJobSessionCommand cmd, CancellationToken ct)
    {
        ScheduleJobSessionResp? resp = await _scheduleJobSessionRepository.GetAsync(cmd.JobSessionId, ct);
        if (resp == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "The schedule job session does not exist.");
        }

        if (resp.PrimaryEntity == "account" && resp.EndPoint.Equals("spd_MonthlyInvoiceJob"))
        {
            var result = await _orgRepository.RunMonthlyInvoiceAsync(ct);

            //update result in JobSession
        }
        return default;
    }
}
