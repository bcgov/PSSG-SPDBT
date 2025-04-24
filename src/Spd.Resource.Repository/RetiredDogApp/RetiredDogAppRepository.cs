using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Resource.Repository.DogBase;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.RetiredDogApp;
internal class RetiredDogAppRepository : DogAppBaseRepository, IRetiredDogAppRepository
{
    public RetiredDogAppRepository(IDynamicsContextFactory ctx, IMapper mapper) : base(ctx, mapper)
    {
    }

    public async Task<RetiredDogAppCmdResp> CreateRetiredDogAppAsync(CreateRetiredDogAppCmd cmd, CancellationToken ct)
    {
        spd_application? app = null;
        contact? contact = null;
        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        {
            contact = _mapper.Map<contact>(cmd);
            contact = await _context.CreateContact(contact, null, null, ct);
            app = _mapper.Map<spd_application>(cmd);
            app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
            _context.AddTospd_applications(app);
            SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
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
        return new RetiredDogAppCmdResp((Guid)app.spd_applicationid, contact.contactid.Value);
    }

    public async Task<RetiredDogAppCmdResp> SaveRetiredDogAppAsync(SaveRetiredDogAppCmd cmd, CancellationToken ct)
    {
        spd_application? app = null;
        if (cmd.LicenceAppId != null)
        {
            contact applicant = UpdateContact(cmd, cmd.ApplicantId);
            await _context.SaveChangesAsync(ct);

            app = _context.spd_applications
                .Where(a => a.spd_applicationid == cmd.LicenceAppId)
                .FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveRetiredDogAppCmd, spd_application>(cmd, app);
            _context.UpdateObject(app);
            SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
            await _context.SaveChangesAsync(ct);
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
            await _context.SaveChangesAsync(ct);
        }

        if (app == null)
            throw new ApiException(HttpStatusCode.InternalServerError);

        return new RetiredDogAppCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
    }

    public async Task<RetiredDogAppResp> GetRetiredDogAppAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications
                .Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_contact)
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

        var response = _mapper.Map<RetiredDogAppResp>(app);
        return response;
    }

    private spd_application PrepareNewAppDataInDbContext(SaveRetiredDogAppCmd appData, contact applicant)
    {
        var app = _mapper.Map<spd_application>(appData);
        app.spd_applicationid = Guid.NewGuid();
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
        _context.AddTospd_applications(app);
        SharedRepositoryFuncs.LinkServiceType(_context, appData.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        return app;
    }

    private contact UpdateContact(RetiredDogApp appData, Guid applicantId)
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

    private spd_application PrepareUpdateAppDataInDbContext(SaveRetiredDogAppCmd appData, Guid appId, contact applicant)
    {
        spd_application? app = _context.spd_applications
            .Where(a => a.spd_applicationid == appId)
            .FirstOrDefault();
        if (app == null)
            throw new ArgumentException("invalid app id");
        _mapper.Map<SaveRetiredDogAppCmd, spd_application>(appData, app);
        _context.UpdateObject(app);

        return app;
    }

}
