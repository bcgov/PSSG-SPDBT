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

    public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceInChuncksAsync(RunJobRequest request, int concurrentRequests, CancellationToken ct)
    {
        int chunkSize = 500;
        int chunkNumber = 0;
        int returnedNumber = 500;
        List<ResultResp> finalResults = new List<ResultResp>();

        while (returnedNumber != 0)
        {
            _logger.LogInformation("Processing {ChunckNumber} chuck with {Size}", chunkNumber, chunkSize);
            var accounts = await GetAccountsInChuckAsync(chunkSize, chunkNumber, request.PrimaryEntityFilterStr, ct);
            returnedNumber = accounts.Count();
            chunkNumber++;
            _logger.LogInformation("returned number = {ReturnedNumber}", returnedNumber);

            using var semaphore = new SemaphoreSlim(concurrentRequests); // Limit to n concurrent requests
            _logger.LogDebug("{ConcurrentRequests} concurrent requests", concurrentRequests);

            var tasks = accounts.Select(async a =>
            {
                await semaphore.WaitAsync();
                try
                {
                    if (request.PrimaryEntityActionStr == "spd_OrgMonthlyReport")
                    {
                        var response = await a.spd_OrgMonthlyReport().GetValueAsync(ct);
                        _logger.LogDebug("MonthlyReport executed result : success = {Success} {Result} accountid={Accountid}", response.IsSuccess, response.Result, a.accountid.Value);
                        ResultResp rr = _mapper.Map<ResultResp>(response);
                        rr.PrimaryEntityId = a.accountid.Value;
                        return rr;
                    }
                    else if (request.PrimaryEntityActionStr == "spd_MonthlyInvoice")
                    {
                        var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
                        _logger.LogDebug("MonthlyInvoice executed result : success = {Success} {Result} accountid={Accountid}", response.IsSuccess, response.Result, a.accountid.Value);
                        ResultResp rr = _mapper.Map<ResultResp>(response);
                        rr.PrimaryEntityId = a.accountid.Value;
                        return rr;
                    }
                    return null;
                }
                catch (Exception ex)
                {
                    Exception current = ex;
                    while (current != null)
                    {
                        _logger.LogError("Exception Type: {ExceptionName} \r\n Message: {Message} \r\n Stack Trace: {StackTrace}", current.GetType().Name, current.Message, current.StackTrace);
                        current = current.InnerException;
                    }
                    return new ResultResp { IsSuccess = false, ResultStr = ex.Message, PrimaryEntityId = a.accountid.Value };
                }
                finally
                {
                    semaphore.Release();
                }
            });

            var results = await Task.WhenAll(tasks);
            finalResults.AddRange(results);
        }
        return finalResults;
    }

    public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(int concurrentRequests, CancellationToken ct)
    {
        int completed = 0;
        var accounts = await GetAllAccountsAsync(ct);

        //delegate, for reporting progress
        void ReportProgress(int current)
        {
            if (current % 100 == 0 || current == accounts.Count())
            {
                _logger.LogInformation("Processed {Current} of {AccountsCount} accounts", current, accounts.Count());
            }
        }

        using var semaphore = new SemaphoreSlim(concurrentRequests); // Limit to n concurrent requests
        _logger.LogDebug("{ConcurrentRequests} concurrent requests", concurrentRequests);

        var tasks = accounts.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
                var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
                _logger.LogDebug("MonthlyInvoice executed result : success = {Success} {Result} accountid={Accountid}", response.IsSuccess, response.Result, a.accountid.Value);
                ResultResp rr = _mapper.Map<ResultResp>(response);
                rr.PrimaryEntityId = a.accountid.Value;
                return rr;
            }
            catch (Exception ex)
            {
                Exception current = ex;
                while (current != null)
                {
                    _logger.LogError("Exception Type: {ExceptionName} \r\n Message: {Message} \r\n Stack Trace: {StackTrace}", current.GetType().Name, current.Message, current.StackTrace);
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

    public async Task<IEnumerable<account>> GetAccountsInChuckAsync(int chunkSize, int chunkNumber, string filterStr, CancellationToken ct)
    {
        int skip = chunkNumber * chunkSize;
        var accountsQuery = _context.accounts
            .AddQueryOption("$filter", filterStr)
            .AddQueryOption("$orderby", "createdon desc")
            .IncludeCount()
            .AddQueryOption("$skip", $"{skip}")
            .AddQueryOption("$top", $"{chunkSize}");

        var accounts = (QueryOperationResponse<account>)await accountsQuery.ExecuteAsync(ct);
        return accounts.ToList();
    }
}
