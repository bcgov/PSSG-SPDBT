using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<BulkHistoryListResp> QueryBulkHistoryAsync(BulkHistoryListQry query, CancellationToken ct)
    {
        IQueryable<spd_genericupload> uploads = _context.spd_genericuploads
            .Expand(u => u.spd_UploadedBy)
            .Where(u => u._spd_organizationid_value == query.OrgId)
            .Where(u => u.statecode == DynamicsConstants.StateCode_Active);

        if (query.SortBy == null || query.SortBy.SubmittedDateDesc == null || (bool)query.SortBy.SubmittedDateDesc)
            uploads = uploads.OrderByDescending(a => a.spd_datetimeuploaded);
        if (query?.SortBy?.SubmittedDateDesc == false)
            uploads = uploads.OrderBy(a => a.spd_datetimeuploaded);

        if (query?.Paging != null)
        {
            uploads = uploads
                    .Skip(query.Paging.Page * query.Paging.PageSize)
                    .Take(query.Paging.PageSize);
        }

        var q = ((DataServiceQuery<spd_genericupload>)uploads).IncludeCount();
        var data = (QueryOperationResponse<spd_genericupload>)await q.ExecuteAsync(ct);

        var response = new BulkHistoryListResp();
        response.BulkUploadHistorys = _mapper.Map<IEnumerable<BulkHistoryResp>>(uploads);

        if (query?.Paging != null)
        {
            response.Pagination = new PaginationResp();
            response.Pagination.PageSize = query.Paging.PageSize;
            response.Pagination.PageIndex = query.Paging.Page;
            response.Pagination.Length = (int)data.Count;
        }

        return response;
    }

    public async Task<BulkAppsCreateResp> AddBulkAppsAsync(BulkAppsCreateCmd cmd, CancellationToken ct)
    {
        account? org = await _context.GetOrgById(cmd.OrgId, ct);
        spd_portaluser? user = await _context.GetUserById(cmd.UserId, ct);
        if (org == null || user == null)
            throw new ApiException(System.Net.HttpStatusCode.PreconditionFailed, "Invalid organization or user.");

        //create applications
        List<ApplicationCreateCmd> createApps = cmd.CreateApps.ToList();
        List<ApplicationCreateRslt> results = new List<ApplicationCreateRslt>();
        int begin = 0;
        //dynamics constraints: A maximum number of '1000' operations are allowed in a change set.
        //for each app create request, there is max 12 operations
        int oneChangeSetMaxApps = 1000 / 12;
        while (begin < createApps.Count)
        {
            int len = createApps.Count - begin;
            if (len > oneChangeSetMaxApps)
                len = oneChangeSetMaxApps;
            for (int index = begin; index < begin + len; index++)
            {
                var app = await CreateAppAsync(createApps[index], org, user);
                results.Add(new ApplicationCreateRslt
                {
                    LineNumber = index + 1,
                    ApplicationId = (Guid)app.spd_applicationid,
                    CreateSuccess = false
                });
            }
            await _context.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset, ct);
            results.ForEach(r =>
            {
                if (r.LineNumber >= begin && r.LineNumber < begin + oneChangeSetMaxApps)
                {
                    r.CreateSuccess = true;
                }
            });
            begin += len;
        }

        //add info to bulk history
        int bulkSize = createApps.Count;
        int successCount = results.Count(r => r.CreateSuccess);

        BulkAppsCreateResultCd bulkResult;
        if (successCount == bulkSize)
        {
            bulkResult = BulkAppsCreateResultCd.Success;
        }
        else if (successCount == 0)
        {
            bulkResult = BulkAppsCreateResultCd.Failed;
        }
        else
        {
            bulkResult = BulkAppsCreateResultCd.PartiallySuccess;
        }

        return new BulkAppsCreateResp { CreateAppResults = results, BulkAppsCreateCode = bulkResult };
    }
}


