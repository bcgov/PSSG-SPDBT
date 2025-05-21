namespace Spd.Resource.Repository.DogBase;
public interface IDogAppBaseRepository
{
    public Task CommitAppAsync(CommitAppCmd cmd, CancellationToken ct);
}

public record CommitAppCmd()
{
    public Guid LicenceAppId { get; set; }
}

