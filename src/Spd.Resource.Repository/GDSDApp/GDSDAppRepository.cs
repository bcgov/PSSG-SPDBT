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

        var app = _mapper.Map<spd_application>(cmd);
        //process contact
        contact? contact = _mapper.Map<contact>(cmd);
        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        {
            contact = await _context.CreateContact(contact, null, null, ct);
            //process graduation info
            if (cmd.IsDogTrainedByAccreditedSchool)
            {
                _mapper.Map<DogInfoNewAccreditedSchool, spd_application>(cmd.DogInfoNewAccreditedSchool, app);
                app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
                _context.AddTospd_applications(app);
                spd_dogtrainingschool graduation = _mapper.Map<spd_dogtrainingschool>(cmd.GraduationInfo);
                graduation.spd_trainingschooltype = (int)DogTrainingSchoolTypeOptionSet.AccreditedSchool;
                _context.AddTospd_dogtrainingschools(graduation);
                _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), graduation);
            }
            else
            {
                _mapper.Map<DogInfoNewWithoutAccreditedSchool, spd_application>(cmd.DogInfoNewWithoutAccreditedSchool, app);
                app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
                _context.AddTospd_applications(app);
                //todo:
                //spd_dogtrainingschool graduation = _mapper.Map<spd_dogtrainingschool>(cmd.TrainingInfo);
            }
            SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
            _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);
        }

        await _context.SaveChangesAsync(ct);
        return new GDSDAppCmdResp((Guid)app.spd_applicationid, contact.contactid.Value);
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

    public async Task CommitGDSDAppAsync(CommitGDSDAppCmd cmd, CancellationToken ct)
    {
        spd_application? app = await _context.GetApplicationById(cmd.LicenceAppId, ct);
        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid ApplicationId");

        app.statuscode = (int)Enum.Parse<ApplicationStatusOptionSet>(cmd.ApplicationStatusCode.ToString());

        if (cmd.ApplicationStatusCode == ApplicationStatusEnum.Submitted)
        {
            app.statecode = DynamicsConstants.StateCode_Inactive;

            app.spd_submittedon = DateTimeOffset.Now;
            app.spd_portalmodifiedon = DateTimeOffset.Now;
            app.spd_licencefee = 0;

            _context.UpdateObject(app);
            await _context.SaveChangesAsync(ct);
        }
    }
}
