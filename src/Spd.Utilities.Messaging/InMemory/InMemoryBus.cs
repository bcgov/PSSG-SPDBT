using Spd.Infrastructure.Common;
using Spd.Utilities.Messaging.Contract;
using Spd.Utility.Messaging;

namespace Spd.Utilities.Messaging.InMemory
{
    internal class InMemoryBus : IBus
    {
        public async Task Publish(Event evt)
        {
            var ctx = AppExecutionContext.Current;
            var routes = Routing.Resolve(evt.GetType());
            foreach (var route in routes)
            {
                await route.Invoke(evt, ctx);
            }
        }

        public async Task<T> Send<T>(Query<T> query) where T : notnull
        {
            var ctx = AppExecutionContext.Current;
            var routes = Routing.Resolve(query.GetType());
            if (!routes.Any()) throw new InvalidOperationException($"No handler found for {query.GetType().Name}");
            var result = (T?)await routes[0].Invoke(query, ctx);
            if (result == null) throw new InvalidOperationException($"received null result for query");
            return result;
        }

        public async Task<string> Send(Command cmd)
        {
            var ctx = AppExecutionContext.Current;
            var routes = Routing.Resolve(cmd.GetType());
            if (!routes.Any()) throw new InvalidOperationException($"No handler found for {cmd.GetType().Name}");
            var result = (string?)await routes[0].Invoke(cmd, ctx);
            if (result == null) throw new InvalidOperationException($"received null result for command");
            return result;
        }
    }
}
