using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Contact;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class ContactRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IContactRepository _contactRepository;
    private readonly IAliasRepository _aliasRepository;
    private DynamicsContext _context;

    public ContactRepositoryTest(IntegrationTestSetup testSetup)
    {
        _contactRepository = testSetup.ServiceProvider.GetService<IContactRepository>();
        _aliasRepository = testSetup.ServiceProvider.GetRequiredService<IAliasRepository>();
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
        await _contactRepository.MergeContactsAsync(new MergeContactsCmd() { OldContactId = oldContactId, NewContactId = newContactId }, CancellationToken.None);

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

        AliasResponse newAlias = new AliasResponse()
        {
            Id = Guid.NewGuid(),
            GivenName = "test",
            Surname = "test"
        };

        CreateAliasCommand cmd = new CreateAliasCommand() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        await _aliasRepository.CreateAliasAsync(cmd, CancellationToken.None);

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

        AliasResponse newAlias = new AliasResponse()
        {
            Id = Guid.NewGuid(),
            GivenName = "test",
            Surname = "test"
        };

        CreateAliasCommand cmd = new CreateAliasCommand() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        List<Guid?> aliasToRemove = new List<Guid?>() { cmd.Alias.Id };
        await _aliasRepository.CreateAliasAsync(cmd, CancellationToken.None);
        await _aliasRepository.DeleteAliasAsync(aliasToRemove, CancellationToken.None);

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

        AliasResponse newAlias = new AliasResponse()
        {
            Id = Guid.NewGuid(),
            GivenName = "test",
            Surname = "test"
        };

        CreateAliasCommand cmd = new CreateAliasCommand() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        await _aliasRepository.CreateAliasAsync(cmd, CancellationToken.None);

        AliasResponse aliasToUpdate = new AliasResponse()
        {
            Id = (Guid)newAlias.Id,
            GivenName = "test2",
            Surname = "test2"
        };
        UpdateAliasCommand updateCmd = new UpdateAliasCommand()
        {
            Aliases = new List<AliasResponse>() { aliasToUpdate }
        };

        await _aliasRepository.UpdateAliasAsync(updateCmd, CancellationToken.None);

        spd_alias? alias = await _context.spd_aliases
            .Where(a => a.spd_aliasid == aliasToUpdate.Id && a.spd_firstname == aliasToUpdate.GivenName && a.spd_surname == aliasToUpdate.Surname)
            .FirstOrDefaultAsync();
        Assert.NotNull(alias);
    }

    [Fact]
    public async Task UpdateAlias_AliasNotFound_Throw_Exception()
    {
        AliasResponse aliasToUpdate = new AliasResponse()
        {
            Id = Guid.NewGuid(),
            GivenName = "test2",
            Surname = "test2"
        };
        UpdateAliasCommand updateCmd = new UpdateAliasCommand()
        {
            Aliases = new List<AliasResponse>() { aliasToUpdate }
        };

        _ = await Assert.ThrowsAsync<ArgumentException>(async () => await _aliasRepository.UpdateAliasAsync(updateCmd, CancellationToken.None));
    }
}