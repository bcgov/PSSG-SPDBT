using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.BizContact;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class BizContactRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IBizContactRepository _bizContactRepo;
    private DynamicsContext _context;

    public BizContactRepositoryTest(IntegrationTestSetup testSetup)
    {
        _bizContactRepo = testSetup.ServiceProvider.GetRequiredService<IBizContactRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    [Fact]
    public async Task GetBizAppContactsAsync_return_Correctly()
    {
        // Arrange
        account biz = await CreateAccountAsync();
        spd_application app = await CreateApplicationAsync(biz);
        spd_businesscontact bizContact = await CreateBizContactAsync(biz, app, "firstName1", BizContactRoleOptionSet.ControllingMember);
        spd_businesscontact bizContact2 = await CreateBizContactAsync(biz, app, "firstName2", BizContactRoleOptionSet.Employee);
        await _context.SaveChangesAsync(CancellationToken.None);

        BizContactQry qry = new(biz.accountid, app.spd_applicationid);

        // Action
        var response = await _bizContactRepo.GetBizAppContactsAsync(qry, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(2, response.Count());
        Assert.Equal(true, response.Any(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName1"));
        Assert.Equal(true, response.Any(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName2"));
        Assert.Equal(BizContactRoleEnum.ControllingMember, response.Where(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName1").FirstOrDefault().BizContactRoleCode);
        Assert.Equal(BizContactRoleEnum.Employee, response.Where(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstName2").FirstOrDefault().BizContactRoleCode);

        //Annihilate
        _context.DeleteObject(bizContact2);
        _context.DeleteObject(bizContact);
        _context.DeleteObject(app);
        _context.DeleteObject(biz);
        await _context.SaveChangesAsync(CancellationToken.None);
    }

    [Fact]
    public async Task ManageBizContactsAsync_WithNoExistingContacts_Correctly()
    {
        // Arrange
        //create account
        account biz = await CreateAccountAsync();
        spd_application app = await CreateApplicationAsync(biz);
        await _context.SaveChangesAsync(CancellationToken.None);

        BizContactUpsertCmd cmd = new((Guid)biz.accountid, (Guid)app.spd_applicationid, new List<BizContactResp>());

        // Action
        var response = await _bizContactRepo.ManageBizContactsAsync(cmd, CancellationToken.None);

        // Assert
        var contact = await _context.spd_businesscontacts
            .Where(c => c._spd_organizationid_value == biz.accountid && c._spd_application_value == app.spd_applicationid)
            .FirstOrDefaultAsync(CancellationToken.None);
        Assert.Equal(null, contact);

        //Annihilate
        _context.DeleteObject(app);
        _context.DeleteObject(biz);
        await _context.SaveChangesAsync(CancellationToken.None);
    }

    [Fact]
    public async Task ManageBizContactsAsync_WithExistingContacts_Correctly()
    {
        // Arrange
        account biz = await CreateAccountAsync();
        spd_application app = await CreateApplicationAsync(biz);
        contact contact = await CreateContactAsync();
        spd_licence lic = await CreateLicenceAsync(contact);
        spd_businesscontact bizContact = await CreateBizContactAsync(biz, app, "firstName1", BizContactRoleOptionSet.ControllingMember);
        spd_businesscontact bizContact2 = await CreateBizContactAsync(biz, app, "firstName2", BizContactRoleOptionSet.ControllingMember);
        await _context.SaveChangesAsync(CancellationToken.None);
        List<BizContactResp> requests = new()
        {
            new BizContactResp{ BizContactId = bizContact.spd_businesscontactid, GivenName = "newFirstName1", EmailAddress="firstName1@add.com", BizContactRoleCode=BizContactRoleEnum.ControllingMember},
            new BizContactResp{ GivenName = "newFirstName3", EmailAddress="firstName3@add.com", BizContactRoleCode=BizContactRoleEnum.ControllingMember},
            new BizContactResp{ ContactId = contact.contactid, LicenceId=lic.spd_licenceid, BizContactRoleCode=BizContactRoleEnum.ControllingMember},
            new BizContactResp{ ContactId = contact.contactid, LicenceId=lic.spd_licenceid, BizContactRoleCode=BizContactRoleEnum.Employee},
        };
        BizContactUpsertCmd cmd = new((Guid)biz.accountid, (Guid)app.spd_applicationid, requests);

        // Action
        var response = await _bizContactRepo.ManageBizContactsAsync(cmd, CancellationToken.None);

        // Assert
        var bizContacts = _context.spd_businesscontacts
            .Where(c => c._spd_organizationid_value == biz.accountid && c._spd_application_value == app.spd_applicationid)
            .ToList();
        Assert.Equal(5, bizContacts.Count());
        Assert.Equal(true, bizContacts.Any(c => c.spd_firstname == "newFirstName1")); //updated
        Assert.Equal(true, bizContacts.Any(c => c.spd_firstname == IntegrationTestSetup.DataPrefix + "firstName2" && c.statecode == DynamicsConstants.StateCode_Inactive)); //removed
        Assert.Equal(true, bizContacts.Any(c => c.spd_firstname == "newFirstName3" && c.statecode == DynamicsConstants.StateCode_Active));
        Assert.Equal(2, bizContacts.Count(c => c._spd_contactid_value == contact.contactid && c.statecode == DynamicsConstants.StateCode_Active));

        //Annihilate
        spd_businesscontact c3 = bizContacts.FirstOrDefault(c => c.spd_firstname == "newFirstName3");
        _context.DeleteObject(c3);
        _context.DeleteObject(bizContact);
        _context.DeleteObject(bizContact2);
        spd_businesscontact c4 = bizContacts.FirstOrDefault(c => c._spd_contactid_value == contact.contactid);
        _context.DeleteObject(c4);
        spd_businesscontact c5 = bizContacts.FirstOrDefault(c => c._spd_contactid_value == contact.contactid);
        _context.DeleteObject(c5);
        _context.DeleteObject(lic);
        _context.DeleteObject(contact);
        _context.DeleteObject(app);
        _context.DeleteObject(biz);
        await _context.SaveChangesAsync(CancellationToken.None);
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

    private async Task<spd_businesscontact> CreateBizContactAsync(account biz, spd_application app, string firstName, BizContactRoleOptionSet role)
    {
        spd_businesscontact bizContact = new();
        bizContact.spd_businesscontactid = Guid.NewGuid();
        bizContact.spd_firstname = IntegrationTestSetup.DataPrefix + firstName;
        bizContact.spd_role = (int)role;
        _context.AddTospd_businesscontacts(bizContact);
        _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
        _context.SetLink(bizContact, nameof(bizContact.spd_Application), app);
        return bizContact;
    }

    private async Task<contact> CreateContactAsync()
    {
        contact contact = new();
        contact.contactid = Guid.NewGuid();
        _context.AddTocontacts(contact);
        return contact;
    }

    private async Task<spd_licence> CreateLicenceAsync(contact c)
    {
        spd_licence lic = new();
        lic.spd_licenceid = Guid.NewGuid();
        _context.AddTospd_licences(lic);
        _context.SetLink(lic, nameof(lic.spd_LicenceHolder_contact), c);
        _context.SetLink(lic, nameof(lic.spd_LicenceType), _context.LookupServiceType(ServiceTypeEnum.SecurityWorkerLicence.ToString()));
        return lic;
    }
}