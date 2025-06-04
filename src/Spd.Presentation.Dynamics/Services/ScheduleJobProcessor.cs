using MediatR;
using Spd.Manager.ScheduleJob;

namespace Spd.Presentation.Dynamics.Services;
// ScheduleJobProcessor.cs
public class ScheduleJobProcessor : BackgroundService
{
    private readonly ILogger<ScheduleJobProcessor> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IScheduleJobQueue _queue;

    public ScheduleJobProcessor(
        IScheduleJobQueue queue,
        IServiceScopeFactory scopeFactory,
        ILogger<ScheduleJobProcessor> logger)
    {
        _queue = queue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var (sessionId, concurrentRequests, delayInMilliSec) in _queue.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                _logger.LogInformation("Starting background job for session {SessionId}", sessionId);

                using var scope = _scopeFactory.CreateScope();
                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

                using var cts = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
                await mediator.Send(new RunScheduleJobSessionCommand(sessionId, concurrentRequests, delayInMilliSec), cts.Token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process schedule job session");
            }
        }
    }
}
