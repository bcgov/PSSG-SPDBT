using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.BulkHistory;
internal class BulkHistoryRepository : IBulkHistoryRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;


    public BulkHistoryRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<BulkHistoryListResp> QueryAsync(BulkHistoryListQry query, CancellationToken ct)
    {
        IQueryable<spd_genericupload> uploads = _context.spd_genericuploads
            .Where(u => u._spd_organizationid_value == query.OrgId)
            .Where(u => u.statecode == DynamicsConstants.StateCode_Active);

        if (query.SortBy == null || query.SortBy.SubmittedDateDesc == null || (bool)query.SortBy.SubmittedDateDesc)
            uploads = uploads.OrderByDescending(a => a.spd_datetimeuploaded);
        if (query?.SortBy?.SubmittedDateDesc == false)
            uploads = uploads.OrderBy(a => a.spd_datetimeuploaded);


        //int count = uploads.AsEnumerable().Count();

        if (query?.Paging != null)
        {
            uploads = uploads
                    .Skip(query.Paging.Page * query.Paging.PageSize)
                    .Take(query.Paging.PageSize);
        }

        var q = ((DataServiceQuery<spd_genericupload>)uploads).IncludeCount();
        var data = (QueryOperationResponse<spd_genericupload>)await q.ExecuteAsync(ct);
        //var count = data.Count;
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


}


