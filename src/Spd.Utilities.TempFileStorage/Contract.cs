using Microsoft.AspNetCore.Http;

namespace Spd.Utilities.TempFileStorage;
public interface ITempFileStorageService
{
    Task<string> HandleCommand(TempFileCommand cmd, CancellationToken cancellationToken);
    Task<TempFile?> HandleQuery(TempFileQuery query, CancellationToken cancellationToken);
}

public abstract record TempFileCommand;
public record SaveTempFileCommand(IFormFile File) : TempFileCommand;

public abstract record TempFileQuery;
public record GetTempFileQuery(string FileKey) : TempFileQuery;

public record TempFile
{
    public byte[] Content { get; set; } = Array.Empty<byte>();
    public string? ContentType { get; set; }
    public string? FileName { get; set; }
}