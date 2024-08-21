using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Org;
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
        _context.AddTospd_applications(app);
        // create contact
        contact contact = _mapper.Map<contact>(cmd);
        contact.contactid = Guid.NewGuid();
        _context.AddTocontacts(contact);


        var account = _context.accounts
            .Where(a => a.accountid == bizLicApplication.spd_ApplicantId_account.accountid)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();
        if (account != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
        }

        _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);

        //create the aliases
        foreach (var item in cmd.Aliases)
        {
            AddAlias(item, contact);
        }

        _context.AddLink(bizLicApplication, nameof(bizLicApplication.spd_businessapplication_spd_workerapplication), app);
        await _context.SaveChangesAsync(ct);
        return new ControllingMemberCrcApplicationCmdResp((Guid)app.spd_applicationid);
    }
    private void AddAlias(AliasResp createAliasCmd, contact contact)
    {
        spd_alias? matchingAlias = GetAlias(createAliasCmd, contact);
        // if not found, create new alias
        if (matchingAlias == null)
        {
            spd_alias alias = _mapper.Map<spd_alias>(createAliasCmd);
            _context.AddTospd_aliases(alias);
            // associate alias to contact
            _context.SetLink(alias, nameof(alias.spd_ContactId), contact);
        }
    }
    private spd_alias? GetAlias(AliasResp aliasCreateCmd, contact contact)
    {
        var matchingAlias = _context.spd_aliases.Where(o =>
           o.spd_firstname == aliasCreateCmd.GivenName &&
           o.spd_middlename1 == aliasCreateCmd.MiddleName1 &&
           o.spd_middlename2 == aliasCreateCmd.MiddleName2 &&
           o.spd_surname == aliasCreateCmd.Surname &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o._spd_contactid_value == contact.contactid
       ).FirstOrDefault();
        return matchingAlias;
    }
}
