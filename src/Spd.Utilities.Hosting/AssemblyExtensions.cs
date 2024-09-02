using System.Reflection;

namespace Spd.Utilities.Hosting
{
    public static class AssemblyExtensions
    {
        public static async Task<string> GetManifestResourceString(this Assembly assembly, string manifestName)
        {
            using (var stream = assembly.GetManifestResourceStream(manifestName)!)
            {
                using (var reader = new StreamReader(stream))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }

        public static Type[] Discover<TInterface>(this Assembly assembly) =>
         assembly.DefinedTypes.Where(t => t.IsClass && !t.IsAbstract && t.IsPublic && typeof(TInterface).IsAssignableFrom(t)).ToArray();

        public static TInterface[] CreateInstancesOf<TInterface>(this Assembly assembly) =>
            assembly.Discover<TInterface>().Select(t => (TInterface)Activator.CreateInstance(t)!).ToArray();

        public static bool IsAssignableToGenericType(this Type type, Type genericType)
        {
            var interfaceTypes = type.GetInterfaces();

            foreach (var it in interfaceTypes)
            {
                if (it.IsGenericType && it.GetGenericTypeDefinition() == genericType)
                    return true;
            }

            if (type.IsGenericType && type.GetGenericTypeDefinition() == genericType)
                return true;

            var baseType = type.BaseType;
            if (baseType == null) return false;

            return IsAssignableToGenericType(baseType, genericType);
        }
    }
}