using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Contact;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class ContactRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IContactRepository _contactRepository;
    private DynamicsContext _context;

    public ContactRepositoryTest(IntegrationTestSetup testSetup)
    {
        _contactRepository = testSetup.ServiceProvider.GetService<IContactRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task MergeContacts_Run_Correctly()
    {
        //Arrange
        Guid oldContactId = Guid.NewGuid();
        contact oldContact = new() { contactid = oldContactId, firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(oldContact);
        Guid newContactId = Guid.NewGuid();
        contact newContact = new() { contactid = newContactId, firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(newContact);
        Guid oldContactLicId = Guid.NewGuid();
        spd_licence oldContactLic = new() { spd_licenceid = oldContactLicId };
        _context.AddTospd_licences(oldContactLic);
        _context.SetLink(oldContactLic, nameof(spd_licence.spd_LicenceHolder_contact), oldContact);
        await _context.SaveChangesAsync();

        try
        {
            //Act
            await _contactRepository.MergeContactsAsync(new MergeContactsCmd() { OldContactId = oldContactId, NewContactId = newContactId }, CancellationToken.None);

            //Assert
            contact? old = await _context.contacts.Where(c => c.contactid == oldContactId).FirstOrDefaultAsync();
            Assert.NotNull(old);
            Assert.Equal(1, old.statecode);
            spd_licence? oldLic = _context.spd_licences.Where(c => c.spd_licenceid == oldContactLicId).FirstOrDefault();
            Assert.NotNull(oldLic);
            Assert.Equal(newContactId, oldLic._spd_licenceholder_value);
        }
        finally
        {
            //Annihilate : When we have delete privilege, we need to do following
            _context.DeleteObject(oldContactLic);
            _context.DeleteObject(oldContact);
            _context.DeleteObject(newContact);
            await _context.SaveChangesAsync();
        }
    } */

    [Fact]
    public async Task QueryAsync_Run_Correctly()
    {
        //Arrange
        Guid contact1Id = Guid.NewGuid();
        contact contact1 = new()
        {
            contactid = contact1Id,
            firstname = IntegrationTestSetup.DataPrefix + "firstname_test",
            lastname = IntegrationTestSetup.DataPrefix + "lastname_test",
            spd_middlename1 = null,
            spd_middlename2 = IntegrationTestSetup.DataPrefix + "test",
            birthdate = new Microsoft.OData.Edm.Date(2024, 1, 1)
        };
        _context.AddTocontacts(contact1);
        Guid contact2Id = Guid.NewGuid();
        contact contact2 = new()
        {
            contactid = contact2Id,
            firstname = IntegrationTestSetup.DataPrefix + "firstname_test1",
            lastname = IntegrationTestSetup.DataPrefix + "lastname_test2",
            spd_middlename1 = "",
            spd_middlename2 = IntegrationTestSetup.DataPrefix + "test",
            birthdate = new Microsoft.OData.Edm.Date(2024, 1, 1)
        };
        _context.AddTocontacts(contact2);
        Guid identityId = Guid.NewGuid();
        spd_identity identity = new() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        _context.AddLink(contact2, nameof(contact.spd_contact_spd_identity), identity);
        await _context.SaveChangesAsync();

        //Act
        ContactQry qry = new()
        {
            FirstName = IntegrationTestSetup.DataPrefix + "firstname_test",
            LastName = IntegrationTestSetup.DataPrefix + "lastname_test",
            BirthDate = new DateOnly(2024, 1, 1),
        };
        ContactListResp result = await _contactRepository.QueryAsync(qry, CancellationToken.None);

        try
        {
            //Assert
            Assert.Equal(1, result.Items.Count());
            qry = new()
            {
                MiddleName2 = IntegrationTestSetup.DataPrefix + "test",
            };
            result = await _contactRepository.QueryAsync(qry, CancellationToken.None);
            Assert.Equal(2, result.Items.Count());
        }
        finally
        {
            //Annihilate : When we have delete privilege, we need to do following
            _context.DeleteObject(identity);
            _context.DeleteObject(contact1);
            _context.DeleteObject(contact2);
            await _context.SaveChangesAsync();
        }
    }
}