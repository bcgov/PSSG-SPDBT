using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;

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

    public async Task<Guid?> AddApplicationsInBatchAsync(IEnumerable<ApplicationCreateCmd> createApplicationCmds, CancellationToken cancellationToken)
    {
        return null;
    }
}


