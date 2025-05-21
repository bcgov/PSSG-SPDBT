using System.Threading.Channels;

namespace Spd.Presentation.Dynamics.Services;
public class ScheduleJobQueue : IScheduleJobQueue
{
    private readonly Channel<(Guid, int)> _channel = Channel.CreateUnbounded<(Guid, int)>();

    public void Enqueue(Guid sessionId, int concurrentRequests)
    {
        _channel.Writer.TryWrite((sessionId, concurrentRequests));
    }

    public bool TryDequeue(out (Guid sessionId, int concurrentRequests) job)
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

    public ChannelReader<(Guid, int)> Reader => _channel.Reader;
}
