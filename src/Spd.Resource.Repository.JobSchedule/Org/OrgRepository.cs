using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.JobSchedule.Org;
internal class OrgRepository : IOrgRepository
{
    private readonly IMapper _mapper;
    private readonly ILogger<IOrgRepository> _logger;
    private readonly IDynamicsContextFactory _factory;

    public OrgRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<IOrgRepository> logger)
    {
        _factory = ctx;
        _mapper = mapper;
        this._logger = logger;
    }

    public async Task<IEnumerable<ResultResp>> RunMonthlyOrgInChuncksAsync(RunJobRequest request, int concurrentRequests, CancellationToken ct)
    {
        const int chunkSize = 500;
        const int maxStoredErrors = 500;
        int chunkNumber = 0;
        int returnedNumber = chunkSize;
        var finalErrResults = new List<ResultResp>();

        _logger.LogDebug("{ConcurrentRequests} concurrent requests", concurrentRequests);

        while (returnedNumber != 0)
        {
            using var context = _factory.Create();
            _logger.LogInformation("Processing chunk {ChunkNumber} with size {Size}", chunkNumber, chunkSize);

            var accountList = await GetAccountsInChuckAsync(context, chunkSize, chunkNumber, request.PrimaryEntityFilterStr, ct);
            returnedNumber = accountList.Count();
            chunkNumber++;

            _logger.LogInformation("Returned number = {ReturnedNumber}", returnedNumber);

            for (int i = 0; i < accountList.Count; i += concurrentRequests)
            {
                var currentBatch = accountList.Skip(i).Take(concurrentRequests).ToList();
                var tasks = new List<Task<ResultResp?>>();

                foreach (var a in currentBatch)
                {
                    tasks.Add(ProcessAccountAsync(a, request, ct));
                }

                var batchResults = await Task.WhenAll(tasks);

                if (finalErrResults.Count < maxStoredErrors)
                {
                    var errors = batchResults.Where(r => r != null && !r.IsSuccess).ToList();
                    finalErrResults.AddRange(errors.Take(maxStoredErrors - finalErrResults.Count));
                }

                tasks.Clear();
                currentBatch.Clear();
            }

            accountList.Clear();
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }

        return finalErrResults;
    }

    private async Task<ResultResp?> ProcessAccountAsync(account a, RunJobRequest request, CancellationToken ct)
    {
        try
        {
            if (request.PrimaryEntityActionStr == "spd_OrgMonthlyReport")
            {
                var response = await a.spd_OrgMonthlyReport().GetValueAsync(ct);
                return new ResultResp
                {
                    PrimaryEntityId = a.accountid.Value,
                    IsSuccess = response.IsSuccess ?? false,
                    ResultStr = response.Result
                };
            }
            else if (request.PrimaryEntityActionStr == "spd_MonthlyInvoice")
            {
                var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
                return new ResultResp
                {
                    PrimaryEntityId = a.accountid.Value,
                    IsSuccess = response.IsSuccess ?? false,
                    ResultStr = response.Result
                };
            }
            return null; // Unknown action
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing account {AccountId}", a.accountid.Value);

            return new ResultResp
            {
                IsSuccess = false,
                ResultStr = ex.Message.Length > 500 ? ex.Message.Substring(0, 500) + "..." : ex.Message,
                PrimaryEntityId = a.accountid.Value
            };
        }
    }

    public async Task<List<account>> GetAccountsInChuckAsync(DynamicsContext context, int chunkSize, int chunkNumber, string filterStr, CancellationToken ct)
    {
        int skip = chunkNumber * chunkSize;
        var accountsQuery = context.accounts
            .AddQueryOption("$select", "accountid")
            .AddQueryOption("$filter", filterStr)
            .AddQueryOption("$orderby", "createdon desc")
            .IncludeCount()
            .AddQueryOption("$skip", $"{skip}")
            .AddQueryOption("$top", $"{chunkSize}");

        var accounts = (QueryOperationResponse<account>)await accountsQuery.ExecuteAsync(ct);
        return accounts.ToList();
    }


    public async Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(int concurrentRequests, CancellationToken ct)
    {
        int completed = 0;
        using var context = _factory.Create();
        var accounts = await GetAllAccountsAsync(context, ct);

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

    public async Task<IEnumerable<account>> GetAllAccountsAsync(DynamicsContext context, CancellationToken ct)
    {
        string filterStr = "statecode eq 0 and spd_eligibleforcreditpayment eq 100000001";

        var accountsQuery = context.accounts
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
                response = (QueryOperationResponse<account>)await context.ExecuteAsync(continuation, ct);
            }
            allAccounts.AddRange(response);
            continuation = response.GetContinuation();
        } while (continuation != null);

        return allAccounts;
    }

}
