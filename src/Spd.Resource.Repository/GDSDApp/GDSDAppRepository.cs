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
        spd_application? app = null;
        contact? contact = null;
        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        {
            contact = _mapper.Map<contact>(cmd);
            contact = await _context.CreateContact(contact, null, null, ct);
            app = PrepareGDSDAppDataInDbContext(cmd);
            _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);
        }
        await _context.SaveChangesAsync(ct);
        if (app == null || contact == null)
            throw new ApiException(HttpStatusCode.InternalServerError);
        return new GDSDAppCmdResp((Guid)app.spd_applicationid, contact.contactid.Value);
    }

    public async Task<GDSDAppCmdResp> SaveGDSDAppAsync(SaveGDSDAppCmd cmd, CancellationToken ct)
    {
        spd_application? app = null;
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Where(a => a.spd_applicationid == cmd.LicenceAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveGDSDAppCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
            _context.UpdateObject(app);
        }
        else
        {
            //first time user create an application, beginning
            app = PrepareGDSDAppDataInDbContext(cmd);
            var contact = _context.contacts.Where(l => l.contactid == cmd.ApplicantId).FirstOrDefault();
            if (contact != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            }
        }
        await _context.SaveChangesAsync();
        return new GDSDAppCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
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

    private spd_application PrepareGDSDAppDataInDbContext(GDSDApp appData)
    {
        var app = _mapper.Map<spd_application>(appData);
        if (appData.IsDogTrainedByAccreditedSchool)
        {
            //accredited school
            _mapper.Map<DogInfoNewAccreditedSchool, spd_application>(appData.DogInfoNewAccreditedSchool, app);
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.AddTospd_applications(app);
            spd_dogtrainingschool graduation = _mapper.Map<spd_dogtrainingschool>(appData.GraduationInfo);
            graduation.spd_trainingschooltype = (int)DogTrainingSchoolTypeOptionSet.AccreditedSchool;
            _context.AddTospd_dogtrainingschools(graduation);
            _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), graduation);
        }
        else
        {
            //non-accredited school
            _mapper.Map<DogInfoNewWithoutAccreditedSchool, spd_application>(appData.DogInfoNewWithoutAccreditedSchool, app);
            app.spd_dogsassistanceindailyliving = appData.TrainingInfo.SpecializedTasksWhenPerformed;
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.AddTospd_applications(app);

            if (appData.TrainingInfo.HasAttendedTrainingSchool)
            {
                foreach (TrainingSchoolInfo schoolInfo in appData.TrainingInfo.SchoolTrainings)
                {
                    spd_dogtrainingschool school = _mapper.Map<spd_dogtrainingschool>(schoolInfo);
                    _context.AddTospd_dogtrainingschools(school);
                    _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), school);
                }
            }
            else
            {
                foreach (OtherTraining other in appData.TrainingInfo.OtherTrainings)
                {
                    spd_dogtrainingschool otherTraining = _mapper.Map<spd_dogtrainingschool>(other);
                    _context.AddTospd_dogtrainingschools(otherTraining);
                    _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), otherTraining);
                }
            }
        }
        SharedRepositoryFuncs.LinkServiceType(_context, appData.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        return app;
    }
}
