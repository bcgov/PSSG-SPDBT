using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ResourceContracts;
using System.Net;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<ClearanceListResp> QueryAsync(ClearanceListQry clearanceListQry, CancellationToken ct)
    {
        if (clearanceListQry == null || clearanceListQry.FilterBy?.OrgId == null)
            throw new ArgumentNullException("clearanceListQry.FilterBy.OrgId", "Must query clearances by organization id.");

        string filterStr = GetClearanceFilterString(clearanceListQry.FilterBy);
        string sortStr = GetClearanceSortBy(clearanceListQry.SortBy);
        var clearanceaccesses = _context.spd_clearanceaccesses
            .AddQueryOption("$filter", $"{filterStr}")
            .AddQueryOption("$orderby", $"{sortStr}")
            .IncludeCount();

        if (clearanceListQry.Paging != null)
        {
            int skip = clearanceListQry.Paging.Page * clearanceListQry.Paging.PageSize;
            clearanceaccesses = clearanceaccesses
                .AddQueryOption("$skip", $"{skip}")
                .AddQueryOption("$top", $"{clearanceListQry.Paging.PageSize}");
        }

        var result = (QueryOperationResponse<spd_clearanceaccess>)await clearanceaccesses.ExecuteAsync(ct);

        var response = new ClearanceListResp();
        response.Clearances = _mapper.Map<IEnumerable<ClearanceResp>>(result);
        if (clearanceListQry.Paging != null)
        {
            response.Pagination = new PaginationResp();
            response.Pagination.PageSize = clearanceListQry.Paging.PageSize;
            response.Pagination.PageIndex = clearanceListQry.Paging.Page;
            response.Pagination.Length = (int)result.Count;
        }

        return response;
    }

    public async Task<ShareableClearanceListResp> QueryAsync(ShareableClearanceQry shareableClearanceQry, CancellationToken ct)
    {
        ShareableClearanceListResp resp = new();
        var keyExisted = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(shareableClearanceQry.ServiceType.ToString(), out Guid stGuid);
        if (!keyExisted)
            throw new ArgumentException("invalid service type");

        var clearances = _context.spd_clearances
            .Expand(c => c.spd_CaseID)
            .Where(c => c._spd_contactid_value == shareableClearanceQry.ContactId)
            .Where(c => c._spd_servicetype_value == stGuid)
            .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
            .Where(c => c.spd_expirydate > shareableClearanceQry.FromDate);

        if (shareableClearanceQry.WorkWith == null || shareableClearanceQry.WorkWith == EmployeeInteractionTypeCode.Neither)
            clearances = clearances.Where(c => c.spd_workswith == null);
        else
        {
            int workwith = (int)Enum.Parse<WorksWithChildrenOptionSet>(shareableClearanceQry.WorkWith.ToString());
            clearances = clearances.Where(c => c.spd_workswith == workwith);
        }

        if (shareableClearanceQry.Shareable)
            clearances = clearances.Where(c => c.spd_sharable == (int)YesNoOptionSet.Yes);

        resp.Clearances = _mapper.Map<IEnumerable<ShareableClearanceResp>>(clearances);
        return resp;
    }

    public async Task DeleteClearanceAccessAsync(ClearanceAccessDeleteCmd clearanceAccessDeleteCmd, CancellationToken cancellationToken)
    {
        var clearance = await GetClearanceAccessById(clearanceAccessDeleteCmd.ClearanceAccessId, clearanceAccessDeleteCmd.OrgId);

        if (clearance == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid OrgId or ClearanceAccessId");

        clearance.statecode = DynamicsConstants.StateCode_Inactive;
        clearance.statuscode = (int)ClearanceAccessStatusOptionSet.Revoked;

        _context.UpdateObject(clearance);

        await _context.SaveChangesAsync(cancellationToken);
    }

    private string GetClearanceFilterString(ClearanceFilterBy clearanceFilterBy)
    {
        ClearanceAccessStatusOptionSet status = Enum.Parse<ClearanceAccessStatusOptionSet>(clearanceFilterBy.ClearanceAccessStatus.ToString());
        string dateStr = DateTime.UtcNow.AddDays(90).Date.ToString("yyyy-MM-dd");
        string orgFilter = $"_spd_organizationid_value eq {clearanceFilterBy.OrgId}";
        string statusFilter = $"statuscode eq {(int)status}";
        string expireDateFilter = $"spd_expirydate le {dateStr}";

        string? contains = null;
        if (!string.IsNullOrWhiteSpace(clearanceFilterBy.NameOrEmailContains))
        {
            contains = $"(contains(spd_applicantfullname,'{clearanceFilterBy.NameOrEmailContains}') or contains(spd_emailaddress1,'{clearanceFilterBy.NameOrEmailContains}'))";
        }
        string result = $"{orgFilter}";
        result += $" and {statusFilter}";
        result += $" and {expireDateFilter}";
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


