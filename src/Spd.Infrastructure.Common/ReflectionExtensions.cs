using System.Reflection;

namespace Spd.Infrastructure.Common
{
    public static class ReflectionExtensions
    {
        public static async Task<string> GetManifestResourceString(this Assembly assembly, string manifestName)
        {
            using (var stream = assembly.GetManifestResourceStream(manifestName))
            {
                using (var reader = new StreamReader(stream))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }

        public static Type[] GetTypesImplementing<I>(this Assembly assembly) => GetTypesImplementing(assembly, typeof(I));

        public static Type[] GetTypesImplementing(this Assembly assembly, Type type) =>
         assembly.DefinedTypes.Where(t => t.IsClass && !t.IsAbstract && t.IsPublic && (type.IsAssignableFrom(t) || t.IsAssignableToGenericType(type))).ToArray();

        public static I[] CreateInstancesOf<I>(this Assembly assembly) =>
            assembly.GetTypesImplementing<I>().Select(t => (I)Activator.CreateInstance(t)).ToArray();

        public static bool IsAssignableTo(this Type sourceType, Type destinationType, bool checkPolymorphicAssignability = false)
        {
            if (sourceType == typeof(object)) return false;
            return destinationType.IsAssignableFrom(sourceType) || (checkPolymorphicAssignability && sourceType.BaseType.IsAssignableTo(destinationType));
        }

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

            Type baseType = type.BaseType;
            if (baseType == null) return false;

            return baseType.IsAssignableToGenericType(genericType);
        }

        public static async Task<object?> InvokeAsync(this MethodInfo method, object obj, params object[] parameters)
        {
            var task = (Task)(method.Invoke(obj, parameters) ?? null!);
            await task.ConfigureAwait(false);
            return method.ReturnType.IsGenericType
                ? task.GetType().GetProperty("Result")?.GetValue(task)
                : null;
        }

        private static string[] excludedAssemblyPrefixes = new[] { "System.", "Microsoft." };
        private static string[] assemblyFileExtensions = new[] { "*.dll" };

        public static Assembly[] DiscoverLocalAessemblies(string? directory = null, string? prefix = null)
        {
            if (string.IsNullOrEmpty(directory)) directory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var exclusedPrefixes = prefix != null ? excludedAssemblyPrefixes.Append(prefix).ToArray() : excludedAssemblyPrefixes;

            return assemblyFileExtensions.SelectMany(ext => Directory.GetFiles(directory, ext, SearchOption.TopDirectoryOnly))
                .Where(file => !exclusedPrefixes.Any(prefix => Path.GetFileName(file).StartsWith(prefix)))
                .Select(file => Assembly.Load(AssemblyName.GetAssemblyName(file)))
                .ToArray();
        }
    }
}
