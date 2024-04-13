using Microsoft.Extensions.Diagnostics.HealthChecks;
using Spd.Utilities.FileStorage;

namespace Spd.Presentation.Screening.Health;

public class FileStorageHealthCheck : IHealthCheck
{
    private readonly IMainFileStorageService service;

    public FileStorageHealthCheck(IMainFileStorageService service)
    {
        this.service = service;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await service.HandleQuery(new FileMetadataQuery() { Key = Guid.NewGuid().ToString() }, cancellationToken);
            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Degraded(exception: ex);
        }
    }
}
