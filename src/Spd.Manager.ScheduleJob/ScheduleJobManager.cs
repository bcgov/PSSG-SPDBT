using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;
using Spd.Resource.Repository.JobSchedule.Org;
using Spd.Resource.Repository.JobSchedule.ScheduleJobSession;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
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
    private readonly IGeneralizeScheduleJobRepository _generalizeScheduleJobRepository;
    private readonly ILogger<IScheduleJobManager> _logger;

    public ScheduleJobManager(IScheduleJobSessionRepository scheduleJobSessionRepository,
        IOrgRepository orgRepository,
        IGeneralizeScheduleJobRepository generalizeScheduleJobRepository,
        ILogger<IScheduleJobManager> logger)
    {
        _scheduleJobSessionRepository = scheduleJobSessionRepository;
        _orgRepository = orgRepository;
        _generalizeScheduleJobRepository = generalizeScheduleJobRepository;
        _logger = logger;
    }

    public async Task<Unit> Handle(RunScheduleJobSessionCommand cmd, CancellationToken ct)
    {
        ScheduleJobSessionResp? resp = await _scheduleJobSessionRepository.GetAsync(cmd.JobSessionId, ct);
        if (resp == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "The schedule job session does not exist.");
        }

        //used for Org MonthlyInvoice
        if (resp.PrimaryEntity == "account" && resp.EndPoint.Equals("spd_MonthlyInvoice"))
        {
            using var cts = new CancellationTokenSource(); // no timeout
            try
            {
                Stopwatch stopwatch = Stopwatch.StartNew();
                var result = await _orgRepository.RunMonthlyInvoiceAsync(cmd.ConcurrentRequests, cts.Token);
                stopwatch.Stop();

                //update result in JobSession
                UpdateScheduleJobSessionCmd updateResultCmd = CreateUpdateScheduleJobSessionCmd(cmd.JobSessionId, result, Decimal.Round((decimal)(stopwatch.ElapsedMilliseconds / 1000), 2));
                await _scheduleJobSessionRepository.ManageAsync(updateResultCmd, cts.Token);
            }
            catch (Exception ex)
            {
                UpdateScheduleJobSessionCmd updateCmd = new UpdateScheduleJobSessionCmd();
                updateCmd.ScheduleJobSessionId = cmd.JobSessionId;
                updateCmd.JobSessionStatusCode = JobSessionStatusCode.Failed;
                updateCmd.ErrorMsg = ex.Message;
                //update result in JobSession
                await _scheduleJobSessionRepository.ManageAsync(updateCmd, ct);
            }
        }

        return default;
    }

    //generalized,waiting for mano testing
    //public async Task<Unit> Handle(RunScheduleJobSessionCommand cmd, CancellationToken ct)
    //{
    //    ScheduleJobSessionResp? resp = await _scheduleJobSessionRepository.GetAsync(cmd.JobSessionId, ct);
    //    if (resp == null)
    //    {
    //        throw new ApiException(HttpStatusCode.BadRequest, "The schedule job session does not exist.");
    //    }

    //    Stopwatch stopwatch = Stopwatch.StartNew();
    //    //request will from bcgov_schedulejob
    //    RunJobRequest request = new RunJobRequest
    //    {
    //        PrimaryEntityActionStr = "spd_MonthlyInvoice",
    //        PrimaryEntityName = "accounts",
    //        PrimaryEntityFilterStr = "statecode eq 0 && spd_eligibleforcreditpayment eq 100000001",
    //        PrimaryEntityIdName = "accountid"
    //    };
    //    var result = await _generalizeScheduleJobRepository.RunJobsAsync(request, ct);
    //    stopwatch.Stop();

    //    //update result in JobSession
    //    UpdateScheduleJobSessionCmd updateResultCmd = CreateUpdateScheduleJobSessionCmd(cmd.JobSessionId, result, Decimal.Round((decimal)(stopwatch.ElapsedMilliseconds / 1000), 2));
    //    await _scheduleJobSessionRepository.ManageAsync(updateResultCmd, ct);

    //    return default;
    //}

    private UpdateScheduleJobSessionCmd CreateUpdateScheduleJobSessionCmd(Guid jobSessionId, IEnumerable<ResultResp> results, decimal durationInSec)
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
            _logger.LogError($"job failed with {error}");
        }
        else
        {
            _logger.LogInformation($"job runs successfully");
        }
        return cmd;
    }
}
