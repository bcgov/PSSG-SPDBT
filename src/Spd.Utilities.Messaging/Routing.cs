using Spd.Infrastructure.Common;
using System.Collections.Concurrent;
using System.Reflection;

namespace Spd.Utility.Messaging
{
    internal static class Routing
    {
        private static ConcurrentDictionary<Type, RouteInfo[]> routeMap = new();

        public static RouteInfo[] Resolve(Type type)
        {
            if (type == typeof(object)) return Array.Empty<RouteInfo>();
            return routeMap.GetValueOrDefault(type) ?? Resolve(type.BaseType);
        }

        public static void Register(Type type, RouteInfo routeInfo)
        {
            routeMap.AddOrUpdate(type, new[] { routeInfo }, (t, routes) => routes.Append(routeInfo).ToArray());
        }
    }

    internal abstract record RouteInfo
    {
        public abstract Task<object?> Invoke(object message, AppExecutionContext ctx);
    }

    internal record InternalRouteInfo : RouteInfo
    {
        public readonly MethodInfo Method;

        public InternalRouteInfo(MethodInfo method)
        {
            Method = method;
        }

        public override async Task<object?> Invoke(object message, AppExecutionContext ctx)
        {
            var obj = Activator.CreateInstance(Method.DeclaringType);
            return await Method.InvokeAsync(obj, message, ctx);
        }
    }

    internal record ExternalRouteInfo : RouteInfo
    {
        public override Task<object?> Invoke(object message, AppExecutionContext ctx)
        {
            throw new NotImplementedException();
        }
    }
}