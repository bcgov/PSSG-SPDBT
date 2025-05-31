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
    private readonly IDynamicsContextFactory _factory;

    public GeneralizeScheduleJobRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<IGeneralizeScheduleJobRepository> logger)
    {
        _context = ctx.Create();
        _mapper = mapper;
        this._logger = logger;
        _factory = ctx;
    }

    public async Task<IEnumerable<ResultResp>> RunJobInChunksAsync(RunJobRequest request, int concurrentRequests, CancellationToken ct, int delayInMilliSec = 100)
    {
        string primaryTypeName = request.PrimaryTypeName;
        string primaryEntityName = request.PrimaryEntityName;
        string filterStr = request.PrimaryEntityFilterStr ?? string.Empty;
        string actionStr = request.PrimaryEntityActionStr;
        string primaryEntityIdName = request.PrimaryEntityIdName;

        // Resolve type dynamically
        Type entityType = GetEntityTypeByName(primaryTypeName);

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

            var entities = await CallGetEntitiesInChunksAsync(entityType, primaryEntityName, filterStr, chunkSize, chunkNumber, ct);
            returnedNumber = entities.Count();
            chunkNumber++;
            _logger.LogInformation("Returned number = {ReturnedNumber}", returnedNumber);

            for (int i = 0; i < entities.Count; i += concurrentRequests)
            {
                _logger.LogInformation("Process from {Begin} to {End}", i, i + concurrentRequests);
                var currentBatch = entities.Skip(i).Take(concurrentRequests).ToList();
                var tasks = new List<Task<ResultResp?>>();
                foreach (var a in currentBatch)
                {
                    var idProperty = a.GetType().GetProperty(primaryEntityIdName);
                    object obj = idProperty.GetValue(a);
                    string idStr = obj.ToString();
                    tasks.Add(ProcessEntityAsync(a, actionStr, idStr, ct));
                }

                var batchResults = await Task.WhenAll(tasks);

                if (finalErrResults.Count < maxStoredErrors)
                {
                    var errors = batchResults.Where(r => r != null && !r.IsSuccess).ToList();
                    finalErrResults.AddRange(errors.Take(maxStoredErrors - finalErrResults.Count));
                }

                tasks.Clear();
                currentBatch.Clear();
                // Optional delay after each batch to reduce burstiness
                await Task.Delay(delayInMilliSec);
            }

            entities.Clear();
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }
        return finalErrResults;
    }

    private async Task<ResultResp?> ProcessEntityAsync(object a, string actionStr, string idStr, CancellationToken ct)
    {
        try
        {
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
            _logger.LogError(ex, "Error processing account {Id}", idStr);

            return new ResultResp
            {
                IsSuccess = false,
                ResultStr = ex.Message.Length > 500 ? ex.Message.Substring(0, 500) + "..." : ex.Message,
                PrimaryEntityId = Guid.Parse(idStr)
            };
        }
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

    private async Task<List<object>> CallGetEntitiesInChunksAsync(
        Type entityType,
        string primaryEntityName,
        string filterStr,
        int chunkSize,
        int chunkNumber,
        CancellationToken ct)
    {
        var method = this.GetType().GetMethod(
            "GetEntitiesInChunksAsync",
            BindingFlags.NonPublic | BindingFlags.Instance);

        if (method == null)
            throw new InvalidOperationException("GetEntitiesInChunksAsync method not found.");

        var genericMethod = method.MakeGenericMethod(entityType);

        var task = (Task)genericMethod.Invoke(this, new object[] { primaryEntityName, filterStr, chunkSize, chunkNumber, ct });

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
    private async Task<IEnumerable<T>> GetEntitiesInChunksAsync<T>(string primaryEntityName,
        int chunkSize,
        int chunkNumber,
        string filterStr,
        CancellationToken ct)
    {
        var property = _context.GetType().GetProperty(primaryEntityName);
        if (property == null) throw new Exception("Property not found.");

        int skip = chunkNumber * chunkSize;
        var query = property.GetValue(_context) as DataServiceQuery<T>;
        query = query.AddQueryOption("$filter", filterStr)
            .AddQueryOption("$orderby", "createdon desc")
            .IncludeCount()
            .AddQueryOption("$skip", $"{skip}")
            .AddQueryOption("$top", $"{chunkSize}"); ;

        var entities = (QueryOperationResponse<T>)await query.ExecuteAsync(ct);
        return entities.ToList();
    }
}

