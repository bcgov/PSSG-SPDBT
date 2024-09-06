using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.Application;
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
        account? org = await _context.accounts
            .Expand(a => a.spd_account_spd_servicetype)
            .Where(a => a.accountid == cmd.OrgId)
            .SingleOrDefaultAsync(ct);
        spd_servicetype? servicetype = org.spd_account_spd_servicetype.First(s => s.spd_servicecategory == (int)ServiceTypeCategoryOptionSet.Screening);
        spd_portaluser? user = await _context.GetUserById(cmd.UserId, ct);
        Guid teamGuid = Guid.Parse(DynamicsConstants.Client_Service_Team_Guid);
        team? team = await _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefaultAsync(ct);
        if (org == null || user == null)
            throw new ApiException(System.Net.HttpStatusCode.PreconditionFailed, "Invalid organization or user.");

        //create applications
        List<ApplicationCreateCmd> createApps = cmd.CreateApps.ToList();
        List<ApplicationCreateRslt> results = new();
        for (int i = 0; i < createApps.Count; i++)
        {
            results.Add(new ApplicationCreateRslt { LineNumber = i + 1 });
        }

        int begin = 0;
        //dynamics constraints: A maximum number of '1000' operations are allowed in a change set.
        //for each app create request, there is max 14 operations
        int oneChangeSetMaxApps = 1000 / 15;
        while (begin < createApps.Count)
        {
            int len = createApps.Count - begin;
            if (len > oneChangeSetMaxApps)
                len = oneChangeSetMaxApps;
            for (int index = begin; index < begin + len; index++)
            {
                var app = await CreateAppAsync(createApps[index], org, user, team, servicetype);
                results[index].ApplicationId = (Guid)app.spd_applicationid;
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

        //return result
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

        //add history
        if (bulkResult != BulkAppsCreateResultCd.Failed)
        {
            spd_genericupload bulkInfo = new()
            {
                spd_genericuploadid = Guid.NewGuid(),
                spd_filename = cmd.FileName,
                spd_datetimeuploaded = DateTimeOffset.UtcNow,
                spd_batchnumber = DateTime.Now.Ticks.ToString() //waiting for dynamics decision on format
            };
            _context.AddTospd_genericuploads(bulkInfo);
            _context.SetLink(bulkInfo, nameof(bulkInfo.spd_UploadedBy), user);
            _context.SetLink(bulkInfo, nameof(bulkInfo.spd_OrganizationId), org);
            await _context.SaveChangesAsync(ct);
        }

        return new BulkAppsCreateResp { CreateAppResults = results, BulkAppsCreateCode = bulkResult };
    }
}


