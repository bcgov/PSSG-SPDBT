using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Application;
internal class ApplicationRepository : IApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ApplicationRepository> logger)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken ct)
    {
        spd_application application = _mapper.Map<spd_application>(createApplicationCmd);
        account? org = await _context.GetOrgById(createApplicationCmd.OrgId, ct);
        spd_portaluser? user = await _context.GetUserById(createApplicationCmd.CreatedByUserId, ct);
        _context.AddTospd_applications(application);
        _context.SetLink(application, nameof(spd_application.spd_OrganizationId), org);
        _context.SetLink(application, nameof(spd_application.spd_SubmittedBy), user);

        contact? contact = GetContact(createApplicationCmd);
        // if not found, create new contact
        if (contact == null)
        {
            contact = _mapper.Map<contact>(createApplicationCmd);
            _context.AddTocontacts(contact);
        }

        // associate contact to application
        _context.SetLink(application, nameof(application.spd_ApplicantId_contact), contact);

        //create the aliases
        foreach (var item in createApplicationCmd.Aliases)
        {
            spd_alias? matchingAlias = GetAlias(item);
            // if not found, create new alias
            if (matchingAlias == null)
            {
                spd_alias alias = _mapper.Map<spd_alias>(item);
                _context.AddTospd_aliases(alias);
                // associate alias to contact
                _context.SetLink(alias, nameof(alias.spd_ContactId), contact);
            }
        }

        await _context.SaveChangesAsync(ct);
        return application.spd_applicationid;
    }

    public async Task<ApplicationListResp> QueryAsync(ApplicationListQry query, CancellationToken cancellationToken)
    {
        if (query == null || query.FilterBy?.OrgId == null)
            throw new ArgumentNullException("query.FilterBy.OrgId", "Must query applications by organization id.");

        var applications = _context.spd_applications
                .Where(a => a._spd_organizationid_value == query.FilterBy.OrgId && a.statecode == DynamicsConstants.StateCode_Active);

        var count = applications.AsEnumerable().Count();

        //todo: add more filter and sorting here.
        //if (!string.IsNullOrWhiteSpace(query.FilterBy?.ApplicationStatus))
        //    applications = applications.Where(a => a.statecode == "InProgress");

        if (query.SortBy == null)
            applications = applications.OrderByDescending(a => a.createdon);

        if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && (bool)query.SortBy.SubmittedDateDesc)
            applications = applications.OrderByDescending(a => a.createdon);
        if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && !(bool)query.SortBy.SubmittedDateDesc)
            applications = applications.OrderBy(a => a.createdon);

        if (query.Paging != null)
        {
            applications = applications
                .Skip((query.Paging.Page) * query.Paging.PageSize)
                .Take(query.Paging.PageSize);
        }

        var result = applications.AsEnumerable();
        var response = new ApplicationListResp();

        response.Applications = _mapper.Map<IEnumerable<ApplicationResult>>(result);

        if (query.Paging != null)
        {
            response.Pagination = new PaginationResp();
            response.Pagination.PageSize = query.Paging.PageSize;
            response.Pagination.PageIndex = query.Paging.Page;
            response.Pagination.Length = count;
        }

        return response;
    }

    public async Task<ApplicationStatisticsQueryResponse> QueryAsync(ApplicationStatisticsQuery query, CancellationToken ct)
    {
        var organization = await GetOrganizationById(query.OrganizationId);
        if (organization == null) return new ApplicationStatisticsQueryResponse();
        var organizationStatistics = await organization.spd_GetOrganizationStatistics().GetValueAsync(ct);
        var statisticsDictionary = new Dictionary<ApplicationsStatisticsCode, int>();
        if (organizationStatistics.AwaitingApplicant.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.AwaitingApplicant, organizationStatistics.AwaitingApplicant.Value);
        if (organizationStatistics.AwaitingPayment.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.AwaitingPayment, organizationStatistics.AwaitingPayment.Value);
        if (organizationStatistics.AwaitingThirdParty.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.AwaitingThirdParty, organizationStatistics.AwaitingThirdParty.Value);
        if (organizationStatistics.CancelledByApplicant.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.CancelledByApplicant, organizationStatistics.CancelledByApplicant.Value);
        if (organizationStatistics.ClosedJudicialReview.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.ClosedJudicialReview, organizationStatistics.ClosedJudicialReview.Value);
        if (organizationStatistics.ClosedNoConsent.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.ClosedNoConsent, organizationStatistics.ClosedNoConsent.Value);
        if (organizationStatistics.ClosedNoResponse.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.ClosedNoResponse, organizationStatistics.ClosedNoResponse.Value);
        if (organizationStatistics.Incomplete.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.Incomplete, organizationStatistics.Incomplete.Value);
        if (organizationStatistics.InProgress.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.InProgress, organizationStatistics.InProgress.Value);
        if (organizationStatistics.RiskFound.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.RiskFound, organizationStatistics.RiskFound.Value);
        if (organizationStatistics.UnderAssessment.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.UnderAssessment, organizationStatistics.UnderAssessment.Value);
        if (organizationStatistics.VerifyIdentity.HasValue) statisticsDictionary.Add(ApplicationsStatisticsCode.VerifyIdentity, organizationStatistics.VerifyIdentity.Value);

        return new ApplicationStatisticsQueryResponse { Statistics = statisticsDictionary };
    }

    public async Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken cancellationToken)
    {
        var application = _context.spd_applications.Where(o =>
            o.spd_OrganizationId.accountid == searchApplicationQry.OrgId &&
            o.spd_firstname == searchApplicationQry.GivenName &&
            o.spd_lastname == searchApplicationQry.Surname &&
            o.spd_dateofbirth == new Microsoft.OData.Edm.Date(searchApplicationQry.DateOfBirth.Value.Year, searchApplicationQry.DateOfBirth.Value.Month, searchApplicationQry.DateOfBirth.Value.Day) &&
            o.statecode != DynamicsConstants.StateCode_Inactive
        ).FirstOrDefault();
        return application != null;
    }

    private spd_alias? GetAlias(AliasCreateCmd aliasCreateCmd)
    {
        var matchingAlias = _context.spd_aliases.Where(o =>
           o.spd_firstname == aliasCreateCmd.GivenName &&
           o.spd_middlename1 == aliasCreateCmd.MiddleName1 &&
           o.spd_middlename2 == aliasCreateCmd.MiddleName2 &&
           o.spd_surname == aliasCreateCmd.Surname &&
           o.statecode != DynamicsConstants.StateCode_Inactive
       ).FirstOrDefault();
        return matchingAlias;
    }

    private contact? GetContact(ApplicationCreateCmd createApplicationCmd)
    {
        if (createApplicationCmd.DriversLicense == null || createApplicationCmd.DriversLicense.IsNullOrEmpty())
        {
            var contact = _context.contacts
            .Where(o =>
            o.firstname == createApplicationCmd.GivenName &&
            o.lastname == createApplicationCmd.Surname &&
            o.birthdate == new Microsoft.OData.Edm.Date(createApplicationCmd.DateOfBirth.Value.Year, createApplicationCmd.DateOfBirth.Value.Month, createApplicationCmd.DateOfBirth.Value.Day) &&
            o.statecode != DynamicsConstants.StateCode_Inactive).FirstOrDefault();
            return contact;
        }
        else
        {
            var contact = _context.contacts
            .Where(o =>
            o.firstname == createApplicationCmd.GivenName &&
            o.lastname == createApplicationCmd.Surname &&
            (o.spd_bcdriverslicense == null || o.spd_bcdriverslicense == createApplicationCmd.DriversLicense) &&
            o.birthdate == new Microsoft.OData.Edm.Date(createApplicationCmd.DateOfBirth.Value.Year, createApplicationCmd.DateOfBirth.Value.Month, createApplicationCmd.DateOfBirth.Value.Day) &&
            o.statecode != DynamicsConstants.StateCode_Inactive).FirstOrDefault();
            return contact;
        }
    }
    private async Task<account?> GetOrganizationById(Guid organizationId)
        => await _context.accounts.Where(a => a.accountid == organizationId).SingleOrDefaultAsync();
}
