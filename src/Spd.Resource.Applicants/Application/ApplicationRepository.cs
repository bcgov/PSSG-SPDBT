using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;

namespace Spd.Resource.Applicants.Application;
internal class ApplicationRepository : IApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IFileStorageService _fileStorage;

    public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper, ITempFileStorageService tempFile, IFileStorageService fileStorage)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
        _tempFile = tempFile;
        _fileStorage = fileStorage;
    }

    public async Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken ct)
    {
        //create application
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

        //create bcgov_documenturl
        bcgov_documenturl documenturl = _mapper.Map<bcgov_documenturl>(createApplicationCmd.ConsentFormTempFile);
        var tag = _context.LookupTag(DynamicsContextLookupHelpers.AppConsentForm);
        _context.AddTobcgov_documenturls(documenturl);
        _context.SetLink(documenturl, nameof(documenturl.spd_ApplicationId), application);
        _context.SetLink(documenturl, nameof(documenturl.bcgov_Tag1Id), tag);

        //upload file to s3
        await UploadFileAsync(createApplicationCmd, application.spd_applicationid, documenturl.bcgov_documenturlid, ct);

        await _context.SaveChangesAsync(ct);
        return application.spd_applicationid;
    }

    public async Task<ApplicationListResp> QueryAsync(ApplicationListQry query, CancellationToken cancellationToken)
    {
        if (query == null || query.FilterBy?.OrgId == null)
            throw new ArgumentNullException("query.FilterBy.OrgId", "Must query applications by organization id.");
        string filterStr = GetAppFilterString(query.FilterBy);
        string sortStr = GetAppSortString(query.SortBy);
        var applications = _context.spd_applications
            .AddQueryOption("$filter", $"{filterStr}")
            .AddQueryOption("$orderby", $"{sortStr}")
            .IncludeCount();

        if (query.Paging != null)
        {
            int skip = query.Paging.Page * query.Paging.PageSize;
            applications = applications
                .AddQueryOption("$skip", $"{skip}")
                .AddQueryOption("$top", $"{query.Paging.PageSize}");
        }

        var result = (QueryOperationResponse<spd_application>)await applications.ExecuteAsync(cancellationToken);

        var response = new ApplicationListResp();
        response.Applications = _mapper.Map<IEnumerable<ApplicationResult>>(result);
        if (query.Paging != null)
        {
            response.Pagination = new PaginationResp();
            response.Pagination.PageSize = query.Paging.PageSize;
            response.Pagination.PageIndex = query.Paging.Page;
            response.Pagination.Length = (int)result.Count;
        }

        return response;
    }

    public async Task<bool> IdentityAsync(IdentityCmd identityCmd, CancellationToken cancellationToken)
    {
        spd_application? app = await _context.GetApplicationById(identityCmd.ApplicationId, cancellationToken);
        if (app == null) { return false; }

        if (identityCmd.Verify)
        {
            var paid = app.statecode == DynamicsConstants.StateCode_Inactive ? true : false;
            if (paid)
            {
                app.statuscode = (int?)ApplicationActiveStatus.PaymentPending;
                app.statecode = DynamicsConstants.StateCode_Active;
            }
            else
            {
                app.statuscode = (int?)ApplicationInactiveStatus.Submitted;
                app.statecode = DynamicsConstants.StateCode_Inactive;
            }
        }
        else
        {
            app.statuscode = (int?)ApplicationInactiveStatus.Cancelled;
            app.statecode = DynamicsConstants.StateCode_Inactive;
        }

        _context.UpdateObject(app);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<ApplicationStatisticsResp> QueryApplicationStatisticsAsync(ApplicationStatisticsQry query, CancellationToken ct)
    {
        var organization = await _context.GetOrgById(query.OrganizationId, ct);
        if (organization == null) return new ApplicationStatisticsResp();
        var organizationStatistics = await organization.spd_GetOrganizationStatistics().GetValueAsync(ct);
        var statisticsDictionary = new Dictionary<ApplicationPortalStatisticsCd, int>();
        if (organizationStatistics.AwaitingApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingApplicant, organizationStatistics.AwaitingApplicant.Value);
        if (organizationStatistics.AwaitingPayment.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingPayment, organizationStatistics.AwaitingPayment.Value);
        if (organizationStatistics.AwaitingThirdParty.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingThirdParty, organizationStatistics.AwaitingThirdParty.Value);
        if (organizationStatistics.CancelledByApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.CancelledByApplicant, organizationStatistics.CancelledByApplicant.Value);
        if (organizationStatistics.ClosedJudicialReview.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedJudicialReview, organizationStatistics.ClosedJudicialReview.Value);
        if (organizationStatistics.ClosedNoConsent.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedNoConsent, organizationStatistics.ClosedNoConsent.Value);
        if (organizationStatistics.ClosedNoResponse.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedNoResponse, organizationStatistics.ClosedNoResponse.Value);
        if (organizationStatistics.Incomplete.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.Incomplete, organizationStatistics.Incomplete.Value);
        if (organizationStatistics.InProgress.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.InProgress, organizationStatistics.InProgress.Value);
        if (organizationStatistics.RiskFound.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.RiskFound, organizationStatistics.RiskFound.Value);
        if (organizationStatistics.UnderAssessment.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.UnderAssessment, organizationStatistics.UnderAssessment.Value);
        if (organizationStatistics.VerifyIdentity.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.VerifyIdentity, organizationStatistics.VerifyIdentity.Value);
        if (organizationStatistics.ClearedLastSevenDays.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClearedLastSevenDays, organizationStatistics.ClearedLastSevenDays.Value);
        if (organizationStatistics.NotClearedLastSevenDays.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.NotClearedLastSevenDays, organizationStatistics.NotClearedLastSevenDays.Value);

        return new ApplicationStatisticsResp { Statistics = statisticsDictionary };
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
        var contacts = _context.contacts
            .Where(o =>
            o.firstname == createApplicationCmd.GivenName &&
            o.lastname == createApplicationCmd.Surname &&
            o.birthdate == new Microsoft.OData.Edm.Date(createApplicationCmd.DateOfBirth.Value.Year, createApplicationCmd.DateOfBirth.Value.Month, createApplicationCmd.DateOfBirth.Value.Day) &&
            o.statecode != DynamicsConstants.StateCode_Inactive);

        if (createApplicationCmd.DriversLicense == null || createApplicationCmd.DriversLicense.IsNullOrEmpty())
        {
            return contacts.FirstOrDefault();
        }
        else
        {
            contacts = contacts
            .Where(o => o.spd_bcdriverslicense == null || o.spd_bcdriverslicense == createApplicationCmd.DriversLicense);
            return contacts.FirstOrDefault();
        }
    }

    private string GetAppFilterString(AppFilterBy appFilterBy)
    {
        string orgFilter = $"_spd_organizationid_value eq {appFilterBy.OrgId}";
        string? portalStatusFilter = null;
        if (appFilterBy.ApplicationPortalStatus != null && appFilterBy.ApplicationPortalStatus.Any())
        {
            List<string> strs = new List<string>();
            foreach (ApplicationPortalStatusCd cd in appFilterBy.ApplicationPortalStatus)
            {
                var status = Enum.Parse<ApplicationPortalStatus>(cd.ToString());
                strs.Add($"spd_portalstatus eq {(int)status}");
            }
            portalStatusFilter = $"({string.Join(" or ", strs)})";
        }
        string? contains = null;
        if (!string.IsNullOrWhiteSpace(appFilterBy.NameOrEmailOrAppIdContains))
        {
            contains = $"(contains(spd_firstname,'{appFilterBy.NameOrEmailOrAppIdContains}') or contains(spd_lastname,'{appFilterBy.NameOrEmailOrAppIdContains}') or contains(spd_emailaddress1,'{appFilterBy.NameOrEmailOrAppIdContains}') or contains(spd_name,'{appFilterBy.NameOrEmailOrAppIdContains}'))";
        }
        string result = $"{orgFilter}";
        if (portalStatusFilter != null)
        {
            result += $" and {portalStatusFilter}";
        }
        if (contains != null)
        {
            result += $" and {contains}";
        }
        return result;
    }

    private string GetAppSortString(AppSortBy? appSortBy)
    {
        if (appSortBy == null
            || (appSortBy.SubmittedDateDesc != null && (bool)appSortBy.SubmittedDateDesc))
            return "createdon desc";

        if (appSortBy.SubmittedDateDesc != null && !(bool)appSortBy.SubmittedDateDesc)
            return "createdon";

        if (appSortBy.NameDesc != null && (bool)appSortBy.NameDesc)
            return "spd_fullname desc";

        if (appSortBy.NameDesc != null && !(bool)appSortBy.NameDesc)
            return "spd_fullname";

        if (appSortBy.CompanyNameDesc != null && (bool)appSortBy.CompanyNameDesc)
            return "spd_contractedcompanyname desc";

        if (appSortBy.CompanyNameDesc != null && !(bool)appSortBy.CompanyNameDesc)
            return "spd_contractedcompanyname";

        return "createdon desc";
    }


    private string GetClearanceFilterString(ClearanceFilterBy clearanceFilterBy)
    {
        string orgFilter = $"_spd_organization_value eq {clearanceFilterBy.OrgId}";
        string stateFilter = $"statecode eq {DynamicsConstants.StateCode_Active}";

        string? contains = null;
        if (!string.IsNullOrWhiteSpace(clearanceFilterBy.NameOrEmailContains))
        {
            contains = $"(contains(spd_firstname,'{clearanceFilterBy.NameOrEmailContains}') or contains(spd_lastname,'{clearanceFilterBy.NameOrEmailContains}') or contains(spd_emailaddress1,'{clearanceFilterBy.NameOrEmailContains}'))";
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
        //if (clearanceSortBy == null
        //    || (clearanceSortBy.ExpiresOn != null && (bool)clearanceSortBy.ExpiresOn))
        //    return "createdon";

        //if (clearanceSortBy.ExpiresOn != null && !(bool)clearanceSortBy.ExpiresOn)
        //    return "createdon desc";

        //if (clearanceSortBy.NameDesc != null && (bool)clearanceSortBy.NameDesc)
        //    return "spd_fullname desc";

        //if (clearanceSortBy.NameDesc != null && !(bool)clearanceSortBy.NameDesc)
        //    return "spd_fullname";

        //if (clearanceSortBy.CompanyNameDesc != null && (bool)clearanceSortBy.CompanyNameDesc)
        //    return "spd_contractedcompanyname desc";

        //if (clearanceSortBy.CompanyNameDesc != null && !(bool)clearanceSortBy.CompanyNameDesc)
        //    return "spd_contractedcompanyname";

        return "createdon desc";
    }

    private async Task UploadFileAsync(ApplicationCreateCmd cmd, Guid? applicationId, Guid? docUrlId, CancellationToken ct)
    {
        if (applicationId == null) return;
        if (docUrlId == null) return;
        byte[]? consentFileContent = await _tempFile.HandleQuery(
            new GetTempFileQuery(cmd.ConsentFormTempFile.TempFileKey), ct);
        if (consentFileContent == null) return;

        Utilities.FileStorage.File file = new()
        {
            Content = consentFileContent,
            ContentType = cmd.ConsentFormTempFile.ContentType,
            FileName = cmd.ConsentFormTempFile.FileName,
        };
        FileTag fileTag = new FileTag()
        {
            Tags = new List<Tag>
            {
                new Tag("file-classification", "Unclassified"),
                new Tag("file-tag",DynamicsContextLookupHelpers.AppConsentForm)
            }
        };
        await _fileStorage.HandleCommand(new UploadFileCommand(
            Key: ((Guid)docUrlId).ToString(),
            Folder: $"spd_application/{applicationId}",
            File: file,
            FileTag: fileTag
            ), ct);
    }
}


