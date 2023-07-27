using Microsoft.Dynamics.CRM;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ResourceContracts;
using System.Net;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken ct)
    {
        //create application
        spd_application? application = null;
        account? org = await _context.GetOrgById(createApplicationCmd.OrgId, ct);
        spd_portaluser? user = null;
        if (createApplicationCmd.CreatedByUserId != Guid.Empty)
        {
            user = await _context.GetUserById(createApplicationCmd.CreatedByUserId, ct);
        }
        Guid teamGuid = Guid.Parse(DynamicsConstants.Client_Service_Team_Guid);
        team? serviceTeam = await _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefaultAsync(ct);
        spd_servicetype? servicetype = _context.LookupServiceType(createApplicationCmd.ServiceType.ToString());
        if (org != null && serviceTeam != null)
            application = await CreateAppAsync(createApplicationCmd, org, user, serviceTeam, servicetype);
        await _context.SaveChangesAsync(ct);

        return application?.spd_applicationid;
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

    public async Task IdentityAsync(IdentityCmd identityCmd, CancellationToken cancellationToken)
    {
        spd_application? app = await _context.GetApplicationById(identityCmd.ApplicationId, cancellationToken);
        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid ApplicationId");


        account? org = await _context.GetOrgById(identityCmd.OrgId, cancellationToken);

        if (identityCmd.Status == IdentityStatusCode.Verified)
        {
            var paid = app.statecode == DynamicsConstants.StateCode_Inactive ? true : false;
            if (!paid)
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

    public async Task<ApplicantApplicationListResp> QueryApplicantApplicationListAsync(ApplicantApplicationListQry query, CancellationToken cancellationToken)
    {
        var applications = _context.spd_applications
            .Expand(i => i.spd_OrganizationId)
            .Where(r => r._spd_applicantid_value == query.ApplicantId)
            .OrderByDescending(i => i.createdon);

        var result = applications.ToList();
        var response = new ApplicantApplicationListResp();
        response.Applications = _mapper.Map<IEnumerable<ApplicationResult>>(result);
        return response;
    }

    public async Task<ApplicationResult> QueryApplicationAsync(ApplicationQry query, CancellationToken cancellationToken)
    {
        var application = _context.spd_applications
            .Expand(i => i.spd_OrganizationId)
            .Where(r => r.spd_applicationid == query.ApplicationId)
            .FirstOrDefault();
        return _mapper.Map<ApplicationResult>(application);
    }

    public async Task ProcessAppWithSharableClearanceAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken ct)
    {
        if (!createApplicationCmd.SharedClearanceId.HasValue)
            throw new ArgumentException("SharedClearanceId cannot be null");
        account? org = await _context.GetOrgById(createApplicationCmd.OrgId, ct);
        spd_clearance clearance = await _context.GetClearanceById((Guid)createApplicationCmd.SharedClearanceId, ct);
        contact contact = await _context.contacts.Where(c => c.contactid == createApplicationCmd.ContactId).FirstOrDefaultAsync(ct);
        _mapper.Map<ApplicationCreateCmd, contact>(createApplicationCmd, contact);
        _context.UpdateObject(contact);

        spd_clearanceaccess clearanceaccess = new spd_clearanceaccess() { spd_clearanceaccessid = Guid.NewGuid() };
        _context.AddTospd_clearanceaccesses(clearanceaccess);
        _context.SetLink(clearanceaccess, nameof(clearanceaccess.spd_OrganizationId), org);
        _context.SetLink(clearanceaccess, nameof(clearanceaccess.spd_ClearanceId), clearance);
        await _context.SaveChangesAsync(ct);
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

    private string GetAppFilterString(AppFilterBy appFilterBy)
    {
        //orgfilter
        string orgFilter = $"_spd_organizationid_value eq {appFilterBy.OrgId}";

        //portal status filter
        string? portalStatusFilter = null;
        if (appFilterBy.ApplicationPortalStatus != null && appFilterBy.ApplicationPortalStatus.Any())
        {
            List<string> strs = new List<string>();
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
            containsNameEmailAppId = $"(contains(spd_firstname,'{appFilterBy.NameOrEmailOrAppIdContains}') or contains(spd_lastname,'{appFilterBy.NameOrEmailOrAppIdContains}') or contains(spd_emailaddress1,'{appFilterBy.NameOrEmailOrAppIdContains}') or contains(spd_name,'{appFilterBy.NameOrEmailOrAppIdContains}'))";
        }

        //name appId 
        string? containsNameAppId = null;
        if (!string.IsNullOrWhiteSpace(appFilterBy.NameOrAppIdContains))
        {
            containsNameAppId = $"(contains(spd_firstname,'{appFilterBy.NameOrAppIdContains}') or contains(spd_lastname,'{appFilterBy.NameOrAppIdContains}') or contains(spd_name,'{appFilterBy.NameOrAppIdContains}'))";
        }

        //paid
        string? paid = null;
        if (appFilterBy.Paid != null)
        {
            if ((bool)appFilterBy.Paid)
                paid = $"spd_paidon ne null";
            else
                paid = $"spd_paidon eq null";
        }

        //payer type
        string? payer = null;
        if (appFilterBy.PayerType != null)
        {
            int payerValue = (int)Enum.Parse<PayerPreferenceOptionSet>(appFilterBy.PayerType.ToString());
            payer = $"spd_payer eq {payerValue}";
        }

        //submitted from date
        string submitFromDate = null;
        if (appFilterBy.FromDateTime != null)
        {
            var date = new Microsoft.OData.Edm.Date(((DateTimeOffset)appFilterBy.FromDateTime).Year, ((DateTimeOffset)appFilterBy.FromDateTime).Month, ((DateTimeOffset)appFilterBy.FromDateTime).Day);
            submitFromDate = $"createdon ge {date}";
        }

        //submitted to date
        string submitToDate = null;
        if (appFilterBy.ToDateTime != null)
        {
            var date = new Microsoft.OData.Edm.Date(((DateTimeOffset)appFilterBy.ToDateTime).Year, ((DateTimeOffset)appFilterBy.ToDateTime).Month, ((DateTimeOffset)appFilterBy.ToDateTime).AddDays(1).Day);
            submitToDate = $"createdon lt {date}";
        }

        //get result filter string
        string result = $"{orgFilter}";
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
        spd_servicetype? serviceType)
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
                if (string.Equals(existingContact.firstname, createApplicationCmd.GivenName, StringComparison.InvariantCultureIgnoreCase)
                    && string.Equals(existingContact.lastname, createApplicationCmd.Surname, StringComparison.InvariantCultureIgnoreCase))
                    return existingContact;

                //if the contact first name and lastname is different. make existing one to be alias and add the new one.
                AliasCreateCmd newAlias = new AliasCreateCmd
                {
                    Surname = existingContact.lastname,
                    GivenName = existingContact.firstname,
                };
                AddAlias(newAlias, existingContact);
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


