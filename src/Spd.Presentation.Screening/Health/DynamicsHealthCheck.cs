using Microsoft.Extensions.Diagnostics.HealthChecks;
using Spd.Utilities.Dynamics;

namespace Spd.Presentation.Screening.Health;

public class DynamicsHealthCheck : IHealthCheck
{
    private readonly DynamicsContext _context;

    public DynamicsHealthCheck(IDynamicsContextFactory factory)
    {
        _context = factory.CreateReadOnly();
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var account = _context.accounts.First();
            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(exception: ex);
        }
    }
}
