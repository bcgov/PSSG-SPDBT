using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Contact;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class ContactRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IContactRepository _repository;
    private DynamicsContext _context;

    public ContactRepositoryTest(IntegrationTestSetup testSetup)
    {
        _repository = testSetup.ServiceProvider.GetService<IContactRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().Create();
    }

    [Fact]
    public async Task MergeContacts_Run_Correctly()
    {
        //Arrange
        Guid oldContactId = Guid.NewGuid();
        contact oldContact = new contact() { contactid = oldContactId, firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(oldContact);
        Guid newContactId = Guid.NewGuid();
        contact newContact = new contact() { contactid = newContactId, firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(newContact);
        Guid oldContactLicId = Guid.NewGuid();
        spd_licence oldContactLic = new spd_licence() { spd_licenceid = oldContactLicId };
        _context.AddTospd_licences(oldContactLic);
        _context.SetLink(oldContactLic, nameof(spd_licence.spd_LicenceHolder_contact), oldContact);
        await _context.SaveChangesAsync();
        _context.DetachAll();

        //Act
        await _repository.MergeContactsAsync(new MergeContactsCmd() { OldContactId = oldContactId, NewContactId = newContactId }, CancellationToken.None);

        //Assert
        contact? old = await _context.contacts.Where(c => c.contactid == oldContactId).FirstOrDefaultAsync();
        Assert.NotNull(old);
        Assert.Equal(1, old.statecode);
        spd_licence? oldLic = _context.spd_licences.Where(c => c.spd_licenceid == oldContactLicId).FirstOrDefault();
        Assert.NotNull(oldLic);
        Assert.Equal(newContactId, oldLic._spd_licenceholder_value);

        //Annihilate : When we have delete privilege, we need to do following
        //_context.DeleteObject(oldContactLic);
        //_context.DeleteObject(oldContact);
        //_context.DeleteObject(newContact);
        //await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task CreateAlias_Run_Correctly()
    {
        contact contact = new contact() { contactid = Guid.NewGuid(), firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(contact);
        await _context.SaveChangesAsync();
        _context.DetachAll();

        Alias newAlias = new Alias()
        {
            Id = Guid.NewGuid(),
            GivenName = "test",
            Surname = "test"
        };

        CreateAliasCommand cmd = new CreateAliasCommand() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        await _repository.CreateAliasAsync(cmd, CancellationToken.None);

        spd_alias? alias = await _context.spd_aliases.Where(a => a.spd_aliasid == newAlias.Id).FirstOrDefaultAsync();
        Assert.NotNull(alias);
    }

    [Fact]
    public async Task DeleteAlias_Run_Correctly()
    {
        contact contact = new contact() { contactid = Guid.NewGuid(), firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(contact);
        await _context.SaveChangesAsync();
        _context.DetachAll();

        Alias newAlias = new Alias()
        {
            Id = Guid.NewGuid(),
            GivenName = "test",
            Surname = "test"
        };

        CreateAliasCommand cmd = new CreateAliasCommand() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        await _repository.CreateAliasAsync(cmd, CancellationToken.None);
        await _repository.DeleteAliasAsync((Guid)cmd.Alias.Id, CancellationToken.None);

        spd_alias? alias = await _context.spd_aliases.Where(a => a.spd_aliasid == newAlias.Id && a.statecode == DynamicsConstants.StateCode_Inactive).FirstOrDefaultAsync();
        Assert.NotNull(alias);
    }

    [Fact]
    public async Task UpdateAlias_Run_Correctly()
    {
        contact contact = new contact() { contactid = Guid.NewGuid(), firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(contact);
        await _context.SaveChangesAsync();
        _context.DetachAll();

        Alias newAlias = new Alias()
        {
            Id = Guid.NewGuid(),
            GivenName = "test",
            Surname = "test"
        };

        CreateAliasCommand cmd = new CreateAliasCommand() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        await _repository.CreateAliasAsync(cmd, CancellationToken.None);

        Alias aliasToUpdate = new Alias()
        {
            Id = (Guid)newAlias.Id,
            GivenName = "test2",
            Surname = "test2"
        };
        UpdateAliasCommand updateCmd = new UpdateAliasCommand()
        {
            Aliases = new List<Alias>() { aliasToUpdate }
        };

        await _repository.UpdateAliasAsync(updateCmd, CancellationToken.None);

        spd_alias? alias = await _context.spd_aliases
            .Where(a => a.spd_aliasid == newAlias.Id && a.spd_firstname == aliasToUpdate.GivenName && a.spd_surname == aliasToUpdate.Surname)
            .FirstOrDefaultAsync();
        Assert.NotNull(alias);
    }

    [Fact]
    public async Task UpdateAlias_AliasNotFound_Throw_Exception()
    {
        Alias aliasToUpdate = new Alias()
        {
            Id = Guid.NewGuid(),
            GivenName = "test2",
            Surname = "test2"
        };
        UpdateAliasCommand updateCmd = new UpdateAliasCommand()
        {
            Aliases = new List<Alias>() { aliasToUpdate }
        };

        _ = await Assert.ThrowsAsync<ArgumentException>(async () => await _repository.UpdateAliasAsync(updateCmd, CancellationToken.None));
    }
}