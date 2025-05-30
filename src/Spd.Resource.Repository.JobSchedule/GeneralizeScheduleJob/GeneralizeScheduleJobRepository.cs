using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using System.Reflection;

namespace Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;
internal class GeneralizeScheduleJobRepository : IGeneralizeScheduleJobRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<IGeneralizeScheduleJobRepository> _logger;

    public GeneralizeScheduleJobRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<IGeneralizeScheduleJobRepository> logger)
    {
        _context = ctx.Create();
        _mapper = mapper;
        this._logger = logger;
    }

    //public async Task<IEnumerable<ResultResp>> RunJobsAsync(RunJobRequest request, CancellationToken ct)
    //{
    //    string primaryEntityName = request.PrimaryEntityName;
    //    string filterStr = request.PrimaryEntityFilterStr;
    //    string actionStr = request.PrimaryEntityActionStr;
    //    string primaryEntityIdName = request.PrimaryEntityIdName;

    //    var property = _context.GetType().GetProperty(primaryEntityName);
    //    if (property == null) throw new Exception("Property not found.");

    //    dynamic query = property.GetValue(_context) as DataServiceQuery;
    //    query.AddQueryOption("$filter", $"{filterStr}");
    //    var result = await query.ExecuteAsync(ct);
    //    var data = ((IEnumerable<dynamic>)result).ToList();

    //    using var semaphore = new SemaphoreSlim(10); // Limit to 10 concurrent requests

    //    var tasks = data.Select(async a =>
    //    {
    //        await semaphore.WaitAsync();
    //        try
    //        {
    //            //get primary id
    //            var idProperty = a.GetType().GetProperty(primaryEntityIdName);
    //            object obj = idProperty.GetValue(a);
    //            string idStr = obj.ToString();

    //            //invoke method
    //            var method = a.GetType().GetMethod(actionStr);
    //            var result = method?.Invoke(a, null);
    //            var getValueAsyncMethod = result.GetType().GetMethod(
    //                "GetValueAsync",
    //                new[] { typeof(CancellationToken) });
    //            if (getValueAsyncMethod == null) throw new Exception("GetValueAsync method not found.");
    //            var task = (Task)getValueAsyncMethod.Invoke(result, new object[] { ct });
    //            await task.ConfigureAwait(false);

    //            // If it's Task<T>, get the result via reflection
    //            var resultProperty = task.GetType().GetProperty("Result");
    //            var value = resultProperty?.GetValue(task);
    //            ResultResp rr = _mapper.Map<ResultResp>(value);
    //            rr.PrimaryEntityId = Guid.Parse(idStr);
    //            return rr;
    //        }
    //        catch (Exception ex)
    //        {
    //            var idProperty = a.GetType().GetProperty(primaryEntityIdName);
    //            object obj = idProperty.GetValue(a);
    //            return new ResultResp { IsSuccess = false, ResultStr = ex.Message, PrimaryEntityId = Guid.Parse(obj.ToString()) };
    //        }
    //        finally
    //        {
    //            semaphore.Release();
    //        }
    //    });

    //    var results = await Task.WhenAll(tasks);
    //    return results;
    //}

    public async Task<IEnumerable<ResultResp>> RunJobsAsync(RunJobRequest request, int concurrentRequests, CancellationToken ct, int delayInMilliSec = 100)
    {
        string primaryTypeName = request.PrimaryTypeName;
        string primaryEntityName = request.PrimaryEntityName;
        string filterStr = request.PrimaryEntityFilterStr ?? string.Empty;
        string actionStr = request.PrimaryEntityActionStr;
        string primaryEntityIdName = request.PrimaryEntityIdName;

        // Resolve type dynamically
        Type entityType = GetEntityTypeByName(primaryTypeName);
        var data = await CallGetAllPrimaryEntityDynamicAsync(entityType, primaryEntityName, filterStr, ct);

        using var semaphore = new SemaphoreSlim(concurrentRequests);
        _logger.LogDebug("{ConcurrentRequests} concurrent requests", concurrentRequests);

        var tasks = data.Select(async a =>
        {
            await semaphore.WaitAsync(delayInMilliSec);
            try
            {
                //get primary id
                var idProperty = a.GetType().GetProperty(primaryEntityIdName);
                object obj = idProperty.GetValue(a);
                string idStr = obj.ToString();

                //invoke method
                var method = a.GetType().GetMethod(actionStr);
                var result = method?.Invoke(a, null);
                if (result == null) throw new Exception($"the {actionStr} invoked returns null");

                var getValueAsyncMethod = result.GetType().GetMethod(
                    "GetValueAsync",
                    new[] { typeof(CancellationToken) });
                if (getValueAsyncMethod == null) throw new Exception("GetValueAsync method not found.");

                var task = (Task)getValueAsyncMethod.Invoke(result, new object[] { ct });
                await task.ConfigureAwait(false);

                // If it's Task<T>, get the result via reflection
                var resultProperty = task.GetType().GetProperty("Result");
                var value = resultProperty?.GetValue(task);
                ResultResp rr = GetResultResp(value, Guid.Parse(idStr));
                _logger.LogInformation("{actionStr} executed result : success = {Success} {Result} primaryEntityId={entityId}", actionStr, rr.IsSuccess, rr.ResultStr, idStr);
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
                var idProperty = a.GetType().GetProperty(primaryEntityIdName);
                object obj = idProperty.GetValue(a);
                return new ResultResp { IsSuccess = false, ResultStr = ex.Message, PrimaryEntityId = Guid.Parse(obj.ToString()) };
            }
            finally
            {
                semaphore.Release();
            }
        });

        var results = await Task.WhenAll(tasks);
        return results;
    }

    private static Type GetEntityTypeByName(string typeName)
    {
        var type = Type.GetType(typeName);
        if (type != null)
            return type;

        type = AppDomain.CurrentDomain
            .GetAssemblies()
            .SelectMany(a => a.GetTypes())
            .FirstOrDefault(t => t.Name.Equals(typeName, StringComparison.OrdinalIgnoreCase));

        if (type != null)
            return type;

        throw new InvalidOperationException($"Type '{typeName}' not found.");
    }

    private async Task<List<object>> CallGetAllPrimaryEntityDynamicAsync(
        Type entityType,
        string primaryEntityName,
        string filterStr,
        CancellationToken ct)
    {
        var method = this.GetType().GetMethod(
            "GetAllPrimaryEntityAsync",
            BindingFlags.NonPublic | BindingFlags.Instance);

        if (method == null)
            throw new InvalidOperationException("GetAllPrimaryEntityAsync method not found.");

        var genericMethod = method.MakeGenericMethod(entityType);

        var task = (Task)genericMethod.Invoke(this, new object[] { primaryEntityName, filterStr, ct });

        await task.ConfigureAwait(false);

        var resultProperty = task.GetType().GetProperty("Result");
        var result = resultProperty.GetValue(task);

        // Convert IEnumerable<T> → IEnumerable<object>
        var enumerable = result as System.Collections.IEnumerable;
        if (enumerable == null)
            throw new InvalidOperationException("The result is not enumerable.");

        var list = new List<object>();
        foreach (var item in enumerable)
        {
            list.Add(item);
        }
        _logger.LogInformation("{Count} {Name} found", list.Count, primaryEntityName);
        return list;
    }

    private ResultResp GetResultResp(object o, Guid primaryEntityId)
    {
        var isSuccessProperty = o.GetType().GetProperty("IsSuccess");
        bool? isSuccess = (bool?)isSuccessProperty.GetValue(o);
        var resultProperty = o.GetType().GetProperty("Result");
        string? result = (string?)resultProperty.GetValue(o);
        return new ResultResp()
        {
            IsSuccess = isSuccess ?? false,
            ResultStr = result,
            PrimaryEntityId = primaryEntityId
        };
    }
    private async Task<IEnumerable<T>> GetAllPrimaryEntityAsync<T>(string primaryEntityName, string filterStr, CancellationToken ct)
    {
        //filterStr = "statecode eq 0 and spd_eligibleforcreditpayment eq 100000001";
        var property = _context.GetType().GetProperty(primaryEntityName);
        if (property == null) throw new Exception("Property not found.");

        var query = property.GetValue(_context) as DataServiceQuery<T>;
        query = query.AddQueryOption("$filter", filterStr)
            .IncludeCount();

        var allEntities = new List<T>();
        QueryOperationResponse<T> response;
        DataServiceQueryContinuation<T> continuation = null;

        do
        {
            if (continuation == null)
            {
                response = (QueryOperationResponse<T>)await query.ExecuteAsync(ct);
            }
            else
            {
                response = (QueryOperationResponse<T>)await _context.ExecuteAsync(continuation, ct);
            }
            allEntities.AddRange(response);
            continuation = response.GetContinuation();
        } while (continuation != null);

        return allEntities;
    }
}

