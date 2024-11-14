using Microsoft.Extensions.Caching.Distributed;

namespace Spd.Utilities.FileStorage;

internal class TempFileStorageService : ITempFileStorageService
{
    public IDistributedCache _cache;

    public TempFileStorageService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<string> HandleCommand(TempFileCommand cmd, CancellationToken cancellationToken)
    {
        return cmd switch
        {
            SaveTempFileCommand c => await SaveTempFile(c, cancellationToken),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    public async Task<byte[]?> HandleQuery(TempFileQuery query, CancellationToken cancellationToken)
    {
        return query switch
        {
            GetTempFileQuery q => await GetTempFile(q.FileKey, cancellationToken),
            _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
        };
    }

    private async Task<string> SaveTempFile(SaveTempFileCommand cmd, CancellationToken ct)
    {
        var fileKey = $"file-{Guid.NewGuid()}";
        await _cache.SetAsync(fileKey, cmd.Content, new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = new TimeSpan(0, 10, 0) }, ct); //10 mins
        return fileKey;
    }

    private async Task<byte[]?> GetTempFile(string fileKey, CancellationToken ct)
    {
        return await _cache.GetAsync(fileKey, ct);
    }
}