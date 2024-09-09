using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.ControllingMemberCrcApplication;
public class ControllingMemberCrcRepository : IControllingMemberCrcRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;


    public ControllingMemberCrcRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<ControllingMemberCrcApplicationResp> GetCrcApplicationAsync(Guid controllingMemberApplicationId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications.Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_contact)
                .Where(a => a.spd_applicationid == controllingMemberApplicationId)
                .SingleOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                throw new ArgumentException("invalid app id");
            else
                throw;
        }
        ControllingMemberCrcApplicationResp appResp = _mapper.Map<ControllingMemberCrcApplicationResp>(app);

        if (app.spd_ApplicantId_contact?.contactid != null)
        {
            var aliases = SharedRepositoryFuncs.GetAliases((Guid)app.spd_ApplicantId_contact.contactid, _context);
            appResp.Aliases = _mapper.Map<AliasResp[]>(aliases);
            _mapper.Map<spd_application, ControllingMemberCrcApplicationResp>(app, appResp);
        }

        return appResp;
    }

    public async Task<ControllingMemberCrcApplicationCmdResp> SaveControllingMemberCrcApplicationAsync(SaveControllingMemberCrcAppCmd cmd, CancellationToken ct)
    {
        // get parent business license application
        spd_application? bizLicApplication = await _context.spd_applications
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_ApplicantId_account)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId)
                .SingleOrDefaultAsync(ct);

        if (bizLicApplication == null)
            throw new ArgumentException("Parent business licence application was not found.");

        var bizContact = _context.spd_businesscontacts.Where(x => x.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();
        spd_application? app;
        if (cmd.ControllingMemberAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(a => a.spd_applicationid == cmd.ControllingMemberAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveControllingMemberCrcAppCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.ControllingMemberAppId);
            _context.UpdateObject(app);

            var contact = _context.contacts.Where(l => l.contactid == cmd.ContactId).FirstOrDefault();
            if (contact == null)
            {
                throw new ArgumentException("applicant not found");
            }
            //update contact
            contact = await _context.UpdateContact(contact, _mapper.Map<SaveControllingMemberCrcAppCmd, contact>(cmd), null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases), ct);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
            var contact = _context.contacts.Where(l => l.contactid == cmd.ContactId).FirstOrDefault();
            if (contact == null)
            {
                throw new ArgumentException("applicant not found");
            }
            //update contact
            contact = await _context.UpdateContact(contact, _mapper.Map<SaveControllingMemberCrcAppCmd, contact>(cmd),null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases),ct);

            //set applicant lookup
            _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            _context.AddLink(contact, nameof(contact.spd_contact_spd_application_ApplicantId), app);
            
            //link bizContact with contact
            _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), contact);

            //link to biz
            var account = _context.accounts
                .Where(a => a.accountid == bizLicApplication._spd_applicantid_value)
                .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
                .FirstOrDefault();
            if (account != null)
            {
                //set organization lookup
                _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
                _context.AddLink(account, nameof(account.spd_account_spd_application_OrganizationId), app);
            }
            // add link to parent business application
            _context.AddLink(bizLicApplication, nameof(bizLicApplication.spd_businessapplication_spd_workerapplication), app);

            SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);

            //link to bizContact
            _context.AddLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), app);
        }

        await _context.SaveChangesAsync();
        return new ControllingMemberCrcApplicationCmdResp((Guid)app.spd_applicationid, cmd.ContactId);
    }

}
