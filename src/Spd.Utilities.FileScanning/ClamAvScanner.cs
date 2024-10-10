using nClam;

namespace Spd.Utilities.FileScanning;

internal class ClamAvScanner(IClamClient clamClient) : IFileScanProvider
{
    public async Task<FileScanResult> ScanAsync(Stream stream, CancellationToken ct)
    {
        var results = await clamClient.SendAndScanFileAsync(stream, ct);

        return results.Result switch
        {
            ClamScanResults.Clean => new FileScanResult(ScanResult.Clean),
            ClamScanResults.VirusDetected => new FileScanResult(ScanResult.NotClean),
            _ => new FileScanResult(ScanResult.Error, results.RawResult),
        };
    }
}