using Microsoft.AspNetCore.DataProtection;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.User;
using Spd.Utilities.Dynamics;
using System.Net;

namespace Spd.Tests.Presentation.Screening.Integration;
public class DynamicsTestData
{
    private readonly string testPrefix = "spd-auto-test";
    private readonly DynamicsContext _context;
    private readonly ITimeLimitedDataProtector _dataProtector;

    public DynamicsTestData(IDynamicsContextFactory factory, IDataProtectionProvider protectProvider)
    {
        _context = factory.CreateChangeOverwrite();
        _dataProtector = protectProvider.CreateProtector(nameof(UserCreateCmd)).ToTimeLimitedDataProtector();
    }

    public DynamicsContext GetDynamicsContext()
    {
        return _context;
    }

    public async Task<(account, spd_portaluser)> CreateOrgWithLogonUser(string orgName)
    {
        var org = await CreateOrg(orgName);
        var identity = await CreateIdentity(WebAppFixture.LOGON_USER_GUID.ToString(), WebAppFixture.LOGON_ORG_GUID.ToString());
        var user = await CreateUserInOrg("lastName", "firstName", org, identity);
        return (org, user);
    }

    public async Task<(account, spd_portaluser)> CreateOrgWithPrimaryUser(string orgName, Guid userGuid, Guid orgGuid)
    {
        var org = await CreateOrg(orgName);
        var identity = await CreateIdentity(userGuid.ToString(), orgGuid.ToString());
        var user = await CreateUserInOrg($"ln{userGuid.ToString().Substring(0, 10)}", "firstName", org, identity);
        return (org, user);
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
                spd_orgguid = WebAppFixture.LOGON_ORG_GUID.ToString(),
                spd_workswith = (int)WorksWithChildrenOptionSet.Adults
            };
            _context.AddToaccounts(newOne);
            await _context.SaveChangesAsync();
            return newOne;
        }
    }

    public async Task<spd_portalinvitation> CreatePortalInvitationInOrg(string surname, string givenName, account org, InvitationTypeOptionSet inviteType = InvitationTypeOptionSet.ScreeningRequest)
    {
        var existing = _context.spd_portalinvitations
            .Where(a => a.spd_surname == surname && a.spd_firstname == givenName && a._spd_organizationid_value == org.accountid)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        if (existing != null) return existing;
        else
        {
            Guid portalInvitationId = Guid.NewGuid();
            string encryptedId = WebUtility.UrlEncode(_dataProtector.Protect(portalInvitationId.ToString()));
            spd_portalinvitation newOne = new spd_portalinvitation
            {
                spd_portalinvitationid = portalInvitationId,
                spd_firstname = givenName,
                spd_surname = surname,
                spd_invitationtype = (int)inviteType,
                spd_invitationlink = $"http://localhost/invitations/{encryptedId}"
            };
            _context.AddTospd_portalinvitations(newOne);
            _context.SetLink(newOne, nameof(newOne.spd_OrganizationId), org);
            await _context.SaveChangesAsync();
            return newOne;
        }
    }

    public async Task<spd_portaluser> CreateUserInOrg(string surname, string givenName, account org, spd_identity identity)
    {
        var existing = _context.spd_portalusers
            .Where(a => a.spd_surname == surname && a.spd_firstname == givenName && a._spd_organizationid_value == org.accountid)
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
                spd_surname = surname,
                spd_emailaddress1 = $"test{givenName}@{surname}.com",
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

    public async Task<(spd_portaluser, spd_portalinvitation)> CreateTempUserInOrg(string surname, string givenName, account org)
    {
        Guid portalUserId = Guid.NewGuid();
        spd_portaluser newOne = new spd_portaluser
        {
            spd_portaluserid = portalUserId,
            spd_firstname = givenName,
            spd_surname = surname,
            spd_emailaddress1 = $"test{givenName}@{surname}.com",
        };
        _context.AddTospd_portalusers(newOne);
        _context.SetLink(newOne, nameof(spd_portaluser.spd_OrganizationId), org);
        spd_role? role = _context.LookupRole("Primary");
        if (role != null)
        {
            _context.AddLink(role, nameof(role.spd_spd_role_spd_portaluser), newOne);
        }
        spd_portalinvitation invite = await CreatePortalInvitationInOrg(surname, givenName, org, InvitationTypeOptionSet.PortalUser);
        _context.SetLink(invite, nameof(spd_portalinvitation.spd_PortalUserId), newOne);
        await _context.SaveChangesAsync();

        return (newOne, invite);
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

    public async Task<spd_application> CreateAppInOrg(string surname, string givenName, DateTimeOffset birthdate, account org)
    {
        Guid id = Guid.NewGuid();
        spd_application newOne = new spd_application
        {
            spd_applicationid = id,
            spd_firstname = givenName,
            spd_lastname = surname,
            spd_dateofbirth = new Microsoft.OData.Edm.Date(birthdate.Year, birthdate.Month, birthdate.Day),
            statecode = DynamicsConstants.StatusCode_Active,
        };
        _context.AddTospd_applications(newOne);
        _context.SetLink(newOne, nameof(newOne.spd_OrganizationId), org);
        await _context.SaveChangesAsync();
        return newOne;
    }

    public async Task<spd_orgregistration?> CreateOrgRegistration(string orgName)
    {
        var existing = _context.spd_orgregistrations
            .Where(a => a.spd_organizationname == orgName)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        if (existing != null) return existing;
        else
        {
            Guid id = Guid.NewGuid();
            spd_orgregistration newOne = new spd_orgregistration
            {
                spd_orgregistrationid = id,
                spd_organizationname = orgName,
                spd_email = "testorgReg@orgreg.com"
            };
            _context.AddTospd_orgregistrations(newOne);
            _context.SetLink(newOne, nameof(spd_orgregistration.spd_OrganizationTypeId), _context.LookupOrganizationType("Volunteer-Registrant"));
            await _context.SaveChangesAsync();
            spd_orgregistration? orgReg = _context.spd_orgregistrations.Where(o => o.spd_orgregistrationid == newOne.spd_orgregistrationid).FirstOrDefault();
            return orgReg;
        }
    }

    public async Task<spd_clearance> CreateClearance(string bcscId)
    {
        account org = await CreateOrg("org1");
        Guid identityId = Guid.NewGuid();
        spd_identity identity = new spd_identity
        {
            spd_identityid = identityId,
            spd_userguid = bcscId,
            spd_type = (int)IdentityTypeOptionSet.BcServicesCard
        };
        _context.AddTospd_identities(identity);

        Guid contactId = Guid.NewGuid();
        contact contact = new contact
        {
            firstname = "applicantfn",
            lastname = "applicantln",
            contactid = contactId,
            birthdate = new Microsoft.OData.Edm.Date(2000, 1, 1)
        };
        _context.AddTocontacts(contact);
        _context.AddLink(contact, nameof(contact.spd_contact_spd_identity), identity);

        //create clearance
        Guid clearanceId = Guid.NewGuid();
        spd_clearance clearance = new spd_clearance
        {
            spd_clearanceid = clearanceId,
            spd_dategranted = new DateTimeOffset(2023, 6, 1, 0, 0, 0, TimeSpan.Zero),
            spd_expirydate = new DateTimeOffset(2030, 7, 1, 0, 0, 0, TimeSpan.Zero),
            spd_workswith = (int)WorksWithChildrenOptionSet.Adults,
            spd_sharable = (int)YesNoOptionSet.Yes
        };
        _context.AddTospd_clearances(clearance);
        _context.SetLink(clearance, nameof(clearance.spd_ServiceType), _context.LookupServiceType("CRRP_EMPLOYEE"));
        _context.SetLink(clearance, nameof(clearance.spd_ContactID), contact);

        //create application
        Guid id = Guid.NewGuid();
        spd_application newOne = new spd_application
        {
            spd_applicationid = id,
            spd_firstname = $"{testPrefix}appfirstname",
            spd_lastname = $"{testPrefix}applastname",
            spd_dateofbirth = new Microsoft.OData.Edm.Date(2000, 1, 1),
            statecode = DynamicsConstants.StatusCode_Active,
        };
        _context.AddTospd_applications(newOne);
        _context.SetLink(newOne, nameof(newOne.spd_OrganizationId), org);

        //create case
        Guid incidentId = Guid.NewGuid();
        incident incident = new incident
        {
            incidentid = incidentId,
            title = $"{testPrefix}incident",
            prioritycode = 1,
            _spd_applicationid_value = id,

        };
        _context.AddToincidents(incident);
        _context.SetLink(incident, nameof(incident.customerid_account), org);
        _context.SetLink(incident, nameof(incident.customerid_contact), contact);
        _context.SetLink(incident, nameof(incident.spd_OrganizationId), org);
        _context.AddLink(incident, nameof(incident.spd_incident_spd_clearance), clearance);
        await _context.SaveChangesAsync();
        return clearance;
    }
}

