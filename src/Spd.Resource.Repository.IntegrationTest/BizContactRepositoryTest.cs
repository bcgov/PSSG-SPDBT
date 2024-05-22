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
        //create account
        account biz = new();
        biz.name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}";
        biz.accountid = Guid.NewGuid();
        _context.AddToaccounts(biz);
        //create application
        spd_application app = new();
        app.spd_applicationid = Guid.NewGuid();
        _context.AddTospd_applications(app);
        _context.SetLink(app, nameof(app.spd_OrganizationId), biz);
        await _context.SaveChangesAsync(CancellationToken.None);
        //create biz contact
        spd_businesscontact bizContact = new();
        bizContact.spd_businesscontactid = Guid.NewGuid();
        bizContact.spd_firstname = IntegrationTestSetup.DataPrefix + "firstname";
        bizContact.spd_role = (int)BizContactRoleOptionSet.ControllingMember;
        _context.AddTospd_businesscontacts(bizContact);
        _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
        _context.SetLink(bizContact, nameof(bizContact.spd_Application), app);
        spd_businesscontact bizContact2 = new();
        bizContact2.spd_businesscontactid = Guid.NewGuid();
        bizContact2.spd_firstname = IntegrationTestSetup.DataPrefix + "firstname2";
        bizContact2.spd_role = (int)BizContactRoleOptionSet.Employee;
        _context.AddTospd_businesscontacts(bizContact2);
        _context.SetLink(bizContact2, nameof(bizContact.spd_OrganizationId), biz);
        _context.SetLink(bizContact2, nameof(bizContact.spd_Application), app);
        await _context.SaveChangesAsync(CancellationToken.None);

        BizContactQry qry = new(biz.accountid, app.spd_applicationid);

        // Action
        var response = await _bizContactRepo.GetBizAppContactsAsync(qry, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(2, response.Count());
        Assert.Equal(true, response.Any(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstname"));
        Assert.Equal(true, response.Any(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstname2"));
        Assert.Equal(BizContactRoleEnum.ControllingMember, response.Where(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstname").FirstOrDefault().BizContactRoleCode);
        Assert.Equal(BizContactRoleEnum.Employee, response.Where(r => r.GivenName == IntegrationTestSetup.DataPrefix + "firstname2").FirstOrDefault().BizContactRoleCode);

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
        account biz = new();
        biz.name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}";
        biz.accountid = Guid.NewGuid();
        _context.AddToaccounts(biz);
        //create application
        spd_application app = new();
        app.spd_applicationid = Guid.NewGuid();
        _context.AddTospd_applications(app);
        _context.SetLink(app, nameof(app.spd_OrganizationId), biz);
        await _context.SaveChangesAsync(CancellationToken.None);

        BizContactUpsertCmd cmd = new(biz.accountid, app.spd_applicationid, new List<BizContactResp>());

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
        //create account
        account biz = new();
        biz.name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}";
        biz.accountid = Guid.NewGuid();
        _context.AddToaccounts(biz);
        //create application
        spd_application app = new();
        app.spd_applicationid = Guid.NewGuid();
        _context.AddTospd_applications(app);
        _context.SetLink(app, nameof(app.spd_OrganizationId), biz);
        //create biz contact
        spd_businesscontact bizContact = new();
        bizContact.spd_businesscontactid = Guid.NewGuid();
        bizContact.spd_firstname = IntegrationTestSetup.DataPrefix + "firstname";
        bizContact.spd_role = (int)BizContactRoleOptionSet.ControllingMember;
        _context.AddTospd_businesscontacts(bizContact);
        _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
        _context.SetLink(bizContact, nameof(bizContact.spd_Application), app);
        spd_businesscontact bizContact2 = new();
        bizContact2.spd_businesscontactid = Guid.NewGuid();
        bizContact2.spd_firstname = IntegrationTestSetup.DataPrefix + "firstname2";
        bizContact2.spd_role = (int)BizContactRoleOptionSet.Employee;
        _context.AddTospd_businesscontacts(bizContact2);
        _context.SetLink(bizContact2, nameof(bizContact.spd_OrganizationId), biz);
        _context.SetLink(bizContact2, nameof(bizContact.spd_Application), app);

        await _context.SaveChangesAsync(CancellationToken.None);

        BizContactUpsertCmd cmd = new(biz.accountid, app.spd_applicationid, new List<BizContactResp>());

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
}