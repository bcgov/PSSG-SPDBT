using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.JobSchedule.Org;
internal class OrgRepository : IOrgRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    public OrgRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(CancellationToken ct)
    {
        var accounts = _context.accounts.Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .Where(a => a.spd_eligibleforcreditpayment == (int)YesNoOptionSet.Yes)
            .ToList();

        accounts = new List<account>()
        {
            accounts.FirstOrDefault()
        };
        using var semaphore = new SemaphoreSlim(10); // Limit to 10 concurrent requests

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
            }
        });

        var results = await Task.WhenAll(tasks);
        return results;
    }
}

