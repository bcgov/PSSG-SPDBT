namespace Spd.Utilities.FileScanning;

internal class NoOpScanner : IFileScanProvider
{
    public async Task<FileScanResult> ScanAsync(Stream stream, CancellationToken ct)
    {
        return await Task.FromResult(new FileScanResult(ScanResult.Clean));
    }
}