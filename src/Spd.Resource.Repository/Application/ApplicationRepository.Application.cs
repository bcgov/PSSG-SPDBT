using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken ct)
    {
        //create application
        spd_application? application = null;
        account? org = await _context.GetOrgById(createApplicationCmd.OrgId, ct);
        if (org == null)
        {
            throw new InvalidOperationException($"cannot find org for {createApplicationCmd.OrgId}");
        }
        spd_portaluser? user = null;
        if (createApplicationCmd.CreatedByUserId != Guid.Empty)
        {
            user = await _context.GetUserById(createApplicationCmd.CreatedByUserId, ct);
        }
        Guid teamGuid = Guid.Parse(DynamicsConstants.Client_Service_Team_Guid);
        team? serviceTeam = await _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefaultAsync(ct);
        spd_servicetype? servicetype = _context.LookupServiceType(createApplicationCmd.ServiceType.ToString());
        account? parentOrg = null;
        if (createApplicationCmd.ParentOrgId != null)
        {
            parentOrg = await _context.GetOrgById((Guid)createApplicationCmd.ParentOrgId, ct);
        }
        if (org != null && serviceTeam != null)
            application = await CreateAppAsync(createApplicationCmd, org, user, serviceTeam, servicetype, parentOrg);
        await _context.SaveChangesAsync(ct);

        return application?.spd_applicationid;
    }

    public async Task<ApplicationListResp> QueryAsync(ApplicationListQry query, CancellationToken cancellationToken)
    {
        if (query == null || (query.FilterBy?.OrgId == null && query.FilterBy?.ParentOrgId == null))
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

    public async Task UpdateAsync(UpdateCmd cmd, CancellationToken ct)
    {
        spd_application? app = await _context.GetApplicationById(cmd.ApplicationId, ct);
        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid ApplicationId");

        if (cmd.Status != null)
        {
            app.statuscode = (int)Enum.Parse<ApplicationStatusOptionSet>(cmd.Status.ToString());
            if (cmd.Status == ApplicationStatusEnum.Submitted || cmd.Status == ApplicationStatusEnum.Cancelled)
                app.statecode = DynamicsConstants.StateCode_Inactive;
            else
                app.statecode = DynamicsConstants.StateCode_Active;
        }
        if (cmd.HaveVerifiedIdentity != null)
        {
            app.spd_identityconfirmed = cmd.HaveVerifiedIdentity;
        }
        _context.UpdateObject(app);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken ct)
    {
        var application = await _context.spd_applications.Where(o =>
            o.spd_OrganizationId.accountid == searchApplicationQry.OrgId &&
            o.spd_firstname == searchApplicationQry.GivenName &&
            o.spd_lastname == searchApplicationQry.Surname &&
            o.spd_dateofbirth == new Microsoft.OData.Edm.Date(searchApplicationQry.DateOfBirth.Value.Year, searchApplicationQry.DateOfBirth.Value.Month, searchApplicationQry.DateOfBirth.Value.Day) &&
            o.statecode != DynamicsConstants.StateCode_Inactive
        ).FirstOrDefaultAsync(ct);
        return application != null;
    }

    public async Task<ApplicantApplicationListResp> QueryApplicantApplicationListAsync(ApplicantApplicationListQry query, CancellationToken cancellationToken)
    {
        _logger.LogDebug($"query applicant application with applicantId={query.ApplicantId}");
        var applications = _context.spd_applications
            .Expand(i => i.spd_ServiceTypeId)
            .Expand(i => i.spd_OrganizationId)
            .Where(r => r._spd_applicantid_value == query.ApplicantId)
            .OrderByDescending(i => i.createdon);

        List<Guid?> serviceTypeGuid = IApplicationRepository.ScreeningServiceTypes.Select(c => DynamicsContextLookupHelpers.GetServiceTypeGuid(c.ToString())).ToList();

        var result = applications.ToList().Where(a => serviceTypeGuid.Contains(a._spd_servicetypeid_value));
        var response = new ApplicantApplicationListResp();
        response.Applications = _mapper.Map<IEnumerable<ApplicationResult>>(result);
        return response;
    }

    public async Task<ApplicationResult> QueryApplicationAsync(ApplicationQry query, CancellationToken ct)
    {
        var application = await _context.spd_applications
            .Expand(i => i.spd_OrganizationId)
            .Expand(i => i.spd_ApplicantId_contact)
            .Where(r => r.spd_applicationid == query.ApplicationId)
            .FirstOrDefaultAsync(ct);
        return _mapper.Map<ApplicationResult>(application);
    }

    public async Task ProcessAppWithSharableClearanceAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken ct)
    {
        if (!createApplicationCmd.SharedClearanceId.HasValue)
            throw new ArgumentException("SharedClearanceId cannot be null");
        account? org = await _context.GetOrgById(createApplicationCmd.OrgId, ct);
        contact? contact = await _context.contacts.Where(c => c.contactid == createApplicationCmd.ContactId).FirstOrDefaultAsync(ct);
        _mapper.Map<ApplicationCreateCmd, contact>(createApplicationCmd, contact);
        _context.UpdateObject(contact);

        //spdbt-3220
        spd_clearance? clearance = await _context.spd_clearances
            .Expand(c => c.spd_CaseID)
            .Where(c => c.spd_clearanceid == (Guid)createApplicationCmd.SharedClearanceId)
            .FirstOrDefaultAsync(ct);
        if (clearance == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot find specified clearance.");
        team? team = null;
        int state;
        int status;
        if (clearance.spd_CaseID.spd_risklevel == (int)CaseRiskLevelOptionSet.L2 || clearance.spd_CaseID.spd_risklevel == (int)CaseRiskLevelOptionSet.L3)
        {
            Guid teamGuid = Guid.Parse(DynamicsConstants.Screening_Risk_Assessment_Coordinator_Team_Guid);
            team = await _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefaultAsync(ct);
            status = (int)ClearanceAccessStatusOptionSet.Draft;
            state = DynamicsConstants.StateCode_Active;
        }
        else
        {
            Guid teamGuid = Guid.Parse(DynamicsConstants.Client_Service_Team_Guid);
            team = await _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefaultAsync(ct);
            status = (int)ClearanceAccessStatusOptionSet.Approved;
            state = DynamicsConstants.StateCode_Active;
        }

        spd_clearanceaccess clearanceaccess = new() { spd_clearanceaccessid = Guid.NewGuid() };
        clearanceaccess.statecode = state;
        clearanceaccess.statuscode = status;
        clearanceaccess.spd_issystemgenerated = true;
        _context.AddTospd_clearanceaccesses(clearanceaccess);
        _context.SetLink(clearanceaccess, nameof(clearanceaccess.spd_OrganizationId), org);
        _context.SetLink(clearanceaccess, nameof(clearanceaccess.spd_ClearanceId), clearance);
        _context.SetLink(clearanceaccess, nameof(clearanceaccess.owningteam), team);
        _context.SetLink(clearanceaccess, nameof(clearanceaccess.ownerid), team);
        await _context.SaveChangesAsync(ct);

        spd_clearanceaccess? clearAccess = await _context.GetClearanceAccessById((Guid)clearanceaccess.spd_clearanceaccessid, ct);
        if (clearAccess == null) throw new ApiException(HttpStatusCode.InternalServerError, "cannot find clearance access.");
        var result = await clearAccess.spd_ClearanceAccessNotification().GetValueAsync(ct);
        if (result.IsSuccess != true)
        {
            ClearanceAccessResp log = _mapper.Map<ClearanceAccessResp>(clearAccess);
            _logger.LogError("ClearanceAccessNotification failed with error {Error} for clearance access = {log}", result.Result, log);
        }
    }

    private spd_alias? GetAlias(AliasCreateCmd aliasCreateCmd, contact contact)
    {
        var matchingAlias = _context.spd_aliases.Where(o =>
           o.spd_firstname == aliasCreateCmd.GivenName &&
           o.spd_middlename1 == aliasCreateCmd.MiddleName1 &&
           o.spd_middlename2 == aliasCreateCmd.MiddleName2 &&
           o.spd_surname == aliasCreateCmd.Surname &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o._spd_contactid_value == contact.contactid
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

    private static string GetAppFilterString(AppFilterBy appFilterBy)
    {
        //orgfilter
        string? orgFilter = null;
        if (appFilterBy.OrgId != null)
            orgFilter = $"_spd_organizationid_value eq {appFilterBy.OrgId}";

        //parent org filter
        string? parentOrgFilter = null;
        if (appFilterBy.ParentOrgId != null)
            parentOrgFilter = $"_spd_parentorganizationid_value eq {appFilterBy.ParentOrgId}";

        //portal status filter
        string? portalStatusFilter = null;
        if (appFilterBy.ApplicationPortalStatus != null && appFilterBy.ApplicationPortalStatus.Any())
        {
            List<string> strs = new();
            foreach (ApplicationPortalStatusEnum cd in appFilterBy.ApplicationPortalStatus)
            {
                var status = Enum.Parse<ApplicationPortalStatus>(cd.ToString());
                strs.Add($"spd_portalstatus eq {(int)status}");
            }
            portalStatusFilter = $"({string.Join(" or ", strs)})";
        }

        //name email appId 
        string? containsNameEmailAppId = null;
        if (!string.IsNullOrWhiteSpace(appFilterBy.NameOrEmailOrAppIdContains))
        {
            var safeValue = appFilterBy.NameOrEmailOrAppIdContains.Replace("'", "''");
            containsNameEmailAppId = $"(contains(spd_firstname,'{safeValue}') or contains(spd_lastname,'{safeValue}') or contains(spd_emailaddress1,'{safeValue}') or contains(spd_name,'{safeValue}') or contains(spd_fullname,'{safeValue}'))";
        }

        //name appId 
        string? containsNameAppId = null;
        if (!string.IsNullOrWhiteSpace(appFilterBy.NameOrAppIdContains))
        {
            var safeValue = appFilterBy.NameOrAppIdContains.Replace("'", "''");
            containsNameAppId = $"(contains(spd_firstname,'{safeValue}') or contains(spd_lastname,'{safeValue}') or contains(spd_name,'{safeValue}') or contains(spd_fullname,'{safeValue}'))";
        }

        //paid
        string? paid = null;
        if (appFilterBy.Paid != null)
        {
            if ((bool)appFilterBy.Paid)
                paid = $"spd_paidon ne null";
            else
                paid = $"statuscode eq {100000000}"; //status reason equals "waiting for payment"
        }

        //payer type
        string? payer = null;
        if (appFilterBy.PayerType != null)
        {
            int payerValue = (int)Enum.Parse<PayerPreferenceOptionSet>(appFilterBy.PayerType.ToString());
            payer = $"spd_payer eq {payerValue}";
        }

        //submitted from date
        string? submitFromDate = null;
        if (appFilterBy.FromDateTime != null)
        {
            var date = new Microsoft.OData.Edm.Date(((DateTimeOffset)appFilterBy.FromDateTime).Year, ((DateTimeOffset)appFilterBy.FromDateTime).Month, ((DateTimeOffset)appFilterBy.FromDateTime).Day);
            submitFromDate = $"createdon ge {date}";
        }

        //submitted to date
        string? submitToDate = null;
        if (appFilterBy.ToDateTime != null)
        {
            DateTimeOffset adjustToDateTime = appFilterBy.ToDateTime.Value.AddDays(1);
            var date = new Microsoft.OData.Edm.Date(adjustToDateTime.Year, adjustToDateTime.Month, adjustToDateTime.Day);
            submitToDate = $"createdon lt {date}";
        }

        //delegate portal user
        string? delegateFilters = null;
        if (appFilterBy.DelegatePortalUserId != null)
        {
            delegateFilters = $"spd_delegateid eq '{appFilterBy.DelegatePortalUserId}'";
        }

        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.CRRP_EMPLOYEE.ToString(), out Guid crrpEmployeeServiceTypeId);
        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.CRRP_VOLUNTEER.ToString(), out Guid crrpVolunteerServiceTypeId);
        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.PSSO.ToString(), out Guid pssoServiceTypeId);
        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.PSSO_VS.ToString(), out Guid pssoVsServiceTypeId);
        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.MCFD.ToString(), out Guid mcfdServiceTypeId);
        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.PE_CRC.ToString(), out Guid pecrcServiceTypeId);
        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(ServiceTypeEnum.PE_CRC_VS.ToString(), out Guid pecrcvsServiceTypeId);
        string? serviceTypeFilters = $"_spd_servicetypeid_value eq '{crrpEmployeeServiceTypeId}' or _spd_servicetypeid_value eq '{crrpVolunteerServiceTypeId}' or _spd_servicetypeid_value eq '{pssoServiceTypeId}' or _spd_servicetypeid_value eq '{pssoVsServiceTypeId}' or _spd_servicetypeid_value eq '{mcfdServiceTypeId}' or _spd_servicetypeid_value eq '{pecrcServiceTypeId}' or _spd_servicetypeid_value eq '{pecrcvsServiceTypeId}'";

        //get result filter string
        string result = string.Empty;
        if (orgFilter != null)
        {
            result += $"{orgFilter}";
        }
        if (parentOrgFilter != null)
        {
            if (result == String.Empty) result += $"{parentOrgFilter}";
            else result += $" and {parentOrgFilter}";
        }
        if (portalStatusFilter != null)
        {
            result += $" and {portalStatusFilter}";
        }
        if (containsNameEmailAppId != null)
        {
            result += $" and {containsNameEmailAppId}";
        }
        if (containsNameAppId != null)
        {
            result += $" and {containsNameAppId}";
        }
        if (paid != null)
        {
            result += $" and {paid}";
        }
        if (payer != null)
        {
            result += $" and {payer}";
        }
        if (submitFromDate != null)
        {
            result += $" and {submitFromDate}";
        }
        if (submitToDate != null)
        {
            result += $" and {submitToDate}";
        }
        result += $" and ({serviceTypeFilters})";

        //dynamics did something special for delegateid, so, this has to be at the end of the query.
        if (delegateFilters != null)
        {
            result += $" and {delegateFilters}"; //when dynamics detect delegatId here, it will do filtering on their side.
        }

        return result;
    }

    private static string GetAppSortString(AppSortBy? appSortBy)
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

        if (appSortBy.PaidAndSubmittedOnDesc != null && (bool)appSortBy.PaidAndSubmittedOnDesc)
            return "spd_paidon, createdon desc";

        return "createdon desc";
    }

    //note: any change in this function, the operation number also needs to change in AddBulkAppsAsync
    private async Task<spd_application> CreateAppAsync(
        ApplicationCreateCmd createApplicationCmd,
        account org,
        spd_portaluser? user,
        team team,
        spd_servicetype? serviceType,
        account? parentOrg = null)
    {
        spd_application app = _mapper.Map<spd_application>(createApplicationCmd);

        _context.AddTospd_applications(app);
        _context.SetLink(app, nameof(spd_application.spd_OrganizationId), org);
        if (user != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_SubmittedBy), user);
        }
        _context.SetLink(app, nameof(spd_application.ownerid), team);
        if (serviceType != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ServiceTypeId), serviceType);
        }
        if (parentOrg != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ParentOrganizationId), parentOrg);
        }
        contact? contact;
        if (createApplicationCmd.CreatedByApplicantBcscId != null)//authenticated with 
        {
            contact = ProcessContactWithBcscApplicant(createApplicationCmd);
        }
        else
        {
            //no authentication
            contact = AddContact(createApplicationCmd);
        }
        // associate contact to application
        _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);

        //create the aliases
        foreach (var item in createApplicationCmd.Aliases)
        {
            AddAlias(item, contact);
        }

        return app;
    }

    private contact ProcessContactWithBcscApplicant(ApplicationCreateCmd createApplicationCmd)
    {
        var identity = _context.spd_identities
               .Expand(i => i.spd_ContactId)
               .Where(i => i.spd_userguid == createApplicationCmd.CreatedByApplicantBcscId)
               .Where(i => i.spd_type == (int)IdentityTypeOptionSet.BcServicesCard)
               .FirstOrDefault();
        if (identity == null)
        {
            identity = new spd_identity
            {
                spd_identityid = Guid.NewGuid(),
                spd_userguid = createApplicationCmd.CreatedByApplicantBcscId,
                spd_type = (int)IdentityTypeOptionSet.BcServicesCard
            };
            _context.AddTospd_identities(identity);
            var contact = AddContact(createApplicationCmd);
            _context.SetLink(identity, nameof(identity.spd_ContactId), contact);
            return contact;
        }
        else
        {
            if (identity.spd_ContactId != null) //existing identity already connected with a contact
            {
                //if the same name
                var existingContact = identity.spd_ContactId;
                if (!(string.Equals(existingContact.firstname, createApplicationCmd.GivenName, StringComparison.InvariantCultureIgnoreCase)
                    && string.Equals(existingContact.lastname, createApplicationCmd.Surname, StringComparison.InvariantCultureIgnoreCase)))
                {
                    //if the contact first name and lastname is different. make existing one to be alias and add the new one.
                    AliasCreateCmd newAlias = new()
                    {
                        Surname = existingContact.lastname,
                        GivenName = existingContact.firstname,
                    };
                    AddAlias(newAlias, existingContact);
                }
                _mapper.Map<ApplicationCreateCmd, contact>(createApplicationCmd, existingContact);
                _context.UpdateObject(existingContact);
                return existingContact;
            }
            else
            {
                var contact = AddContact(createApplicationCmd);
                _context.SetLink(identity, nameof(identity.spd_ContactId), contact);
                return contact;
            }
        }
    }

    private contact AddContact(ApplicationCreateCmd createApplicationCmd)
    {
        var contact = GetContact(createApplicationCmd);
        // if not found, create new contact
        if (contact == null)
        {
            contact = _mapper.Map<contact>(createApplicationCmd);
            contact.contactid = Guid.NewGuid();
            _context.AddTocontacts(contact);
        }
        else
        {
            //update existing one
            _mapper.Map<ApplicationCreateCmd, contact>(createApplicationCmd, contact);
            _context.UpdateObject(contact);
        }
        return contact;
    }

    private void AddAlias(AliasCreateCmd createAliasCmd, contact contact)
    {
        spd_alias? matchingAlias = GetAlias(createAliasCmd, contact);
        // if not found, create new alias
        if (matchingAlias == null)
        {
            spd_alias alias = _mapper.Map<spd_alias>(createAliasCmd);
            _context.AddTospd_aliases(alias);
            // associate alias to contact
            _context.SetLink(alias, nameof(alias.spd_ContactId), contact);
        }
    }
}

