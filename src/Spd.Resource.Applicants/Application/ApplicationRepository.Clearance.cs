using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<ClearanceListResp> QueryAsync(ClearanceListQry query, CancellationToken ct)
    {
        if (query == null || query.FilterBy?.OrgId == null)
            throw new ArgumentNullException("query.FilterBy.OrgId", "Must query clearances by organization id.");

        string filterStr = GetClearanceFilterString(query.FilterBy);
        string sortStr = GetClearanceSortBy(query.SortBy);
        var clearanceaccesses = _context.spd_clearanceaccesses
            .AddQueryOption("$filter", $"{filterStr}")
            .AddQueryOption("$orderby", $"{sortStr}")
            .IncludeCount();

        if (query.Paging != null)
        {
            int skip = query.Paging.Page * query.Paging.PageSize;
            clearanceaccesses = clearanceaccesses
                .AddQueryOption("$skip", $"{skip}")
                .AddQueryOption("$top", $"{query.Paging.PageSize}");
        }

        var result = (QueryOperationResponse<spd_clearanceaccess>)await clearanceaccesses.ExecuteAsync(ct);

        var response = new ClearanceListResp();
        response.Clearances = _mapper.Map<IEnumerable<ClearanceResp>>(result);
        if (query.Paging != null)
        {
            response.Pagination = new PaginationResp();
            response.Pagination.PageSize = query.Paging.PageSize;
            response.Pagination.PageIndex = query.Paging.Page;
            response.Pagination.Length = (int)result.Count;
        }

        return response;
    }

    public async Task DeleteClearanceAccessAsync(ClearanceAccessDeleteCmd clearanceAccessDeleteCmd, CancellationToken cancellationToken)
    {
        var clearance = await GetClearanceAccessById(clearanceAccessDeleteCmd.ClearanceAccessId, clearanceAccessDeleteCmd.OrgId);

        if (clearance == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid OrgId or ClearanceAccessId");

        clearance.statecode = DynamicsConstants.StateCode_Inactive;
        clearance.statuscode = DynamicsConstants.StatusCode_Inactive;

        _context.UpdateObject(clearance);

        await _context.SaveChangesAsync(cancellationToken);
    }

    private string GetClearanceFilterString(ClearanceFilterBy clearanceFilterBy)
    {
        string orgFilter = $"_spd_organizationid_value eq {clearanceFilterBy.OrgId}";
        string stateFilter = $"statecode eq {DynamicsConstants.StateCode_Active}";

        string? contains = null;
        if (!string.IsNullOrWhiteSpace(clearanceFilterBy.NameOrEmailContains))
        {
            contains = $"(contains(spd_applicantfullname,'{clearanceFilterBy.NameOrEmailContains}') or contains(spd_emailaddress1,'{clearanceFilterBy.NameOrEmailContains}'))";
        }
        string result = $"{orgFilter}";
        result += $" and {stateFilter}";
        if (contains != null)
        {
            result += $" and {contains}";
        }
        return result;
    }

    private string GetClearanceSortBy(ClearanceSortBy? clearanceSortBy)
    {
        if (clearanceSortBy == null
            || (clearanceSortBy.ExpiresOn != null && (bool)clearanceSortBy.ExpiresOn))
            return "spd_expirydate";

        if (clearanceSortBy.ExpiresOn != null && !(bool)clearanceSortBy.ExpiresOn)
            return "spd_expirydate desc";

        if (clearanceSortBy.NameDesc != null && (bool)clearanceSortBy.NameDesc)
            return "spd_applicantfullname desc";

        if (clearanceSortBy.NameDesc != null && !(bool)clearanceSortBy.NameDesc)
            return "spd_applicantfullname";

        if (clearanceSortBy.CompanyNameDesc != null && (bool)clearanceSortBy.CompanyNameDesc)
            return "spd_contractedcompanyname desc";

        if (clearanceSortBy.CompanyNameDesc != null && !(bool)clearanceSortBy.CompanyNameDesc)
            return "spd_contractedcompanyname";

        return "createdon desc";
    }

    private async Task<spd_clearanceaccess?> GetClearanceAccessById(Guid clearanceAccessId, Guid organizationId)
       => await _context.spd_clearanceaccesses
            .Where(a => a.spd_clearanceaccessid == clearanceAccessId && a._spd_organizationid_value == organizationId).SingleOrDefaultAsync();
}


