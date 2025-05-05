using MediatR;

namespace Spd.Manager.ScheduleJob
{
    public interface IScheduleJobManager
    {
        public Task<Unit> Handle(RunScheduleJobSessionCommand command, CancellationToken ct);
        public Task<Unit> Handle(RunMonthlyInvoiceJobCommand command, CancellationToken ct);
    }

    #region run schedule job session
    public record RunScheduleJobSessionCommand(Guid JobSessionId, int ConcurrentRequests = 3) : IRequest<Unit>;
    public record RunMonthlyInvoiceJobCommand(Guid JobSessionId, int ConcurrentRequests = 3) : IRequest<Unit>;
    #endregion
}
