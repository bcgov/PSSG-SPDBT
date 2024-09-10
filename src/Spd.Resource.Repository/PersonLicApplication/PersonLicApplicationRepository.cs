using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.LicApp;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.PersonLicApplication;

internal class PersonLicApplicationRepository : IPersonLicApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public PersonLicApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    //for unauth, create contact and application
    public async Task<LicenceApplicationCmdResp> CreateLicenceApplicationAsync(CreateLicenceApplicationCmd cmd, CancellationToken ct)
    {
        spd_application app = _mapper.Map<spd_application>(cmd);
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
        _context.AddTospd_applications(app);
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        contact? contact = _mapper.Map<contact>(cmd);
        if (cmd.ApplicationTypeCode == ApplicationType.New)
        {
            if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
                SharedRepositoryFuncs.LinkLicence(_context, cmd.ExpiredLicenceId, app);
            //for new, always create a new contact
            contact = _context.CreateContact(contact, null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases));
        }
        else
        {
            if (cmd.OriginalApplicationId != null)
            {
                var originApp = await _context.spd_applications
                    .Where(a => a.spd_applicationid == cmd.OriginalApplicationId).SingleOrDefaultAsync(ct) ?? throw new InvalidOperationException($"application {cmd.OriginalApplicationId} not found");
                //for replace, renew, update, "contact" is already exists, so, do update.
                var existingContact = await _context.GetContactById(originApp._spd_applicantid_value!.Value, ct) ?? throw new InvalidOperationException($"contact {originApp.spd_applicationid} not found");
                contact = _context.UpdateContact(existingContact, contact, null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases));
            }
            else
            {
                throw new ArgumentException("for replace, renew or update, original application id cannot be null");
            }

            if (cmd.OriginalLicenceId != null)
            {
                SharedRepositoryFuncs.LinkLicence(_context, cmd.OriginalLicenceId, app);
            }
            else
            {
                throw new ArgumentException("for replace, renew or update, original licence id cannot be null");
            }
        }
        _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        await _context.SaveChangesAsync(ct);
        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        if (cmd.WorkerLicenceTypeCode == WorkerLicenceType.SecurityWorkerLicence)
        {
            SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        }
        await _context.SaveChangesAsync(ct);
        return new LicenceApplicationCmdResp(app.spd_applicationid!.Value, contact.contactid!.Value, null);
    }

    //for auth, do not need to create contact.
    public async Task<LicenceApplicationCmdResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(a => a.spd_applicationid == cmd.LicenceAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveLicenceApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
            var contact = _context.contacts.Where(l => l.contactid == cmd.ApplicantId).FirstOrDefault();
            if (contact != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            }
        }
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
            SharedRepositoryFuncs.LinkLicence(_context, cmd.ExpiredLicenceId, app);
        else
            _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        await _context.SaveChangesAsync(ct);
        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync(ct);
        return new LicenceApplicationCmdResp(app.spd_applicationid!.Value, cmd.ApplicantId, null);
    }

    public async Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        var app = await _context.spd_applications.Expand(a => a.spd_ServiceTypeId)
                        .Expand(a => a.spd_ApplicantId_contact)
                        .Expand(a => a.spd_application_spd_licencecategory)
                        .Expand(a => a.spd_CurrentExpiredLicenceId)
                        .Where(a => a.spd_applicationid == licenceApplicationId)
                        .SingleOrDefaultAsync(ct);
        if (app == null) throw new ArgumentException("invalid app id");

        LicenceApplicationResp appResp = _mapper.Map<LicenceApplicationResp>(app);

        if (app.spd_ApplicantId_contact?.contactid != null)
        {
            var aliases = SharedRepositoryFuncs.GetAliases((Guid)app.spd_ApplicantId_contact.contactid, _context);
            appResp.Aliases = _mapper.Map<AliasResp[]>(aliases);
            _mapper.Map<contact, LicenceApplicationResp>(app.spd_ApplicantId_contact, appResp);
        }

        return appResp;
    }

    public async Task<LicenceApplicationCmdResp> UpdateSwlSoleProprietorApplicationAsync(Guid swlAppId, Guid bizLicAppId, CancellationToken ct)
    {
        var swlApp = await _context.spd_applications
            .Where(a => a.spd_applicationid == swlAppId)
            .SingleOrDefaultAsync(ct);
        if (swlApp == null) throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find the swl application for {swlAppId}.");

        var bizLicApp = await _context.spd_applications.Where(a => a.spd_applicationid == bizLicAppId).SingleOrDefaultAsync(ct);
        if (bizLicApp == null) throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find the business application for {bizLicAppId}.");

        _context.SetLink(swlApp, nameof(swlApp.spd_BusinessLicenseId), bizLicApp);
        await _context.SaveChangesAsync(ct);
        return new LicenceApplicationCmdResp(swlApp.spd_applicationid!.Value, swlApp._spd_applicantid_value, swlApp._spd_organizationid_value);
    }
}