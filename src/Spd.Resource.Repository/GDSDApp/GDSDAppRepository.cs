﻿using AutoMapper;
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
            app = PrepareNewAppDataInDbContext(cmd, contact);
            _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);
        }
        else if (cmd.ApplicationTypeCode == ApplicationTypeEnum.Renewal || cmd.ApplicationTypeCode == ApplicationTypeEnum.Replacement)
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
            contact = UpdateContact(cmd, (Guid)cmd.ApplicantId);
            if (contact != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            }
            SharedRepositoryFuncs.LinkLicence(_context, cmd.OriginalLicenceId, app);
            SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
            SharedRepositoryFuncs.LinkDog(_context, cmd.DogId, app);
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
            contact applicant = UpdateContact(cmd, cmd.ApplicantId);
            app = PrepareUpdateAppDataInDbContext(cmd, cmd.LicenceAppId.Value, applicant);
        }
        else
        {
            //first time user create an application, beginning
            var contact = UpdateContact(cmd, cmd.ApplicantId);
            app = PrepareNewAppDataInDbContext(cmd, contact);

            if (contact != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            }
        }
        if (app == null)
            throw new ApiException(HttpStatusCode.InternalServerError);
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

    private spd_application PrepareNewAppDataInDbContext(GDSDApp appData, contact applicant)
    {
        var app = _mapper.Map<spd_application>(appData);
        if (appData.IsDogTrainedByAccreditedSchool.HasValue && appData.IsDogTrainedByAccreditedSchool.Value)
        {
            //accredited school
            _mapper.Map<AccreditedSchoolQuestions, spd_application>(appData.AccreditedSchoolQuestions, app);
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.AddTospd_applications(app);
            spd_dogtrainingschool graduation = _mapper.Map<spd_dogtrainingschool>(appData.AccreditedSchoolQuestions?.GraduationInfo);
            graduation.spd_trainingschooltype = (int)DogTrainingSchoolTypeOptionSet.AccreditedSchool;
            _context.AddTospd_dogtrainingschools(graduation);
            _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), graduation);
            _context.SetLink(graduation, nameof(graduation.spd_ApplicantId), applicant);
        }
        else
        {
            //non-accredited school
            _mapper.Map<NonAccreditedSchoolQuestions, spd_application>(appData.NonAccreditedSchoolQuestions, app);
            app.spd_dogsassistanceindailyliving = appData.NonAccreditedSchoolQuestions?.TrainingInfo?.SpecializedTasksWhenPerformed;
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.AddTospd_applications(app);

            if (appData.NonAccreditedSchoolQuestions?.TrainingInfo?.HasAttendedTrainingSchool != null && appData.NonAccreditedSchoolQuestions.TrainingInfo.HasAttendedTrainingSchool.Value)
            {
                if (appData.NonAccreditedSchoolQuestions.TrainingInfo.SchoolTrainings != null)
                {
                    foreach (TrainingSchoolInfo schoolInfo in appData.NonAccreditedSchoolQuestions.TrainingInfo.SchoolTrainings)
                    {
                        spd_dogtrainingschool school = _mapper.Map<spd_dogtrainingschool>(schoolInfo);
                        _context.AddTospd_dogtrainingschools(school);
                        _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), school);
                        _context.SetLink(school, nameof(school.spd_ApplicantId), applicant);
                    }
                }
            }
            else
            {
                if (appData.NonAccreditedSchoolQuestions?.TrainingInfo?.OtherTrainings != null)
                {
                    foreach (OtherTraining other in appData.NonAccreditedSchoolQuestions.TrainingInfo?.OtherTrainings)
                    {
                        spd_dogtrainingschool otherTraining = _mapper.Map<spd_dogtrainingschool>(other);
                        _context.AddTospd_dogtrainingschools(otherTraining);
                        _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), otherTraining);
                        _context.SetLink(otherTraining, nameof(otherTraining.spd_ApplicantId), applicant);
                    }
                }
            }
        }
        SharedRepositoryFuncs.LinkServiceType(_context, appData.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        return app;
    }

    private contact UpdateContact(GDSDApp appData, Guid applicantId)
    {
        contact? applicant = _context.contacts.FirstOrDefault(c => c.contactid == applicantId);
        if (applicant == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot find the applicant");
        }
        _mapper.Map(appData, applicant);
        _context.UpdateObject(applicant);
        return applicant;
    }

    private spd_application PrepareUpdateAppDataInDbContext(GDSDApp appData, Guid appId, contact applicant)
    {
        spd_application? app = _context.spd_applications
            .Expand(a => a.spd_application_spd_dogtrainingschool_ApplicationId)
            .Where(a => a.spd_applicationid == appId)
            .FirstOrDefault();
        if (app == null)
            throw new ArgumentException("invalid app id");
        _mapper.Map<GDSDApp, spd_application>(appData, app);
        _context.UpdateObject(app);

        if (appData.IsDogTrainedByAccreditedSchool.HasValue && appData.IsDogTrainedByAccreditedSchool.Value)
        {
            //accredited school
            _mapper.Map<AccreditedSchoolQuestions, spd_application>(appData.AccreditedSchoolQuestions, app);
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
                spd_dogtrainingschool graduation = _mapper.Map<spd_dogtrainingschool>(appData.AccreditedSchoolQuestions.GraduationInfo);
                graduation.spd_trainingschooltype = (int)DogTrainingSchoolTypeOptionSet.AccreditedSchool;
                _context.AddTospd_dogtrainingschools(graduation);
                _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), graduation);
                _context.SetLink(graduation, nameof(graduation.spd_ApplicantId), applicant);
            }
            else
            {
                _mapper.Map<GraduationInfo, spd_dogtrainingschool>(appData.AccreditedSchoolQuestions.GraduationInfo, existingGraduation);
                _context.UpdateObject(existingGraduation);
            }
        }
        else
        {
            //non-accredited school
            _mapper.Map<NonAccreditedSchoolQuestions, spd_application>(appData.NonAccreditedSchoolQuestions, app);
            app.spd_dogsassistanceindailyliving = appData.NonAccreditedSchoolQuestions.TrainingInfo?.SpecializedTasksWhenPerformed;
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.UpdateObject(app);

            //delete all school which is not in current payload
            foreach (var school in app.spd_application_spd_dogtrainingschool_ApplicationId)
            {
                IEnumerable<TrainingSchoolInfo>? schools = appData.NonAccreditedSchoolQuestions?.TrainingInfo?.SchoolTrainings;
                IEnumerable<OtherTraining>? others = appData.NonAccreditedSchoolQuestions?.TrainingInfo?.OtherTrainings;
                if (((schools != null && !schools.Any(s => s.TrainingId == school.spd_dogtrainingschoolid)) || schools == null) &&
                    ((others != null && !others.Any(s => s.TrainingId == school.spd_dogtrainingschoolid)) || others == null))
                {
                    _context.DeleteObject(school);
                }
            }

            if (appData.NonAccreditedSchoolQuestions.TrainingInfo != null && appData.NonAccreditedSchoolQuestions.TrainingInfo.HasAttendedTrainingSchool.Value)
            {
                if (appData.NonAccreditedSchoolQuestions.TrainingInfo?.SchoolTrainings != null)
                {
                    foreach (TrainingSchoolInfo schoolInfo in appData.NonAccreditedSchoolQuestions.TrainingInfo.SchoolTrainings)
                    {
                        if (schoolInfo.TrainingId == null)
                        {
                            spd_dogtrainingschool school = _mapper.Map<spd_dogtrainingschool>(schoolInfo);
                            _context.AddTospd_dogtrainingschools(school);
                            _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), school);
                            _context.SetLink(school, nameof(school.spd_ApplicantId), applicant);
                        }
                        else
                        {
                            var existingSchool = app.spd_application_spd_dogtrainingschool_ApplicationId.FirstOrDefault(s => s.spd_dogtrainingschoolid == schoolInfo.TrainingId);
                            _mapper.Map<TrainingSchoolInfo, spd_dogtrainingschool>(schoolInfo, existingSchool);
                            _context.UpdateObject(existingSchool);
                        }
                    }
                }
            }
            else
            {
                if (appData.NonAccreditedSchoolQuestions?.TrainingInfo?.OtherTrainings != null)
                {
                    foreach (OtherTraining other in appData.NonAccreditedSchoolQuestions.TrainingInfo.OtherTrainings)
                    {
                        if (other.TrainingId == null)
                        {
                            spd_dogtrainingschool school = _mapper.Map<spd_dogtrainingschool>(other);
                            _context.AddTospd_dogtrainingschools(school);
                            _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), school);
                            _context.SetLink(school, nameof(school.spd_ApplicantId), applicant);
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
        }
        SharedRepositoryFuncs.LinkServiceType(_context, appData.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        return app;
    }
}
