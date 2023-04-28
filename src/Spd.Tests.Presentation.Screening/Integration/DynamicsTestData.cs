using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Tests.Presentation.Screening.Integration;
public class DynamicsTestData
{
    private readonly string testPrefix = "spd-auto-test";
    private readonly DynamicsContext _context;

    public DynamicsTestData(IDynamicsContextFactory factory)
    {
        _context = factory.Create();
    }

    public async Task<account> CreateOrgWithLogonUser(string orgName)
    {
        var org = await CreateOrg("org1");
        var identity = await CreateIdentity(WebAppFixture.LOGON_USER_GUID.ToString(), WebAppFixture.LOGON_ORG_GUID.ToString());
        var usr = await CreateUserInOrg("lastName", "firstName", org, identity);
        return org;
    }
    public async Task<account> CreateOrg(string orgName)
    {
        var existing = _context.accounts
            .Where(a => a.spd_organizationlegalname == $"{testPrefix}{orgName}")
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        if (existing != null) return existing;
        else
        {
            Guid orgId = Guid.NewGuid();
            account newOne = new account
            {
                accountid = orgId,
                name = $"{testPrefix}{orgName}",
                spd_organizationlegalname = $"{testPrefix}{orgName}",
                address1_city = "victoria",
            };
            _context.AddToaccounts(newOne);
            await _context.SaveChangesAsync();
            return newOne;
        }
    }

    public async Task<spd_portaluser> CreateUserInOrg(string surName, string givenName, account org, spd_identity identity)
    {
        var existing = _context.spd_portalusers
            .Where(a => a.spd_surname == surName && a.spd_firstname == givenName && a._spd_organizationid_value == org.accountid)
            .Where(a => a._spd_identityid_value == identity.spd_identityid)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        if (existing != null) return existing;
        else
        {
            Guid portalUserId = Guid.NewGuid();
            spd_portaluser newOne = new spd_portaluser
            {
                spd_portaluserid = portalUserId,
                spd_firstname = givenName,
                spd_surname = surName
            };
            _context.AddTospd_portalusers(newOne);
            _context.SetLink(newOne, nameof(spd_portaluser.spd_OrganizationId), org);
            _context.SetLink(newOne, nameof(spd_portaluser.spd_IdentityId), identity);
            await _context.SaveChangesAsync();
            return newOne;
        }
    }
    public async Task<spd_identity> CreateIdentity(string userGuid, string orgGuid)
    {
        var existing = _context.spd_identities
            .Where(a => a.spd_userguid == userGuid && a.spd_orgguid == orgGuid)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        if (existing != null) return existing;
        else
        {
            Guid identityId = Guid.NewGuid();
            spd_identity newOne = new spd_identity
            {
                spd_identityid = identityId,
                spd_orgguid = orgGuid,
                spd_userguid = userGuid,
            };
            _context.AddTospd_identities(newOne);
            await _context.SaveChangesAsync();
            return newOne;
        }
    }

}

