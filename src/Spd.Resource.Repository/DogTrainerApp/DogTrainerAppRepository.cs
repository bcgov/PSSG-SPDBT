using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Resource.Repository.DogBase;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.DogTrainerApp;
internal class DogTrainerAppRepository : DogAppBaseRepository, IDogTrainerAppRepository
{
    public DogTrainerAppRepository(IDynamicsContextFactory ctx, IMapper mapper) : base(ctx, mapper)
    { }

    public async Task<DogTrainerAppCmdResp> CreateDogTrainerAppAsync(CreateDogTrainerAppCmd cmd, CancellationToken ct)
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
            contact = UpdateContact(cmd, (Guid)cmd.ApplicantId);
            app = PrepareNewAppDataInDbContext(cmd, contact);
            if (contact != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            }
            SharedRepositoryFuncs.LinkLicence(_context, cmd.OriginalLicenceId, app);
        }
        await _context.SaveChangesAsync(ct);
        if (app == null || contact == null)
            throw new ApiException(HttpStatusCode.InternalServerError);
        return new DogTrainerAppCmdResp((Guid)app.spd_applicationid, contact.contactid.Value);
    }
    public async Task<DogTrainerAppResp> GetDogTrainerAppAsync(Guid appId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications
                .Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_application_spd_dogtrainingschool_ApplicationId)
                .Where(a => a.spd_applicationid == appId)
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
            throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find the application for application id = {appId} ");

        var response = _mapper.Map<DogTrainerAppResp>(app);
        _mapper.Map<spd_dogtrainingschool, DogTrainerAppResp>(app.spd_application_spd_dogtrainingschool_ApplicationId.FirstOrDefault(), response);
        return response;
    }

    private contact UpdateContact(DogTrainerApp appData, Guid applicantId)
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

    private spd_application PrepareNewAppDataInDbContext(CreateDogTrainerAppCmd appData, contact applicant)
    {
        var app = _mapper.Map<spd_application>(appData);
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
        _context.AddTospd_applications(app);
        if (appData.AccreditedSchoolId != Guid.Empty) //for allow the invalid data, we found in staging, when do replacement, some existing trainer licence does not have accredit school, which is not correct. but we have to deal with it.
        {
            spd_dogtrainingschool trainEvent = _mapper.Map<spd_dogtrainingschool>(appData);
            _context.AddTospd_dogtrainingschools(trainEvent);
            _context.AddLink(app, nameof(app.spd_application_spd_dogtrainingschool_ApplicationId), trainEvent);
            _context.SetLink(trainEvent, nameof(trainEvent.spd_ApplicantId), applicant);
            var school = _context.accounts.Where(a => a.accountid == appData.AccreditedSchoolId).FirstOrDefault();
            _context.SetLink(trainEvent, nameof(trainEvent.spd_OrganizationId), school);
            SharedRepositoryFuncs.LinkTrainingEventTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, trainEvent);
        }

        SharedRepositoryFuncs.LinkServiceType(_context, appData.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        return app;
    }
}
