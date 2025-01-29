using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.GDSDApp;
internal class GDSDAppRepository : IGDSDAppRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public GDSDAppRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<GDSDAppCmdResp> CreateGDSDAppAsync(CreateGDSDAppCmd cmd, CancellationToken ct)
    {
        //spd_application? originalApp;
        //Guid applicantId;
        //var app = _mapper.Map<spd_application>(cmd);
        //app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;

        //if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        //    throw new ArgumentException("New application type is not supported for business licence.");

        //if (cmd.OriginalApplicationId == null)
        //    throw new ArgumentException("For replace, renew or update, original licence id cannot be null.");

        //try
        //{
        //    originalApp = await _context.spd_applications
        //        .Expand(a => a.spd_ApplicantId_account)
        //        .Where(a => a.spd_applicationid == cmd.OriginalApplicationId)
        //        .FirstOrDefaultAsync(ct);

        //    if (originalApp == null)
        //        throw new ArgumentException("Original business licence application was not found.");
        //}
        //catch (DataServiceQueryException ex)
        //{
        //    if (ex.Response.StatusCode == 404)
        //        throw new ArgumentException("Original business licence application was not found.");
        //    throw;
        //}

        //app.spd_businesstype = originalApp.spd_businesstype;
        //_context.AddTospd_applications(app);

        //if (originalApp?.spd_ApplicantId_account?.accountid == null)
        //    throw new ArgumentException("There is no account linked to the application found.");

        //SharedRepositoryFuncs.LinkLicence(_context, cmd.OriginalLicenceId, app);

        //applicantId = (Guid)originalApp.spd_ApplicantId_account.accountid;
        //var biz = await _context.GetOrgById(applicantId, ct);
        //if (biz == null || biz.statecode != DynamicsConstants.StateCode_Active) throw new ApiException(HttpStatusCode.NotFound);

        //await SetInfoFromBiz(biz, app, cmd.ApplicantIsBizManager ?? false, ct);
        //await SetOwner(app, Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid), ct);
        //await SetApplicantSwlLicenceId(app, cmd.ApplicantSwlLicenceId, ct);
        //SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
        //SharedRepositoryFuncs.LinkSubmittedByPortalUser(_context, cmd.SubmittedByPortalUserId, app);

        //if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator) && cmd.PrivateInvestigatorSwlInfo != null)
        //{
        //    var businessContact = await UpsertPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app, ct);
        //    _context.SetLink(businessContact, nameof(spd_businesscontact.spd_OrganizationId), biz);
        //}
        //else
        //    DeletePrivateInvestigatorLink(app);

        ////Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        ////then update category.
        //SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        //await _context.SaveChangesAsync(ct);
        //return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, applicantId);
        return null;
    }

    public async Task<GDSDAppCmdResp> SaveGDSDAppAsync(SaveGDSDAppCmd cmd, CancellationToken ct)
    {
        //spd_application? app;
        //if (cmd.LicenceAppId != null)
        //{
        //    app = _context.spd_applications
        //        .Expand(a => a.spd_application_spd_licencecategory)
        //        .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
        //        .Where(a => a.spd_applicationid == cmd.LicenceAppId)
        //        .FirstOrDefault();
        //    if (app == null)
        //        throw new ArgumentException("Application Id was not found.");
        //    _mapper.Map(cmd, app);
        //    app.spd_applicationid = (Guid)cmd.LicenceAppId;
        //    _context.UpdateObject(app);
        //}
        //else
        //{
        //    app = _mapper.Map<spd_application>(cmd);
        //    _context.AddTospd_applications(app);
        //}
        //// Save changes done to the application, given that these are lost further down the logic (method "DeletePrivateInvestigatorLink")
        //// when the business contact table is joined with application
        //await _context.SaveChangesAsync(ct);

        //var biz = await _context.GetOrgById(cmd.ApplicantId, ct);
        //if (biz == null || biz.statecode != DynamicsConstants.StateCode_Active) throw new ApiException(HttpStatusCode.NotFound);

        //await SetInfoFromBiz(biz, app, cmd.ApplicantIsBizManager ?? false, ct);
        //await SetOwner(app, Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid), ct);
        //SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
        //if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
        //    SharedRepositoryFuncs.LinkLicence(_context, cmd.ExpiredLicenceId, app);
        //else
        //    _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        //await SetApplicantSwlLicenceId(app, cmd.ApplicantSwlLicenceId, ct);

        //SharedRepositoryFuncs.LinkSubmittedByPortalUser(_context, cmd.SubmittedByPortalUserId, app);

        //if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator) &&
        //    cmd.PrivateInvestigatorSwlInfo?.ContactId != null &&
        //    cmd.PrivateInvestigatorSwlInfo?.LicenceId != null)
        //{
        //    var businessContact = await UpsertPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app, ct);
        //    _context.SetLink(businessContact, nameof(spd_businesscontact.spd_OrganizationId), biz);
        //}
        //else
        //    DeletePrivateInvestigatorLink(app);

        //await _context.SaveChangesAsync(ct);

        ////Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        ////then update category.
        //SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        //await _context.SaveChangesAsync(ct);
        //return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
        return null;
    }

    public async Task<GDSDAppResp> GetGDSDAppAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications
                .Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_account)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_application_spd_licencecategory)
                .Expand(a => a.spd_CurrentExpiredLicenceId)
                .Expand(a => a.spd_businesscontact_spd_application)
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
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

        var response = _mapper.Map<GDSDAppResp>(app);
        return response;
    }


}
