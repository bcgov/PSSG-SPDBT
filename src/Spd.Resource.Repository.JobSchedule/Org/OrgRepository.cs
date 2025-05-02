using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
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

    //sequential
    //public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(CancellationToken ct)
    //{
    //    int completed = 0;
    //    List<ResultResp> results = new List<ResultResp>();
    //    var accounts = await GetAllAccountsAsync(ct);

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
    //            _logger.LogDebug($"Monthly Invoice executed result : success = {response.IsSuccess} {response.Result} accountid={a.accountid.Value}");
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
        var accounts = await GetAllAccountsAsync(ct);

        //delegate, for reporting progress
        void ReportProgress(int current)
        {
            if (current % 100 == 0 || current == accounts.Count())
            {
                _logger.LogInformation($"Processed {current} of {accounts.Count()} accounts");
            }
        }

        using var semaphore = new SemaphoreSlim(concurrentRequests); // Limit to n concurrent requests
        _logger.LogDebug($"{concurrentRequests} concurrent requests");

        var tasks = accounts.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
                var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
                _logger.LogDebug($"MonthlyInvoice executed result : success = {response.IsSuccess} {response.Result} accountid={a.accountid.Value}");
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
                    _logger.LogError($"Exception Type: {current.GetType().Name}");
                    _logger.LogError($"Message: {current.Message}");
                    _logger.LogError($"Stack Trace: {current.StackTrace}");
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

    public async Task<IEnumerable<account>> GetAllAccountsAsync(CancellationToken ct)
    {
        int completed = 0;
        string filterStr = "statecode eq 0 and spd_eligibleforcreditpayment eq 100000001";

        var accountsQuery = _context.accounts
            .AddQueryOption("$filter", filterStr)
            .IncludeCount();

        var allAccounts = new List<account>();

        QueryOperationResponse<account> response;
        DataServiceQueryContinuation<account> continuation = null;

        do
        {
            if (continuation == null)
            {
                response = (QueryOperationResponse<account>)await accountsQuery.ExecuteAsync(ct);
            }
            else
            {
                response = (QueryOperationResponse<account>)await _context.ExecuteAsync(continuation, ct);
            }
            allAccounts.AddRange(response);
            continuation = response.GetContinuation();
        } while (continuation != null);

        return allAccounts;
    }
}

