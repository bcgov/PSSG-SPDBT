using AutoMapper;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.JobSchedule.Org;
internal class OrgRepository : IOrgRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<IOrgRepository> _logger;

    public OrgRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<IOrgRepository> logger)
    {
        _context = ctx.Create();
        _mapper = mapper;
        this._logger = logger;
    }

    public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(CancellationToken ct)
    {
        int completed = 0;
        var accounts = _context.accounts.Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .Where(a => a.spd_eligibleforcreditpayment == (int)YesNoOptionSet.Yes)
            .ToList();

        //delegate, for reporting progress
        void ReportProgress(int current)
        {
            if (current % 100 == 0 || current == accounts.Count())
            {
                _logger.LogInformation($"Processed {current} of {accounts.Count()} accounts");
            }
        }

        using var semaphore = new SemaphoreSlim(2); // Limit to 2 concurrent requests
        _logger.LogInformation("2 concurrent requests");
        var tasks = accounts.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
                var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
                ResultResp rr = _mapper.Map<ResultResp>(response);
                rr.PrimaryEntityId = a.accountid.Value;
                return rr;
            }
            catch (Exception ex)
            {
                return new ResultResp { IsSuccess = false, ResultStr = ex.Message, PrimaryEntityId = a.accountid.Value };
            }
            finally
            {
                semaphore.Release();
                int current = Interlocked.Increment(ref completed);
                ReportProgress(current);
            }
        });

        var results = await Task.WhenAll(tasks);
        return results;
    }


}

