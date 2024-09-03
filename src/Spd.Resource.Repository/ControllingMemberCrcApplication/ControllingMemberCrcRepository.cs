using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Licence;
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

    //for unauth, create contact and application
    public async Task<ControllingMemberCrcApplicationCmdResp> CreateControllingMemberCrcApplicationAsync(CreateControllingMemberCrcAppCmd cmd, CancellationToken ct)
    {
        // get parent business license application
        spd_application? bizLicApplication = await _context.spd_applications
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_ApplicantId_account)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId)
                .SingleOrDefaultAsync(ct);

        /* TODO: you mean the parentBizLicAppId may bee null? yes
                   then we should proceed the request? yes,but we need to talk it with dynamics. Now we can make it not be null
 */
        if (bizLicApplication == null)
            throw new ArgumentException("Original business licence application was not found.");

        // create controlling member application
        spd_application app = _mapper.Map<spd_application>(cmd);
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
        _context.AddTospd_applications(app);
        // create contact
        contact? contact = _mapper.Map<contact>(cmd);
        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        {
            //for new, always create a new contact 
            //todo: probably needs to change if hasExpiredLicence
            contact = await _context.CreateContact(contact, null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases), ct);
            //link to biz
            var account = _context.accounts
                .Where(a => a.accountid == cmd.ParentBizLicApplicationId)
                .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
                .FirstOrDefault();
            if (account != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
            }

            //link to contact
            _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);

            // add link to parent business application
            _context.AddLink(bizLicApplication, nameof(bizLicApplication.spd_businessapplication_spd_workerapplication), app);
            SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);

            //link to bizContact
            var bizContact = _context.spd_businesscontacts.Where(x => x.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();
            _context.AddLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), app);

            //link bizContact with contact
            _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), contact);
            await _context.SaveChangesAsync(ct);
        }
        else if (cmd.ApplicationTypeCode == ApplicationTypeEnum.Update)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(a => a.spd_applicationid == cmd.ControllingMemberCrcAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<CreateControllingMemberCrcAppCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.ControllingMemberCrcAppId);
            _context.UpdateObject(app);
        }

       
        return new ControllingMemberCrcApplicationCmdResp((Guid)app.spd_applicationid, (Guid)contact.contactid);
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


        /* TODO: you mean the parentBizLicAppId may bee null? yes
                   then we should proceed the request? yes,but we need to talk it with dynamics. Now we can make it not be null*/
        if (bizLicApplication == null)
            throw new ArgumentException("Original business licence application was not found.");

        var bizContact = _context.spd_businesscontacts.Where(x => x.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();
        spd_application? app;
        if (cmd.ControllingMemberCrcAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(a => a.spd_applicationid == cmd.ControllingMemberCrcAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveControllingMemberCrcAppCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.ControllingMemberCrcAppId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
            var contact = _context.contacts.Where(l => l.contactid == cmd.ContactId).FirstOrDefault();
            if (contact != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
                //link bizContact with contact
                _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), contact);
            }
            //link to biz
            var account = _context.accounts
                .Where(a => a.accountid == cmd.ParentBizLicApplicationId)
                .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
                .FirstOrDefault();
            if (account != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
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

    public async Task<ControllingMemberCrcApplicationListResp> QueryAsync(ControllingMemberCrcQry qry, CancellationToken ct)
    {
        if (qry.AccountId == null && qry.ContactId == null && qry.ControllingMemberCrcAppId == null)
        {
            throw new ArgumentException("at least need 1 parameter to do licence query.");
        }

        IQueryable<spd_application> apps = _context.spd_applications;


        if (qry.ControllingMemberCrcAppId != null)
        {
            apps = apps.Where(a => a.spd_applicationid == qry.ControllingMemberCrcAppId);
        }
        if (qry.ContactId != null)
        {
            apps = apps.Where(a => a._spd_applicantid_value == qry.ContactId);
        }
        if (qry.AccountId != null)
        {
            apps = apps.Where(a => a._spd_organizationid_value == qry.AccountId);
        }
        if (qry.Type != null)
        {
            Guid? serviceTypeId = DynamicsContextLookupHelpers.GetServiceTypeGuid(qry.Type.ToString());
            apps = apps.Where(l => l._spd_servicetypeid_value == serviceTypeId);
        }
      

        return new ControllingMemberCrcApplicationListResp()
        {
            Items = _mapper.Map<IEnumerable<ControllingMemberCrcApplicationResp>>(apps)
        };
    }

}
