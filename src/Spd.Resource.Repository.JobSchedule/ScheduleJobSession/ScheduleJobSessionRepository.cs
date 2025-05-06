using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.JobSchedule.ScheduleJobSession;
internal class ScheduleJobSessionRepository : IScheduleJobSessionRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<IScheduleJobSessionRepository> _logger;

    public ScheduleJobSessionRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<IScheduleJobSessionRepository> logger)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ScheduleJobSessionResp?> GetAsync(Guid jobSessionId, CancellationToken ct)
    {
        bcgov_schedulejobsession? jobSession;
        try
        {
            jobSession = await _context.bcgov_schedulejobsessions
                .Expand(i => i.bcgov_ScheduleJobId)
                .Where(l => l.bcgov_schedulejobsessionid == jobSessionId)
                .FirstOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                return null;
            else
                throw;
        }

        return _mapper.Map<ScheduleJobSessionResp>(jobSession);
    }

    public async Task<ScheduleJobSessionResp> ManageAsync(UpdateScheduleJobSessionCmd updateCmd, CancellationToken ct)
    {
        bcgov_schedulejobsession? jobSession = await _context.bcgov_schedulejobsessions
                .Where(l => l.bcgov_schedulejobsessionid == updateCmd.ScheduleJobSessionId)
                .FirstOrDefaultAsync(ct);
        if (jobSession == null)
            throw new ArgumentException("Invalid jobsession id, cannot find corresponding bcgov_schedulejobsession");
        _mapper.Map<UpdateScheduleJobSessionCmd, bcgov_schedulejobsession>(updateCmd, jobSession);
        _context.UpdateObject(jobSession);
        await _context.SaveChangesAsync(ct);
        _logger.LogInformation("job session - {JobSessionId} is updated.", jobSession.bcgov_schedulejobsessionid);
        return _mapper.Map<ScheduleJobSessionResp>(jobSession);
    }

    public async Task<ScheduleJobSessionListResp> QueryAsync(ScheduleJobSessionQry qry, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}

