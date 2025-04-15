using AutoMapper;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;
internal class GeneralizeScheduleJobRepository : IGeneralizeScheduleJobRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    public GeneralizeScheduleJobRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<IEnumerable<ResultResp>> RunJobsAsync(RunJobRequest request, CancellationToken ct)
    {
        string primaryEntityName = request.PrimaryEntityName;
        string filterStr = request.PrimaryEntityFilterStr;
        string actionStr = request.PrimaryEntityActionStr;
        string primaryEntityIdName = request.PrimaryEntityIdName;

        var property = _context.GetType().GetProperty(primaryEntityName);
        if (property == null) throw new Exception("Property not found.");

        dynamic query = property.GetValue(_context) as DataServiceQuery;
        query.AddQueryOption("$filter", $"{filterStr}");
        var result = await query.ExecuteAsync(ct);
        var data = ((IEnumerable<dynamic>)result).ToList();

        using var semaphore = new SemaphoreSlim(10); // Limit to 10 concurrent requests

        var tasks = data.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
                //get primary id
                var idProperty = a.GetType().GetProperty(primaryEntityIdName);
                object obj = idProperty.GetValue(a);
                string idStr = obj.ToString();

                //invoke method
                var method = a.GetType().GetMethod(actionStr);
                var result = method?.Invoke(a, null);
                var getValueAsyncMethod = result.GetType().GetMethod(
                    "GetValueAsync",
                    new[] { typeof(CancellationToken) });
                if (getValueAsyncMethod == null) throw new Exception("GetValueAsync method not found.");
                var task = (Task)getValueAsyncMethod.Invoke(result, new object[] { ct });
                await task.ConfigureAwait(false);

                // If it's Task<T>, get the result via reflection
                var resultProperty = task.GetType().GetProperty("Result");
                var value = resultProperty?.GetValue(task);
                ResultResp rr = _mapper.Map<ResultResp>(value);
                rr.PrimaryEntityId = Guid.Parse(idStr);
                return rr;
            }
            catch (Exception ex)
            {
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

}

