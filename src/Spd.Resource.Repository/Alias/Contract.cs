using MediatR;

namespace Spd.Resource.Repository.Alias;
public interface IAliasRepository
{
    public Task<Unit> CreateAliasAsync(CreateAliasCommand cmd, CancellationToken cancellationToken);
    public Task DeleteAliasAsync(Guid aliasId, CancellationToken cancellationToken);
    public Task UpdateAliasAsync(UpdateAliasCommand cmd, CancellationToken cancellationToken);
}

public record CreateAliasCommand
{
    public Guid ContactId { get; set; }
    public Alias Alias { get; set; }
};
public record UpdateAliasCommand
{
    public IEnumerable<Alias> Aliases { get; set; } = [];
}
