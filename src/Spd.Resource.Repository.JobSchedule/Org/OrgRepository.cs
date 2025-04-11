using AutoMapper;
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
        string typeStr = "Microsoft.Dynamics.CRM.account, Spd.Utilities.Dynamics";

        Type type = Type.GetType(typeStr);
        if (type == null) throw new Exception("Type not found.");

        var property = _context.GetType().GetProperty(primaryEntityName);
        if (property == null) throw new Exception("Property not found.");

        dynamic query = property.GetValue(_context) as IQueryable;
        query.AddQueryOption("$filter", $"{filterStr}");

        string filter = "statecode == @0 && spd_eligibleforcreditpayment == @1";
        object[] values = { DynamicsConstants.StateCode_Active, (int)YesNoOptionSet.Yes };
        // Now you can write dynamic LINQ
        var filtered = query
            .Where(filter, values)
            .ToDynamicList();

        //string primaryEntityName = "accounts";
        //string typeStr = "Microsoft.Dynamics.CRM.account";
        //Type type = Type.GetType(typeStr);
        //var value = (DataServiceQuery)_context.GetType().GetProperty(primaryEntityName)?.GetValue(_context);
        //var temp = value.Where(a => a.statecode == DynamicsConstants.StateCode_Active)
        //    .Where(a => a.spd_eligibleforcreditpayment == (int)YesNoOptionSet.Yes)
        //    .ToList();

        //var accounts = value.Where(a => a.statecode == DynamicsConstants.StateCode_Active)
        //    .Where(a => a.spd_eligibleforcreditpayment == (int)YesNoOptionSet.Yes)
        //    .ToList();

        //using var semaphore = new SemaphoreSlim(10); // Limit to 10 concurrent requests

        //var tasks = accounts.Select(async a =>
        //{
        //    await semaphore.WaitAsync();
        //    try
        //    {
        //        var response = await a.spd_MonthlyInvoice().GetValueAsync(ct);
        //        ResultResp rr = _mapper.Map<ResultResp>(response);
        //        rr.OrgId = a.accountid.Value;
        //        return rr;
        //    }
        //    catch (Exception ex)
        //    {
        //        return new ResultResp { IsSuccess = false, ResultStr = ex.Message, OrgId = a.accountid.Value };
        //    }
        //    finally
        //    {
        //        semaphore.Release();
        //    }
        //});

        //var results = await Task.WhenAll(tasks);
        //return results;
        return null;
    }

}

