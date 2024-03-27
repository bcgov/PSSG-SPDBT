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
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
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
}