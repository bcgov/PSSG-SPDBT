using Microsoft.Dynamics.CRM;
using Spd.Resource.Organizations.User;
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

    public async Task<(account,spd_portaluser)> CreateOrgWithLogonUser(string orgName)
    {
        var org = await CreateOrg(orgName);
        var identity = await CreateIdentity(WebAppFixture.LOGON_USER_GUID.ToString(), WebAppFixture.LOGON_ORG_GUID.ToString());
        var user = await CreateUserInOrg("lastName", "firstName", org, identity);
        return (org,user);
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
                spd_orgguid = WebAppFixture.LOGON_ORG_GUID.ToString()
            };
            _context.AddToaccounts(newOne);
            await _context.SaveChangesAsync();
            return newOne;
        }
    }

    public async Task<spd_portalinvitation> CreatePortalInvitationInOrg(string surName, string givenName, account org, InvitationTypeOptionSet inviteType = InvitationTypeOptionSet.ScreeningRequest)
    {
        var existing = _context.spd_portalinvitations
            .Where(a => a.spd_surname == surName && a.spd_firstname == givenName && a._spd_organizationid_value == org.accountid)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        if (existing != null) return existing;
        else
        {
            Guid portalInvitationId = Guid.NewGuid();
            spd_portalinvitation newOne = new spd_portalinvitation
            {
                spd_portalinvitationid = portalInvitationId,
                spd_firstname = givenName,
                spd_surname = surName,
                spd_invitationtype = (int)inviteType,
            };
            _context.AddTospd_portalinvitations(newOne);
            _context.SetLink(newOne, nameof(newOne.spd_OrganizationId), org);
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
                spd_surname = surName,
                spd_emailaddress1 = $"test{givenName}@{surName}.com",
            };
            _context.AddTospd_portalusers(newOne);
            _context.SetLink(newOne, nameof(spd_portaluser.spd_OrganizationId), org);
            _context.SetLink(newOne, nameof(spd_portaluser.spd_IdentityId), identity);
            spd_role? role = _context.LookupRole("Primary");
            if (role != null)
            {
                _context.AddLink(role, nameof(role.spd_spd_role_spd_portaluser), newOne);
            }
            await _context.SaveChangesAsync();
            return newOne;
        }
    }

    public async Task<spd_portaluser> CreateTempUserInOrg(string surName, string givenName, account org)
    {
        var existing = _context.spd_portalusers
            .Where(a => a.spd_surname == surName && a.spd_firstname == givenName && a._spd_organizationid_value == org.accountid)
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
                spd_surname = surName,
                spd_emailaddress1 = $"test{givenName}@{surName}.com",
            };
            _context.AddTospd_portalusers(newOne);
            _context.SetLink(newOne, nameof(spd_portaluser.spd_OrganizationId), org);
            spd_role? role = _context.LookupRole("Primary");
            if (role != null)
            {
                _context.AddLink(role, nameof(role.spd_spd_role_spd_portaluser), newOne);
            }
            await _context.SaveChangesAsync();
            spd_portalinvitation invite = await CreatePortalInvitationInOrg(surName, givenName, org, InvitationTypeOptionSet.PortalUser);
            _context.SetLink(invite, nameof(spd_portalinvitation.spd_PortalUserId), newOne);
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

