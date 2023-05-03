using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Cache;

namespace Spd.Utilities.TempFileStorage;
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

    public async Task<TempFile?> HandleQuery(TempFileQuery query, CancellationToken cancellationToken)
    {
        return query switch
        {
            GetTempFileQuery q => await GetTempFile(q.FileKey, cancellationToken),
            _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
        };
    }

    private async Task<string> SaveTempFile(SaveTempFileCommand cmd, CancellationToken ct)
    {
        string fileKey = $"file-{Guid.NewGuid()}";
        using var ms = new MemoryStream();
        await cmd.File.CopyToAsync(ms, ct);
        TempFile file = new()
        {
            Content = ms.ToArray(),
            FileName = cmd.File.FileName,
            ContentType = cmd.File.ContentType,
        };
        await _cache.Set<TempFile>(fileKey, file, new TimeSpan(0, 20, 0)); //20 mins
        return fileKey;
    }

    private async Task<TempFile?> GetTempFile(string fileKey, CancellationToken ct)
    {
        return await _cache.Get<TempFile>(fileKey); 
    }
}
