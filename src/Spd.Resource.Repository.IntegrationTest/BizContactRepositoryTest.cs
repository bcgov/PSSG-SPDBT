using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.BizContact;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class BizContactRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly string testPrefix = "spd-auto-test-";
    private readonly IBizContactRepository _bizContactRepo;
    private readonly IDynamicsContextFactory _contextFactory;
    private DynamicsContext _context;

    public BizContactRepositoryTest(IntegrationTestSetup testSetup)
    {
        _bizContactRepo = testSetup.ServiceProvider.GetRequiredService<IBizContactRepository>();
        _contextFactory = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>();
        _context = _contextFactory.CreateChangeOverwrite();

    }

    [Fact]
    public async Task GetBizAppContactsAsync_return_Correctly()
    {
        account biz = await CreateAccountAsync();
        spd_application app = await CreateApplicationAsync(biz);
        spd_businesscontact bizContact = await CreateBizContactAsync(biz, "firstName1", BizContactRoleOptionSet.ControllingMember);
        spd_businesscontact bizContact2 = await CreateBizContactAsync(biz, "firstName2", BizContactRoleOptionSet.Employee);
        await _context.SaveChangesAsync(CancellationToken.None);

        try
        {
            // Arrange
            BizContactQry qry = new(biz.accountid, app.spd_applicationid);

            // Action
            var response = await _bizContactRepo.QueryBizContactsAsync(qry, CancellationToken.None);

            // Assert
            Assert.NotNull(response);
            Assert.Equal(2, response.Count());
            Assert.Equal(true, response.Any(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName1"));
            Assert.Equal(true, response.Any(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName2"));
            Assert.Equal(BizContactRoleEnum.ControllingMember, response.Where(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName1").FirstOrDefault().BizContactRoleCode);
            Assert.Equal(BizContactRoleEnum.Employee, response.Where(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName2").FirstOrDefault().BizContactRoleCode);
        }
        finally
        {
            //Annihilate
            _context.DeleteObject(bizContact2);
            _context.DeleteObject(bizContact);
            _context.DeleteObject(app);
            _context.DeleteObject(biz);
            await _context.SaveChangesAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task ManageBizContactsAsync_WithNoExistingContacts_Correctly()
    {
        // Arrange
        //create account
        account biz = await CreateAccountAsync();
        await _context.SaveChangesAsync(CancellationToken.None);

        BizContactUpsertCmd cmd = new((Guid)biz.accountid, new List<BizContactResp>());

        try
        {
            // Action
            var response = await _bizContactRepo.ManageBizContactsAsync(cmd, CancellationToken.None);

            // Assert
            var contact = await _context.spd_businesscontacts
                .Where(c => c._spd_organizationid_value == biz.accountid)
                .FirstOrDefaultAsync(CancellationToken.None);
            Assert.Equal(null, contact);
        }
        finally
        {
            //Annihilate
            _context.DeleteObject(biz);
            await _context.SaveChangesAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task ManageBizContactsAsync_WithExistingContacts_Correctly()
    {
        // Objects to be cleaned up
        var createdIds = new List<(Type EntityType, Guid Id)>();

        try
        {
            // Arrange
            var biz = await CreateAccountAsync();
            createdIds.Add((typeof(account), (Guid)biz.accountid));

            var app = await CreateApplicationAsync(biz);
            createdIds.Add((typeof(spd_application), (Guid)app.spd_applicationid));

            var contact = await CreateContactAsync();
            createdIds.Add((typeof(contact), (Guid)contact.contactid));

            var org = await CreateOrgAsync("orgTest");
            createdIds.Add((typeof(account), (Guid)org.accountid));

            var spd_case = await CreateIncidentAsync(contact, org, app);
            createdIds.Add((typeof(incident), (Guid)spd_case.incidentid));

            var lic = await CreateLicenceAsync(contact, spd_case);
            createdIds.Add((typeof(spd_licence), (Guid)lic.spd_licenceid));

            //await _context.SaveChangesAsync(CancellationToken.None);

            var bizContact = await CreateBizContactAsync(biz, "firstName1", BizContactRoleOptionSet.ControllingMember);
            createdIds.Add((typeof(spd_businesscontact), (Guid)bizContact.spd_businesscontactid));

            var bizContact2 = await CreateBizContactAsync(biz, "firstName2", BizContactRoleOptionSet.ControllingMember);
            createdIds.Add((typeof(spd_businesscontact), (Guid)bizContact2.spd_businesscontactid));

            await _context.SaveChangesAsync(CancellationToken.None);

            BizContactUpdateCmd cmd = new((Guid)bizContact.spd_businesscontactid, new BizContact.BizContact
            { GivenName = IntegrationTestSetup.DataPrefix + "newFirstName1", EmailAddress = "firstName1@add.com", BizContactRoleCode = BizContactRoleEnum.ControllingMember });
            var updatedBizContact = await _bizContactRepo.ManageBizContactsAsync(cmd, CancellationToken.None);

            BizContactCreateCmd cmd2 = new(new BizContact.BizContact
            { BizId = (Guid)biz.accountid, ContactId = contact.contactid, GivenName = IntegrationTestSetup.DataPrefix + "newFirstName3", LicenceId = lic.spd_licenceid, BizContactRoleCode = BizContactRoleEnum.ControllingMember });
            var newBizContact = await _bizContactRepo.ManageBizContactsAsync(cmd2, CancellationToken.None);
            createdIds.Add((typeof(spd_businesscontact), (Guid)newBizContact));

            BizContactDeleteCmd cmd3 = new((Guid)bizContact2.spd_businesscontactid);
            var deletedBizContact = await _bizContactRepo.ManageBizContactsAsync(cmd3, CancellationToken.None);

            await _context.SaveChangesAsync(CancellationToken.None);


            // Assert
            var bizContacts = _context.spd_businesscontacts
                .Where(c => c._spd_organizationid_value == biz.accountid)
                .ToList();

            Assert.Equal(3, bizContacts.Count());
            Assert.True(bizContacts.Any(c => c.spd_firstname == IntegrationTestSetup.DataPrefix + "newFirstName1")); // updated
            Assert.True(bizContacts.Any(c => c.spd_firstname == IntegrationTestSetup.DataPrefix + "firstName2" && c.statecode == DynamicsConstants.StateCode_Inactive)); // removed
            Assert.True(bizContacts.Any(c => c.spd_firstname == IntegrationTestSetup.DataPrefix + "newFirstName3" && c.statecode == DynamicsConstants.StateCode_Active));
            Assert.Equal(1, bizContacts.Count(c => c._spd_contactid_value == contact.contactid && c.statecode == DynamicsConstants.StateCode_Active));
        }
        catch (Exception ex)
        {

        }
        finally
        {
            // Cleanup
            foreach (var (entityType, id) in createdIds)
            {
                object entity = null;
                var _contextForDelete = _contextFactory.CreateChangeOverwrite();
                try
                {
                    if (entityType == typeof(account))
                    {
                        entity = _contextForDelete.accounts.Where(a => a.accountid == id).FirstOrDefault();
                    }
                    else if (entityType == typeof(spd_application))
                    {
                        entity = _contextForDelete.spd_applications.Where(a => a.spd_applicationid == id).FirstOrDefault();
                    }
                    else if (entityType == typeof(contact))
                    {
                        entity = _contextForDelete.contacts.Where(c => c.contactid == id).FirstOrDefault();
                    }
                    else if (entityType == typeof(incident))
                    {
                        entity = _contextForDelete.incidents.Where(i => i.incidentid == id).FirstOrDefault();
                    }
                    else if (entityType == typeof(spd_licence))
                    {
                        entity = _contextForDelete.spd_licences.Where(l => l.spd_licenceid == id).FirstOrDefault();
                    }
                    else if (entityType == typeof(spd_businesscontact))
                    {
                        entity = _contextForDelete.spd_businesscontacts.Where(bc => bc.spd_businesscontactid == id).FirstOrDefault();
                    }

                    if (entity != null)
                    {
                        await _context.SaveChangesAsync(CancellationToken.None);

                    }
                }
                catch (Exception deleteEx)
                {
                }
            }
        }
    }



    [Fact]
    public async Task ManageBizContactsAsync_WithExistingBizContacts_Correctly()
    {
        // Arrange
        account biz = await CreateAccountAsync();
        await _context.SaveChangesAsync(CancellationToken.None);
        spd_businesscontact bizContact = await CreateBizContactAsync(biz, "firstName1", BizContactRoleOptionSet.ControllingMember);
        spd_businesscontact bizContact2 = await CreateBizContactAsync(biz, "firstName2", BizContactRoleOptionSet.ControllingMember);
        await _context.SaveChangesAsync(CancellationToken.None);

        try
        {
            List<BizContactResp> requests = new()
            {
                new BizContactResp{ BizContactId = bizContact.spd_businesscontactid, GivenName = "newFirstName1", EmailAddress="firstName1@add.com", BizContactRoleCode=BizContactRoleEnum.ControllingMember},
                new BizContactResp{ GivenName = "newFirstName3", EmailAddress="firstName3@add.com", BizContactRoleCode=BizContactRoleEnum.ControllingMember},
            };

            BizContactUpsertCmd cmd = new((Guid)biz.accountid, requests);

            // Action
            var response = await _bizContactRepo.ManageBizContactsAsync(cmd, CancellationToken.None);

            // Assert
            var bizContacts = _context.spd_businesscontacts
                .Where(c => c._spd_organizationid_value == biz.accountid)
                .Where(c => c.statecode == DynamicsConstants.StateCode_Active)
                .ToList();
            Assert.Equal(2, bizContacts.Count());
            Assert.Equal(true, bizContacts.Any(c => c.spd_firstname == "newFirstName1")); //updated
        }
        finally
        {
            //Annihilate
            _context.DeleteObject(bizContact);
            _context.DeleteObject(bizContact2);
            _context.DeleteObject(biz);
            await _context.SaveChangesAsync(CancellationToken.None);
        }

    }

    private async Task<account> CreateAccountAsync()
    {
        account biz = new();
        biz.name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}";
        biz.accountid = Guid.NewGuid();
        _context.AddToaccounts(biz);
        return biz;
    }

    private async Task<spd_application> CreateApplicationAsync(account biz)
    {
        spd_application app = new();
        app.spd_applicationid = Guid.NewGuid();
        _context.AddTospd_applications(app);
        _context.SetLink(app, nameof(app.spd_OrganizationId), biz);
        return app;
    }

    private async Task<spd_businesscontact> CreateBizContactAsync(account biz, string firstName, BizContactRoleOptionSet role)
    {
        spd_businesscontact bizContact = new();
        bizContact.spd_businesscontactid = Guid.NewGuid();
        bizContact.spd_firstname = IntegrationTestSetup.DataPrefix + firstName;
        bizContact.spd_role = (int)role;
        _context.AddTospd_businesscontacts(bizContact);
        _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
        return bizContact;
    }

    private async Task<contact> CreateContactAsync()
    {
        contact contact = new();
        contact.contactid = Guid.NewGuid();
        _context.AddTocontacts(contact);
        return contact;
    }
    public async Task<account> CreateOrgAsync(string orgName)
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
                emailaddress1 = $"{testPrefix}{orgName}@test.gov.bc.ca",
            };
            _context.AddToaccounts(newOne);

            foreach (var serviceType in DynamicsContextLookupHelpers.ServiceTypeGuidDictionary)
            {
                var st = new spd_servicetype { spd_servicetypeid = serviceType.Value };
                _context.AttachTo(nameof(_context.spd_servicetypes), st);
                _context.AddLink(newOne, nameof(account.spd_account_spd_servicetype), st);
            }

            await _context.SaveChangesAsync();
            return newOne;
        }
    }

    private async Task<incident> CreateIncidentAsync(contact c, account org, spd_application app)
    {
        //create case
        Guid incidentId = Guid.NewGuid();
        incident incident = new incident
        {
            incidentid = incidentId,
            title = $"{testPrefix}incident",
            prioritycode = 1,
            _spd_applicationid_value = app.spd_applicationid,
            spd_licenceapplicationtype = 100000000
        };
        spd_servicetype serviceType = _context.spd_servicetypes.FirstOrDefault();
        _context.AddToincidents(incident);
        _context.SetLink(incident, nameof(incident.spd_ApplicationId), app);
        _context.SetLink(incident, nameof(incident.customerid_account), org);
        _context.SetLink(incident, nameof(incident.customerid_contact), c);
        _context.SetLink(incident, nameof(incident.spd_OrganizationId), org);
        _context.SetLink(incident, nameof(incident.spd_ServiceTypeId), serviceType);
        _context.SaveChanges();
        return incident;
    }

    private async Task<spd_licence> CreateLicenceAsync(contact c, incident incident)
    {
        spd_licence lic = new()
        {
            spd_licenceterm = 100000001
        };
        lic.spd_licenceid = Guid.NewGuid();
        _context.AddTospd_licences(lic);
        _context.SetLink(lic, nameof(lic.spd_CaseId), incident);
        _context.SetLink(lic, nameof(lic.spd_LicenceHolder_contact), c);
        _context.SetLink(lic, nameof(lic.spd_LicenceType), _context.LookupServiceType(ServiceTypeEnum.SecurityWorkerLicence.ToString()));
        return lic;
    }
}