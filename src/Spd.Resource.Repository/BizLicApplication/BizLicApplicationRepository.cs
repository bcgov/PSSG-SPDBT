using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.BizLicApplication;
internal class BizLicApplicationRepository : IBizLicApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public BizLicApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<BizLicApplicationCmdResp> CreateBizLicApplicationAsync(CreateBizLicApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? originalApp;
        Guid applicantId;
        spd_application app = _mapper.Map<spd_application>(cmd);
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
        _context.AddTospd_applications(app);

        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
            throw new ArgumentException("New application type is not supported for business licence");
        else
        {
            if (cmd.OriginalApplicationId != null)
            {
                try
                {
                    originalApp = await _context.spd_applications
                        .Expand(a => a.spd_ApplicantId_account)
                        .Where(a => a.spd_applicationid == cmd.OriginalApplicationId)
                        .FirstOrDefaultAsync(ct);
                }
                catch (DataServiceQueryException ex)
                {
                    if (ex.Response.StatusCode == 404)
                        throw new ArgumentException("Original business licence application was not found.");
                    else
                        throw;
                }

                if (originalApp?.spd_ApplicantId_account?.accountid == null)
                    throw new ArgumentException("There is no account linked to the application found.");
                else
                    applicantId = (Guid)originalApp.spd_ApplicantId_account.accountid;
            }
            else
            {
                throw new ArgumentException("For replace, renew or update, original application id cannot be null.");
            }

            if (cmd.OriginalLicenceId != null)
            {
                SharedRepositoryFuncs.LinkLicence(_context, cmd.OriginalLicenceId, app);
            }
            else
            {
                throw new ArgumentException("For replace, renew or update, original licence id cannot be null.");
            }
        }

        await SetAddresses(applicantId, app, ct);
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        LinkOrganization(applicantId, app);

        if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator))
            LinkPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app);
        else
            DeletePrivateInvestigatorLink(cmd.PrivateInvestigatorSwlInfo, app);

        await _context.SaveChangesAsync(ct);

        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync(ct);
        return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, applicantId);
    }

    public async Task<BizLicApplicationCmdResp> SaveBizLicApplicationAsync(SaveBizLicApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Expand(a => a.spd_application_spd_licence_manager)
                .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.spd_applicationid == cmd.LicenceAppId)
                .FirstOrDefault();
            if (app == null)
                throw new ArgumentException("Application Id was not found.");
            _mapper.Map<SaveBizLicApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
        }
        await SetAddresses(cmd.ApplicantId, app, ct);
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
            SharedRepositoryFuncs.LinkExpiredLicence(_context, cmd.ExpiredLicenceId, app);
        else
            _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);
        
        LinkOrganization(cmd.ApplicantId, app);

        if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator))
            LinkPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app);
        else
            DeletePrivateInvestigatorLink(cmd.PrivateInvestigatorSwlInfo, app);

        await _context.SaveChangesAsync(ct);

        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync(ct);
        return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
    }

    public async Task<BizLicApplicationResp> GetBizLicApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications
                .Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_account)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_application_spd_licencecategory)
                .Expand(a => a.spd_application_spd_licence_manager)
                .Expand(a => a.spd_CurrentExpiredLicenceId)
                .Where(a => a.spd_applicationid == licenceApplicationId)
                .FirstOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                app = null;
            else
                throw;
        }

        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find the application for application id = {licenceApplicationId} ");

        return _mapper.Map<BizLicApplicationResp>(app);
    }

    private void LinkOrganization(Guid? accountId, spd_application app)
    {
        if (accountId == null) return;
        var account = _context.accounts
            .Where(a => a.accountid == accountId)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();
        if (account != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ApplicantId_account), account);
        }
    }

    private void LinkPrivateInvestigator(SwlContactInfo privateInvestigatorInfo, spd_application app)
    {
        if (privateInvestigatorInfo.LicenceId == null)
            return;

        // Related licence already linked
        if (app.spd_application_spd_licence_manager.Any(l => l.spd_licenceid == privateInvestigatorInfo.LicenceId))
            return;

        spd_licence? licence = _context.spd_licences
            .Where(l => l.spd_licenceid == privateInvestigatorInfo.LicenceId)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();

        if (licence == null)
            throw new ArgumentException("investigator licence info not found");

        _context.AddLink(app, nameof(spd_application.spd_application_spd_licence_manager), licence);
    }

    private void DeletePrivateInvestigatorLink(SwlContactInfo privateInvestigatorInfo, spd_application app)
    {
        if (privateInvestigatorInfo.LicenceId == null)
            return;

        // Related licence is not linked
        if (!app.spd_application_spd_licence_manager.Any(l => l.spd_licenceid == privateInvestigatorInfo.LicenceId))
            return;

        spd_licence? licence = _context.spd_licences
            .Where(l => l.spd_licenceid == privateInvestigatorInfo.LicenceId)
            .FirstOrDefault();

        if (licence == null)
            return;

        _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licence_manager), licence);
    }

    private async Task SetAddresses(Guid accountId, spd_application app, CancellationToken ct)
    {
        IQueryable<account> accounts = _context.accounts
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == accountId);

        account? biz = await accounts.FirstOrDefaultAsync(ct);

        if (biz == null) throw new ApiException(HttpStatusCode.NotFound);

        app.spd_addressline1 = biz.address1_line1;
        app.spd_addressline2 = biz.address1_line2;
        app.spd_city = biz.address1_city;
        app.spd_province = biz.address1_stateorprovince;
        app.spd_country = biz.address1_country;
        app.spd_postalcode = biz.address1_postalcode;
        app.spd_residentialaddress1 = biz.address2_line1;
        app.spd_residentialaddress2 = biz.address2_line2;
        app.spd_residentialcity = biz.address2_city;
        app.spd_residentialprovince = biz.address2_stateorprovince;
        app.spd_residentialcountry = biz.address2_country;
        app.spd_residentialpostalcode = biz.address2_postalcode;

        _context.UpdateObject(app);
    }
}
