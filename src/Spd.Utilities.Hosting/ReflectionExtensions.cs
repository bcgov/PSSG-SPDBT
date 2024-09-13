using System.Reflection;

namespace Spd.Utilities.Hosting
{
    public static class ReflectionExtensions
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

        private static string[] defaultExcludedAssemblyPrefixes = ["System.", "Microsoft."];
        private static string[] assemblyFileExtensions = ["*.dll"];

        /// <summary>
        /// Discovers all local assemblies in a folder
        /// </summary>
        /// <param name="directory">Optional directory, defaults to the current executing directory</param>
        /// <param name="prefix">Optional prefix of assembly names to include in the discovery</param>
        /// <returns>array of </returns>
        /// <exception cref="InvalidOperationException"></exception>
        public static Assembly[] DiscoverLocalAessemblies(string? directory = null, string? prefix = null)
        {
            directory ??= Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? throw new InvalidOperationException("Can't determine local assembly directory");
            var excludedPrefixes = defaultExcludedAssemblyPrefixes.AsEnumerable();
            var includedPrefixes = prefix == null ? Enumerable.Empty<string>() : new[] { prefix };

            return assemblyFileExtensions.SelectMany(ext => Directory.GetFiles(directory, ext, SearchOption.TopDirectoryOnly))
                .Where(file => !excludedPrefixes.Any(prefix => Path.GetFileName(file).StartsWith(prefix)) && (!includedPrefixes.Any() || includedPrefixes.Any(prefix => Path.GetFileName(file).StartsWith(prefix))))
                .Select(file => Assembly.Load(AssemblyName.GetAssemblyName(file)))
                .ToArray();
        }
    }
}