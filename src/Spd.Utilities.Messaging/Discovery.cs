using Spd.Infrastructure.Common;
using Spd.Utilities.Messaging.Contract;
using Spd.Utility.Messaging;
using System.Reflection;

namespace Spd.Utilities.Messaging
{
    internal static class Discovery
    {
        public static void RegisterInternalHandlers()
        {
            var assemblies = ReflectionExtensions.DiscoverLocalAessemblies();

            var commands = assemblies.SelectMany(a => a.GetTypesImplementing<Command>()).ToArray();
            var queries = assemblies.SelectMany(a => a.GetTypesImplementing(typeof(Query<>))).ToArray();
            var events = assemblies.SelectMany(a => a.GetTypesImplementing<Event>()).ToArray();

            var allHandlers = assemblies.SelectMany(a =>
                   a.DefinedTypes
                       .Where(t => t.IsClass)
                       .SelectMany(t => t.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly).Where(m => !m.IsSpecialName && m.Name.Equals("Handle"))
                   )).ToArray();

            foreach (var cmd in commands)
            {
                var handlers = allHandlers.Where(m =>
                {
                    var parameters = m.GetParameters();
                    if (parameters.Length != 2) return false;
                    return cmd.IsAssignableTo(parameters[0].ParameterType, true);
                }).ToArray();
                if (handlers.Length > 1) throw new InvalidOperationException($"{cmd.Name}: expected a single command handler but found {handlers.Length}");

                if (handlers.Any()) Routing.Register(cmd, new InternalRouteInfo(handlers[0]));
            }

            foreach (var query in queries)
            {
                var handlers = allHandlers.Where(m =>
                {
                    var parameters = m.GetParameters();
                    if (parameters.Length != 2) return false;
                    return query.IsAssignableTo(parameters[0].ParameterType, true);
                }).ToArray();
                if (handlers.Length > 1) throw new InvalidOperationException($"{query.Name}: expected a single query handler but found {handlers.Length}");

                if (handlers.Any()) Routing.Register(query, new InternalRouteInfo(handlers[0]));
            }

            foreach (var evt in events)
            {
                var handlers = allHandlers.Where(m =>
                {
                    var parameters = m.GetParameters();
                    if (parameters.Length != 2) return false;
                    return evt.IsAssignableTo(parameters[0].ParameterType, true);
                }).ToArray();

                foreach (var handler in handlers) Routing.Register(evt, new InternalRouteInfo(handler));
            }
        }
    }
}
