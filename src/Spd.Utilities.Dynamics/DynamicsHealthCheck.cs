using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Spd.Utilities.Dynamics;

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
            await _context.contacts.FirstOrDefaultAsync(cancellationToken);
            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(exception: ex);
        }
    }
}