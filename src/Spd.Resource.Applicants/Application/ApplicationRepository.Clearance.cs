using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
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

    public async Task<ClearanceLetterResp> QueryLetterAsync(ClearanceLetterQry clearanceLetterQry, CancellationToken ct)
    {
        var docUrl = await _context.bcgov_documenturls.Where(d => d._spd_clearanceid_value == clearanceLetterQry.ClearanceId)
            .OrderByDescending(d => d.createdon).FirstOrDefaultAsync(ct);

        if (docUrl == null || docUrl.bcgov_documenturlid == null)
            return new ClearanceLetterResp(); // no clearance letter yet

        FileQueryResult fileResult = (FileQueryResult)await _fileStorage.HandleQuery(
            new FileQuery { Key = docUrl.bcgov_documenturlid.ToString(), Folder = $"spd_clearance/{docUrl._spd_clearanceid_value}" },
            ct);
        return new ClearanceLetterResp()
        {
            Content = fileResult.File.Content,
            ContentType = fileResult.File.ContentType,
            FileName = fileResult.File.FileName
        };
    }

    public async Task<SharableClearanceListResp> QueryAsync(SharableClearanceQry sharableClearanceQry, CancellationToken ct)
    {
        SharableClearanceListResp resp = new();
        var keyExisted = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(sharableClearanceQry.ServiceType.ToString(), out Guid stGuid);
        if (!keyExisted)
            throw new ArgumentException("invalid service type");

        var clearances = _context.spd_clearances
            .Expand(c => c.spd_CaseID)
            .Where(c => c._spd_contactid_value == sharableClearanceQry.ContactId)
            .Where(c => c._spd_servicetype_value == stGuid)
            .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
            .Where(c => c.spd_expirydate > sharableClearanceQry.FromDate);

        if (sharableClearanceQry.WorkWith == null || sharableClearanceQry.WorkWith == EmployeeInteractionTypeCode.Neither)
            clearances = clearances.Where(c => c.spd_workswith == null);
        else 
        {
            int workwith = (int)Enum.Parse<WorksWithChildrenOptionSet>(sharableClearanceQry.WorkWith.ToString());
            clearances = clearances.Where(c => c.spd_workswith == workwith);
        }

        if (sharableClearanceQry.Sharable)
            clearances = clearances.Where(c => c.spd_sharable > 0);

        resp.Clearances = _mapper.Map<IEnumerable<SharableClearanceResp>>(clearances);
        return resp;
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
        string dateStr = DateTime.UtcNow.AddDays(90).Date.ToString("yyyy-MM-dd");
        string orgFilter = $"_spd_organizationid_value eq {clearanceFilterBy.OrgId}";
        string stateFilter = $"statecode eq {DynamicsConstants.StateCode_Active}";
        string expireDateFilter = $"spd_expirydate le {dateStr}";

        string? contains = null;
        if (!string.IsNullOrWhiteSpace(clearanceFilterBy.NameOrEmailContains))
        {
            contains = $"(contains(spd_applicantfullname,'{clearanceFilterBy.NameOrEmailContains}') or contains(spd_emailaddress1,'{clearanceFilterBy.NameOrEmailContains}'))";
        }
        string result = $"{orgFilter}";
        result += $" and {stateFilter}";
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


