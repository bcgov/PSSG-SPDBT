using System.Threading.Channels;

namespace Spd.Presentation.Dynamics.Services;
public interface IScheduleJobQueue
{
    void Enqueue(Guid sessionId, int concurrentRequests);
    bool TryDequeue(out (Guid sessionId, int concurrentRequests) job);
    ChannelReader<(Guid sessionId, int concurrentRequests)> Reader { get; }
}
