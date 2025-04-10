using MediatR;

namespace Spd.Manager.ScheduleJob
{
    public interface IScheduleJobManager
    {
        public Task<Unit> Handle(RunScheduleJobSessionCommand command, CancellationToken ct);
    }

    #region run schedule job session
    public record RunScheduleJobSessionCommand(Guid JobSessionId) : IRequest<Unit>;
    #endregion
}
