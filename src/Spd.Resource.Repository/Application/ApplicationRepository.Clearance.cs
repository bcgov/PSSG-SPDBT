using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<ClearanceAccessListResp> QueryAsync(ClearanceAccessListQry clearanceListQry, CancellationToken ct)
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

        var response = new ClearanceAccessListResp();
        response.Clearances = _mapper.Map<IEnumerable<ClearanceAccessResp>>(result);
        if (clearanceListQry.Paging != null)
        {
            response.Pagination = new PaginationResp();
            response.Pagination.PageSize = clearanceListQry.Paging.PageSize;
            response.Pagination.PageIndex = clearanceListQry.Paging.Page;
            response.Pagination.Length = (int)result.Count;
        }

        return response;
    }

    public async Task<ClearanceListResp> QueryAsync(ClearanceQry clearanceQry, CancellationToken ct)
    {
        ClearanceListResp resp = new();

        var clearances = _context.spd_clearances
            .Expand(c => c.spd_CaseID)
            .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive);

        if (clearanceQry.ClearanceId != null)
        {
            clearances = clearances.Where(c => c.spd_clearanceid == clearanceQry.ClearanceId);
        }

        if (clearanceQry.ServiceType != null)
        {
            var keyExisted = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(clearanceQry.ServiceType.ToString(), out Guid stGuid);
            if (!keyExisted)
                throw new ArgumentException("invalid service type");
            clearances = clearances.Where(c => c._spd_servicetype_value == stGuid);
        }

        if (clearanceQry.ContactId != null)
            clearances = clearances.Where(c => c._spd_contactid_value == clearanceQry.ContactId);

        if (clearanceQry.FromDate != null)
            clearances = clearances.Where(c => c.spd_expirydate > clearanceQry.FromDate);

        if (clearanceQry.WorkWith != null)
        {
            if (clearanceQry.WorkWith == EmployeeInteractionTypeCode.Neither)
                clearances = clearances.Where(c => c.spd_workswith == null);
            else
            {
                int workwith = (int)Enum.Parse<WorksWithChildrenOptionSet>(clearanceQry.WorkWith.ToString());
                clearances = clearances.Where(c => c.spd_workswith == workwith);
            }
        }

        if (clearanceQry.Shareable != null)
        {
            clearances = (bool)clearanceQry.Shareable ? clearances.Where(c => c.spd_sharable == (int)YesNoOptionSet.Yes) :
                clearances.Where(c => c.spd_sharable == (int)YesNoOptionSet.No);
        }

        //spdbt-2629
        if (clearanceQry.IncludeServiceTypeEnum != null)
        {
            if (clearanceQry.IncludeServiceTypeEnum == ServiceTypeEnum.CRRP_EMPLOYEE || clearanceQry.IncludeServiceTypeEnum == ServiceTypeEnum.CRRP_VOLUNTEER)
            {
                DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.CRRP_VOLUNTEER.ToString(), out Guid volunteerGuid);
                DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.CRRP_EMPLOYEE.ToString(), out Guid employeeGuid);
                clearances = clearances.Where(c => c._spd_servicetype_value == volunteerGuid || c._spd_servicetype_value == employeeGuid);
            }
            else
            {
                var keyExisted = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(clearanceQry.IncludeServiceTypeEnum.ToString(), out Guid stGuid);
                if (!keyExisted)
                    throw new ArgumentException("invalid service type");
                clearances = clearances.Where(c => c._spd_servicetype_value == stGuid);
            }
        }

        if (clearanceQry.IncludeWorkWith != null)
        {
            if (clearanceQry.IncludeWorkWith == EmployeeInteractionTypeCode.Children) //work with children
            {
                int child = (int)Enum.Parse<WorksWithChildrenOptionSet>(EmployeeInteractionTypeCode.Children.ToString());
                int childAdult = (int)Enum.Parse<WorksWithChildrenOptionSet>(EmployeeInteractionTypeCode.ChildrenAndAdults.ToString());
                clearances = clearances.Where(c => c.spd_workswith == child || c.spd_workswith == childAdult);
            }
            else if (clearanceQry.IncludeWorkWith == EmployeeInteractionTypeCode.Adults) //work with adult
            {
                int adult = (int)Enum.Parse<WorksWithChildrenOptionSet>(EmployeeInteractionTypeCode.Adults.ToString());
                int childAdult = (int)Enum.Parse<WorksWithChildrenOptionSet>(EmployeeInteractionTypeCode.ChildrenAndAdults.ToString());
                clearances = clearances.Where(c => c.spd_workswith == adult || c.spd_workswith == childAdult);
            }
            else //work with children and adult
            {
                int childAdult = (int)Enum.Parse<WorksWithChildrenOptionSet>(EmployeeInteractionTypeCode.ChildrenAndAdults.ToString());
                clearances = clearances.Where(c => c.spd_workswith == childAdult);
            }
        }
        //spd

        resp.Clearances = _mapper.Map<IEnumerable<ClearanceResp>>(clearances);
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

    private string GetClearanceFilterString(ClearanceAccessFilterBy clearanceFilterBy)
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

    private string GetClearanceSortBy(ClearanceAccessSortBy? clearanceSortBy)
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


