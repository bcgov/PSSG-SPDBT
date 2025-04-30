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
    private readonly IDynamicsContextFactory _dynamicsContextFactory;

    public OrgRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<IOrgRepository> logger)
    {
        _dynamicsContextFactory = ctx;
        _context = ctx.Create();
        _mapper = mapper;
        this._logger = logger;
    }

    //sequential
    //public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(CancellationToken ct)
    //{
    //    int completed = 0;
    //    List<ResultResp> results = new List<ResultResp>();
    //    var accounts = _context.accounts.Where(a => a.statecode == DynamicsConstants.StateCode_Active)
    //        .Where(a => a.spd_eligibleforcreditpayment == (int)YesNoOptionSet.Yes)
    //        .ToList();

    //    //delegate, for reporting progress
    //    void ReportProgress(int current)
    //    {
    //        if (current % 100 == 0 || current == accounts.Count())
    //        {
    //            _logger.LogInformation($"Processed {current} of {accounts.Count()} accounts");
    //        }
    //    }
    //    _logger.LogInformation("1 concurrent requests");

    //    foreach (var a in accounts)
    //    {
    //        try
    //        {
    //            var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
    //            _logger.LogInformation($"Monthly Invoice executed result : success = {response.IsSuccess} {response.Result} accountid={a.accountid.Value}");
    //            ResultResp rr = _mapper.Map<ResultResp>(response);
    //            rr.PrimaryEntityId = a.accountid.Value;
    //            results.Add(rr);
    //        }
    //        catch (Exception ex)
    //        {
    //            _logger.LogError($"{a.accountid.Value}-{ex.Message}");
    //            Exception current = ex;
    //            while (current != null)
    //            {
    //                Console.WriteLine($"Exception Type: {current.GetType().Name}");
    //                Console.WriteLine($"Message: {current.Message}");
    //                Console.WriteLine($"Stack Trace: {current.StackTrace}");
    //                current = current.InnerException;
    //            }
    //            results.Add(new ResultResp { IsSuccess = false, ResultStr = ex.Message, PrimaryEntityId = a.accountid.Value });
    //        }
    //        finally
    //        {
    //            int current = Interlocked.Increment(ref completed);
    //            ReportProgress(current);
    //        }
    //    }
    //    return results;
    //}

    public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(int concurrentRequests, CancellationToken ct)
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

        using var semaphore = new SemaphoreSlim(concurrentRequests); // Limit to 1 concurrent requests
        _logger.LogDebug($"{concurrentRequests} concurrent requests");

        var tasks = accounts.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
                var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
                _logger.LogInformation($"MonthlyInvoice executed result : success = {response.IsSuccess} {response.Result} accountid={a.accountid.Value}");
                ResultResp rr = _mapper.Map<ResultResp>(response);
                rr.PrimaryEntityId = a.accountid.Value;
                return rr;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{a.accountid.Value}-{ex.Message}");
                Exception current = ex;
                while (current != null)
                {
                    Console.WriteLine($"Exception Type: {current.GetType().Name}");
                    Console.WriteLine($"Message: {current.Message}");
                    Console.WriteLine($"Stack Trace: {current.StackTrace}");
                    current = current.InnerException;
                }
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

