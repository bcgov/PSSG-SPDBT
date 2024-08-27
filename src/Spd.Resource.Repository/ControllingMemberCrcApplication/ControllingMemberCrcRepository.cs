using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

    public async Task<ControllingMemberCrcApplicationCmdResp> CreateControllingMemberCrcApplicationAsync(CreateControllingMemberCrcAppCmd cmd, CancellationToken ct)
    {
        // get parrent business license application
        spd_application? bizLicApplication = await _context.spd_applications
                .Expand(a=>a.spd_businessapplication_spd_workerapplication)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_ApplicantId_account)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId)
                .SingleOrDefaultAsync(ct);

        if (bizLicApplication == null)
            throw new ArgumentException("Original business licence application was not found.");

        // create controlling member application
        spd_application app = _mapper.Map<spd_application>(cmd);
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
        _context.AddTospd_applications(app);
        // create contact
        contact? contact = _mapper.Map<contact>(cmd);
        contact = await _context.CreateContact(contact, null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases), ct);

        var account = _context.accounts
            .Where(a => a.accountid == bizLicApplication.spd_ApplicantId_account.accountid)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();
        if (account != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
        }

        _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);
        
        // add link to business application
        _context.AddLink(bizLicApplication, nameof(bizLicApplication.spd_businessapplication_spd_workerapplication), app);
        await _context.SaveChangesAsync(ct);
        return new ControllingMemberCrcApplicationCmdResp((Guid)app.spd_applicationid, (Guid) contact.contactid);
    }

    public async Task<ControllingMemberCrcApplicationCmdResp> SaveControllingMenberCrcApplicationAsync(SaveControllingMemberCrcAppCmd cmd, CancellationToken ct)
    {
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
            }
        }
        //TODO: what is the LinkServiceType??
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
   
    
        //TODO: what is the LinkTeam ??
        await LinkTeam(DynamicsConstants.Licensing_Client_Service_Team_Guid, app, ct);
        await _context.SaveChangesAsync();
      

        //TODO: do we have category codes in the crc controlling member process?
        //SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync();
        return new ControllingMemberCrcApplicationCmdResp((Guid)app.spd_applicationid, (Guid)cmd.ContactId);
    }
    private async Task LinkTeam(string teamGuidStr, spd_application app, CancellationToken ct)
    {
        Guid teamGuid = Guid.Parse(teamGuidStr);
        team? serviceTeam = await _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefaultAsync(ct);
        _context.SetLink(app, nameof(spd_application.ownerid), serviceTeam);
    }
}
