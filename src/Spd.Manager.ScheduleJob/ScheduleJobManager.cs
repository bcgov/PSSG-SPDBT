using MediatR;
using Spd.Resource.Repository.JobSchedule.Org;
using Spd.Resource.Repository.JobSchedule.ScheduleJobSession;
using Spd.Utilities.Shared.Exceptions;
using System.Diagnostics;
using System.Net;
using System.Text.Json;

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
            Stopwatch stopwatch = Stopwatch.StartNew();
            var result = await _orgRepository.RunMonthlyInvoiceAsync(ct);
            stopwatch.Stop();

            //update result in JobSession
            UpdateScheduleJobSessionCmd updateResultCmd = GetUpdateScheduleJobSessionCmd(cmd.JobSessionId, result, stopwatch.ElapsedMilliseconds / 1000);
            await _scheduleJobSessionRepository.ManageAsync(updateResultCmd, ct);
        }
        return default;
    }

    private UpdateScheduleJobSessionCmd GetUpdateScheduleJobSessionCmd(Guid jobSessionId, IEnumerable<ResultResp> results, decimal durationInSec)
    {
        UpdateScheduleJobSessionCmd cmd = new UpdateScheduleJobSessionCmd();
        cmd.ScheduleJobSessionId = jobSessionId;
        cmd.JobSessionStatusCode = results.Any(r => r.IsSuccess == false) ? JobSessionStatusCode.Failed : JobSessionStatusCode.Success;
        cmd.ErrorMsg = cmd.JobSessionStatusCode == JobSessionStatusCode.Failed ?
            JsonSerializer.Serialize(results.Where(r => !r.IsSuccess).ToList()) :
            null;
        cmd.Duration = durationInSec;
        return cmd;
    }
}
