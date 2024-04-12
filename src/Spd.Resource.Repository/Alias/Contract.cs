using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Alias;
public interface IAliasRepository
{
    public Task CreateAliasAsync(CreateAliasCommand cmd, CancellationToken cancellationToken);
    public Task DeleteAliasAsync(List<Guid?> aliasIds, CancellationToken cancellationToken);
    public Task UpdateAliasAsync(UpdateAliasCommand cmd, CancellationToken cancellationToken);
}

public record AliasResp
{
    public Guid? Id { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
}

public record CreateAliasCommand
{
    public Guid ContactId { get; set; }
    public AliasResp Alias { get; set; }
};

public record UpdateAliasCommand
{
    public IEnumerable<AliasResp> Aliases { get; set; } = [];
}
