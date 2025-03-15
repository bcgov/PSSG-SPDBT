using System.Collections.ObjectModel;
using System.Reflection;

namespace Spd.Utilities.Shared.Tools;
public static class PropertyComparer
{
    public static Collection<string> GetPropertyDifferences<T1, T2>(T1 obj1, T2 obj2)
            where T1 : class
            where T2 : class
    {
        if (obj1 == null || obj2 == null)
            throw new ArgumentException("Both objects must be non-null");

        var type1Properties = typeof(T1).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var type2Properties = typeof(T2).GetProperties(BindingFlags.Public | BindingFlags.Instance);

        var differences = new List<string>();

        foreach (var prop1 in type1Properties)
        {
            var prop2 = type2Properties.FirstOrDefault(p => p.Name == prop1.Name && p.PropertyType == prop1.PropertyType);
            if (prop2 != null)
            {
                var value1 = prop1.GetValue(obj1);
                var value2 = prop2.GetValue(obj2);

                if (value1 is Array array1 && value2 is Array array2)
                {
                    // Handle array comparison
                    var missing = array1.Cast<object>().Except(array2.Cast<object>()).ToList();
                    var added = array2.Cast<object>().Except(array1.Cast<object>()).ToList();

                    if (missing.Count > 0 || added.Count > 0)
                    {
                        differences.Add($"{prop1.Name}:");
                        if (missing.Count > 0) differences.Add($" Removed: {string.Join(", ", missing)}");
                        if (added.Count > 0) differences.Add($" Added: {string.Join(", ", added)}");
                    }
                }
                else if (!Equals(value1, value2))
                {
                    value1 = value1 ?? "Empty";
                    value2 = value2 ?? "Empty";
                    differences.Add($"{prop1.Name}: change from {value1} to {value2}");
                }
            }
        }

        return new Collection<string>(differences);
    }
}
