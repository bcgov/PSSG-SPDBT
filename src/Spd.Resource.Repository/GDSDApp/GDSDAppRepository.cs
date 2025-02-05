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
            if (cmd.IsDogTrainedByAccreditedSchool)
            {
                //accredited school
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
                //non-accredited school
                _mapper.Map<DogInfoNewWithoutAccreditedSchool, spd_application>(cmd.DogInfoNewWithoutAccreditedSchool, app);
                app.spd_dogsassistanceindailyliving = cmd.TrainingInfo.SpecializedTasksWhenPerformed;
                app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
                _context.AddTospd_applications(app);

                if (cmd.TrainingInfo.HasAttendedTrainingSchool)
                {
                    foreach (TrainingSchoolInfo schoolInfo in cmd.TrainingInfo.SchoolTrainings)
                    {
                        spd_dogtrainingschool school = _mapper.Map<spd_dogtrainingschool>(schoolInfo);
                        _context.AddTospd_dogtrainingschools(school);
                        _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), school);
                    }
                }
                else
                {
                    foreach (OtherTraining other in cmd.TrainingInfo.OtherTrainings)
                    {
                        spd_dogtrainingschool otherTraining = _mapper.Map<spd_dogtrainingschool>(other);
                        _context.AddTospd_dogtrainingschools(otherTraining);
                        _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), otherTraining);
                    }
                }
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
        throw new NotImplementedException();
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
