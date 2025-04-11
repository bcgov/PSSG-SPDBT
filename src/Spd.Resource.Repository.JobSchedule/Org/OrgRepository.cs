using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
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

        using var semaphore = new SemaphoreSlim(10); // Limit to 10 concurrent requests

        var tasks = accounts.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
                var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
                ResultResp rr = _mapper.Map<ResultResp>(response);
                rr.OrgId = a.accountid.Value;
                return rr;
            }
            catch (Exception ex)
            {
                return new ResultResp { IsSuccess = false, ResultStr = ex.Message, OrgId = a.accountid.Value };
            }
            finally
            {
                semaphore.Release();
            }
        });

        var results = await Task.WhenAll(tasks);
        return results;
    }

    public async Task<IEnumerable<ResultResp>> RunGeneralFunctionAsync(CancellationToken ct)
    {
        string primaryEntityName = "accounts";
        string filterStr = "statecode eq 0 && spd_eligibleforcreditpayment eq 100000001";
        string actionStr = "spd_MonthlyInvoice";


        var property = _context.GetType().GetProperty(primaryEntityName);
        if (property == null) throw new Exception("Property not found.");

        dynamic query = property.GetValue(_context) as DataServiceQuery;
        query.AddQueryOption("$filter", $"{filterStr}");
        var result = await query.ExecuteAsync(ct);
        //var data = ((IEnumerable<dynamic>)result).ToList();
        var data = ((IEnumerable<account>)result).ToList();

        using var semaphore = new SemaphoreSlim(10); // Limit to 10 concurrent requests

        var tasks = data.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
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

                var idProperty = a.GetType().GetProperty("accountid");
                rr.OrgId = Guid.Parse(idProperty?.GetValue(a) as string);
                return rr;
            }
            catch (Exception ex)
            {
                return new ResultResp { IsSuccess = false, ResultStr = ex.Message, OrgId = a.accountid.Value };
            }
            finally
            {
                semaphore.Release();
            }
        });

        var results = await Task.WhenAll(tasks);
        return results;
    }

    public async Task<IEnumerable<ResultResp>> RunGenericFunctionAsync<T>(CancellationToken ct)
    {
        string primaryEntityName = "accounts";
        string filterStr = "statecode eq 0 && spd_eligibleforcreditpayment eq 100000001";
        string actionStr = "spd_MonthlyInvoice";

        var property = _context.GetType().GetProperty(primaryEntityName);
        if (property == null) throw new Exception("Property not found.");

        dynamic query = property.GetValue(_context) as DataServiceQuery;
        query.AddQueryOption("$filter", $"{filterStr}");
        var result = await query.ExecuteAsync(ct);
        var data = ((IEnumerable<dynamic>)result).ToList();
        //var data = ((IEnumerable<T>)result).ToList();

        using var semaphore = new SemaphoreSlim(10); // Limit to 10 concurrent requests

        var tasks = data.Select(async a =>
        {
            await semaphore.WaitAsync();
            try
            {
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
                rr.OrgId = a.accountid.Value;
                return rr;
            }
            catch (Exception ex)
            {
                return new ResultResp { IsSuccess = false, ResultStr = ex.Message, OrgId = a.accountid.Value };
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

