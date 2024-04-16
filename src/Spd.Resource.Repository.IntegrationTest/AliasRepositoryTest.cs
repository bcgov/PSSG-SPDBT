using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Alias;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class AliasRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IAliasRepository _aliasRepository;
    private DynamicsContext _context;

    public AliasRepositoryTest(IntegrationTestSetup testSetup)
    {
        _aliasRepository = testSetup.ServiceProvider.GetRequiredService<IAliasRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    [Fact]
    public async Task CreateAlias_Run_Correctly()
    {
        //Arrange
        contact contact = new() { contactid = Guid.NewGuid(), firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(contact);
        await _context.SaveChangesAsync();
        AliasResp newAlias = new()
        {
            GivenName = IntegrationTestSetup.DataPrefix + "test",
            Surname = IntegrationTestSetup.DataPrefix + "test"
        };
        CreateAliasCommand cmd = new() { ContactId = (Guid)contact.contactid, Alias = newAlias };

        //Action
        Guid? aliasId = await _aliasRepository.CreateAliasAsync(cmd, CancellationToken.None);

        //Assert
        Assert.NotNull(aliasId);
        spd_alias? alias = await _context.spd_aliases.Where(a => a.spd_aliasid == aliasId).FirstOrDefaultAsync();
        Assert.NotNull(alias);
    }

    [Fact]
    public async Task DeleteAlias_Run_Correctly()
    {
        //Arrange
        contact contact = new() { contactid = Guid.NewGuid(), firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(contact);
        await _context.SaveChangesAsync();
        AliasResp newAlias = new()
        {
            GivenName = IntegrationTestSetup.DataPrefix + "test",
            Surname = IntegrationTestSetup.DataPrefix + "test"
        };

        CreateAliasCommand cmd = new() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        Guid? newAliasId = await _aliasRepository.CreateAliasAsync(cmd, CancellationToken.None);
        List<Guid?> aliasToRemove = new() { newAliasId };

        //Action
        await _aliasRepository.DeleteAliasAsync(aliasToRemove, CancellationToken.None);

        //Assert
        spd_alias? alias = await _context.spd_aliases.Where(a => a.spd_aliasid == newAliasId && a.statecode == DynamicsConstants.StateCode_Inactive).FirstOrDefaultAsync();
        Assert.NotNull(alias);
    }

    [Fact]
    public async Task UpdateAlias_Run_Correctly()
    {
        contact contact = new() { contactid = Guid.NewGuid(), firstname = IntegrationTestSetup.DataPrefix + "firstname", lastname = IntegrationTestSetup.DataPrefix + "lastname" };
        _context.AddTocontacts(contact);
        await _context.SaveChangesAsync();
        _context.DetachAll();

        AliasResp newAlias = new()
        {
            GivenName = IntegrationTestSetup.DataPrefix + "test",
            Surname = IntegrationTestSetup.DataPrefix + "test"
        };

        CreateAliasCommand cmd = new() { ContactId = (Guid)contact.contactid, Alias = newAlias };
        Guid? newAliasId = await _aliasRepository.CreateAliasAsync(cmd, CancellationToken.None);

        AliasResp aliasToUpdate = new()
        {
            Id = (Guid)newAliasId,
            GivenName = "test2",
            Surname = "test2"
        };
        UpdateAliasCommand updateCmd = new()
        {
            Aliases = new List<AliasResp>() { aliasToUpdate }
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
        AliasResp aliasToUpdate = new()
        {
            Id = Guid.NewGuid(),
            GivenName = "test2",
            Surname = "test2"
        };
        UpdateAliasCommand updateCmd = new()
        {
            Aliases = new List<AliasResp>() { aliasToUpdate }
        };

        _ = await Assert.ThrowsAsync<ArgumentException>(async () => await _aliasRepository.UpdateAliasAsync(updateCmd, CancellationToken.None));
    }
}