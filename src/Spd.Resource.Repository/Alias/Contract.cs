using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Alias;
public interface IAliasRepository
{
    public Task CreateAliasAsync(CreateAliasCommand cmd, CancellationToken cancellationToken);
    public Task DeleteAliasAsync(List<Guid?> aliasIds, CancellationToken cancellationToken);
    public Task UpdateAliasAsync(UpdateAliasCommand cmd, CancellationToken cancellationToken);
}

public record AliasResponse
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
    public AliasResponse Alias { get; set; }
};

public record UpdateAliasCommand
{
    public IEnumerable<AliasResponse> Aliases { get; set; } = [];
}
