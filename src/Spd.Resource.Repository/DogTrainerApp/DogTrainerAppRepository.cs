using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.DogTrainerApp;
internal class DogTrainerAppRepository : IDogTrainerAppRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public DogTrainerAppRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<DogTrainerAppCmdResp> CreateDogTrainerAppAsync(CreateDogTrainerAppCmd cmd, CancellationToken ct)
    {
        spd_application? app = null;
        contact? contact = null;
        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        {
            contact = _mapper.Map<contact>(cmd);
            contact = await _context.CreateContact(contact, null, null, ct);
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
            _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);
            SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
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
        }
        await _context.SaveChangesAsync(ct);
        if (app == null || contact == null)
            throw new ApiException(HttpStatusCode.InternalServerError);
        return new DogTrainerAppCmdResp((Guid)app.spd_applicationid, contact.contactid.Value);
    }

    public async Task CommitDogTrainerAppAsync(CommitDogTrainerAppCmd cmd, CancellationToken ct)
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
}
