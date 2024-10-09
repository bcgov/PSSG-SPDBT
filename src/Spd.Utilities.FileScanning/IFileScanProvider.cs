namespace Spd.Utilities.FileScanning;

public interface IFileScanProvider
{
    Task<FileScanResult> ScanAsync(Stream stream, CancellationToken ct);
}

public record FileScanResult(ScanResult Result, string? Error = null);

public enum ScanResult
{
    Clean,
    NotClean,
    Error
}