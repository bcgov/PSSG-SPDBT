using Microsoft.AspNetCore.Http;

namespace Spd.Utilities.TempFileStorage;
public interface ITempFileStorageService
{
    Task<string> HandleCommand(TempFileCommand cmd, CancellationToken cancellationToken);
    Task<byte[]?> HandleQuery(TempFileQuery query, CancellationToken cancellationToken);
}

public abstract record TempFileCommand;
public record SaveTempFileCommand(IFormFile File) : TempFileCommand;

public abstract record TempFileQuery;
public record GetTempFileQuery(string FileKey) : TempFileQuery;
