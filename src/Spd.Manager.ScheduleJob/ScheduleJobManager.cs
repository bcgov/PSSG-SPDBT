using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.JobSchedule.Org;
using Spd.Resource.Repository.JobSchedule.ScheduleJobSession;
using Spd.Utilities.Shared.Tools;
using System.Diagnostics;
using System.Text.Json;

namespace Spd.Manager.ScheduleJob;

public class ScheduleJobManager :
    IRequestHandler<RunScheduleJobSessionCommand, Unit>,
    IScheduleJobManager
{
    private readonly IScheduleJobSessionRepository _scheduleJobSessionRepository;
    private readonly IOrgRepository _orgRepository;
    private readonly ILogger<IScheduleJobManager> _logger;

    public ScheduleJobManager(IScheduleJobSessionRepository scheduleJobSessionRepository,
        IOrgRepository orgRepository,
        ILogger<IScheduleJobManager> logger)
    {
        _scheduleJobSessionRepository = scheduleJobSessionRepository;
        _orgRepository = orgRepository;
        _logger = logger;
    }
    public async Task<Unit> Handle(RunScheduleJobSessionCommand cmd, CancellationToken ct)
    {
        //ScheduleJobSessionResp? resp = await _scheduleJobSessionRepository.GetAsync(cmd.JobSessionId, ct);
        //if (resp == null)
        //{
        //    throw new ApiException(HttpStatusCode.BadRequest, "The schedule job session does not exist.");
        //}

        //if (resp.PrimaryEntity == "account" && resp.EndPoint.Equals("spd_MonthlyInvoiceJob"))
        //{
        Stopwatch stopwatch = Stopwatch.StartNew();
        var result = await _orgRepository.RunGeneralFunctionAsync(ct);
        stopwatch.Stop();

        //update result in JobSession
        //UpdateScheduleJobSessionCmd updateResultCmd = GetUpdateScheduleJobSessionCmd(cmd.JobSessionId, result, Decimal.Round((decimal)(stopwatch.ElapsedMilliseconds / 1000), 2));
        //await _scheduleJobSessionRepository.ManageAsync(updateResultCmd, ct);
        //}
        return default;
    }

    private UpdateScheduleJobSessionCmd GetUpdateScheduleJobSessionCmd(Guid jobSessionId, IEnumerable<ResultResp> results, decimal durationInSec)
    {
        UpdateScheduleJobSessionCmd cmd = new UpdateScheduleJobSessionCmd();
        cmd.ScheduleJobSessionId = jobSessionId;
        cmd.JobSessionStatusCode = results.Any(r => r.IsSuccess == false) ? JobSessionStatusCode.Failed : JobSessionStatusCode.Success;
        cmd.ErrorMsg = cmd.JobSessionStatusCode == JobSessionStatusCode.Failed ?
            StringHelper.Truncate(JsonSerializer.Serialize(results.Where(r => !r.IsSuccess).ToList()), 4000) :
            null;
        cmd.Duration = durationInSec;
        if (cmd.JobSessionStatusCode == JobSessionStatusCode.Failed)
        {
            string error = JsonSerializer.Serialize(results.Where(r => !r.IsSuccess).ToList());
            _logger.LogError(error);
        }
        return cmd;
    }
}
