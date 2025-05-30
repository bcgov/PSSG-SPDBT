using System.Threading.Channels;

namespace Spd.Presentation.Dynamics.Services;
public interface IScheduleJobQueue
{
    void Enqueue(Guid sessionId, int concurrentRequests, int delayInMilliSec);
    bool TryDequeue(out (Guid sessionId, int concurrentRequests, int delayInMilliSec) job);
    ChannelReader<(Guid sessionId, int concurrentRequests, int delayInMilliSec)> Reader { get; }
}
