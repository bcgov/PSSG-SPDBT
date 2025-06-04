using System.Threading.Channels;

namespace Spd.Presentation.Dynamics.Services;
public class ScheduleJobQueue : IScheduleJobQueue
{
    private readonly Channel<(Guid, int, int)> _channel = Channel.CreateUnbounded<(Guid, int, int)>();

    public void Enqueue(Guid sessionId, int concurrentRequests, int delayInMilliSec)
    {
        _channel.Writer.TryWrite((sessionId, concurrentRequests, delayInMilliSec));
    }

    public bool TryDequeue(out (Guid sessionId, int concurrentRequests, int delayInMilliSec) job)
    {
        var reader = _channel.Reader;
        if (reader.TryRead(out var result))
        {
            job = result;
            return true;
        }

        job = default;
        return false;
    }

    public ChannelReader<(Guid, int, int)> Reader => _channel.Reader;
}
