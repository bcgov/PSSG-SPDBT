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
            app = PrepareNewAppDataInDbContext(cmd);
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
            PrepareUpdateAppDataInDbContext(cmd, cmd.ApplicantId);
        }
        else
        {
            //first time user create an application, beginning
            app = PrepareNewAppDataInDbContext(cmd);
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
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_application_spd_dogtrainingschool_ApplicationId)
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

    private spd_application PrepareNewAppDataInDbContext(GDSDApp appData)
    {
        var app = _mapper.Map<spd_application>(appData);
        if (appData.IsDogTrainedByAccreditedSchool.Value)
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

            if (appData.TrainingInfo.HasAttendedTrainingSchool.Value)
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

    private spd_application PrepareUpdateAppDataInDbContext(GDSDApp appData, Guid appId)
    {
        spd_application app = _context.spd_applications
            .Expand(a => a.spd_application_spd_dogtrainingschool_ApplicationId)
            .Where(a => a.spd_applicationid == appId)
            .FirstOrDefault();
        if (app == null)
            throw new ArgumentException("invalid app id");
        _mapper.Map<GDSDApp, spd_application>(appData, app);
        _context.UpdateObject(app);

        if (appData.IsDogTrainedByAccreditedSchool.Value)
        {
            //accredited school
            _mapper.Map<DogInfoNewAccreditedSchool, spd_application>(appData.DogInfoNewAccreditedSchool, app);
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.UpdateObject(app);

            //delete all non-accredited school
            foreach (var school in app.spd_application_spd_dogtrainingschool_ApplicationId)
            {
                if (school.spd_trainingschooltype == (int)DogTrainingSchoolTypeOptionSet.UnAccreditedSchool ||
                    school.spd_trainingschooltype == (int)DogTrainingSchoolTypeOptionSet.Other)
                {
                    _context.DeleteObject(school);
                }
            }

            //upsert graduation
            var existingGraduation = app.spd_application_spd_dogtrainingschool_ApplicationId.FirstOrDefault(s => s.spd_trainingschooltype == (int)DogTrainingSchoolTypeOptionSet.AccreditedSchool);
            if (existingGraduation == null)
            {
                spd_dogtrainingschool graduation = _mapper.Map<spd_dogtrainingschool>(appData.GraduationInfo);
                graduation.spd_trainingschooltype = (int)DogTrainingSchoolTypeOptionSet.AccreditedSchool;
                _context.AddTospd_dogtrainingschools(graduation);
                _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), graduation);
            }
            else
            {
                _mapper.Map<GraduationInfo, spd_dogtrainingschool>(appData.GraduationInfo, existingGraduation);
                _context.UpdateObject(existingGraduation);
            }
        }
        else
        {
            //non-accredited school
            _mapper.Map<DogInfoNewWithoutAccreditedSchool, spd_application>(appData.DogInfoNewWithoutAccreditedSchool, app);
            app.spd_dogsassistanceindailyliving = appData.TrainingInfo.SpecializedTasksWhenPerformed;
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.UpdateObject(app);

            //delete all school which is not in current payload
            foreach (var school in app.spd_application_spd_dogtrainingschool_ApplicationId)
            {
                if (!appData.TrainingInfo.SchoolTrainings.Any(s => s.TrainingId == school.spd_dogtrainingschoolid) &&
                    !appData.TrainingInfo.OtherTrainings.Any(s => s.TrainingId == school.spd_dogtrainingschoolid))
                {
                    _context.DeleteObject(school);
                }
            }

            if (appData.TrainingInfo.HasAttendedTrainingSchool.Value)
            {
                foreach (TrainingSchoolInfo schoolInfo in appData.TrainingInfo.SchoolTrainings)
                {
                    if (schoolInfo.TrainingId == null)
                    {
                        spd_dogtrainingschool school = _mapper.Map<spd_dogtrainingschool>(schoolInfo);
                        _context.AddTospd_dogtrainingschools(school);
                        _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), school);
                    }
                    else
                    {
                        var existingSchool = app.spd_application_spd_dogtrainingschool_ApplicationId.FirstOrDefault(s => s.spd_dogtrainingschoolid == schoolInfo.TrainingId);
                        _mapper.Map<TrainingSchoolInfo, spd_dogtrainingschool>(schoolInfo, existingSchool);
                        _context.UpdateObject(existingSchool);
                    }
                }
            }
            else
            {
                foreach (OtherTraining other in appData.TrainingInfo.OtherTrainings)
                {
                    if (other.TrainingId == null)
                    {
                        spd_dogtrainingschool school = _mapper.Map<spd_dogtrainingschool>(other);
                        _context.AddTospd_dogtrainingschools(school);
                        _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), school);
                    }
                    else
                    {
                        var existingSchool = app.spd_application_spd_dogtrainingschool_ApplicationId.FirstOrDefault(s => s.spd_dogtrainingschoolid == other.TrainingId);
                        _mapper.Map<OtherTraining, spd_dogtrainingschool>(other, existingSchool);
                        _context.UpdateObject(existingSchool);
                    }
                }
            }
        }
        SharedRepositoryFuncs.LinkServiceType(_context, appData.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        return app;
    }
}
