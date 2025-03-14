using System.Collections.ObjectModel;
using System.Reflection;

namespace Spd.Utilities.Shared.Tools;
public static class PropertyComparer
{
    public static Collection<string> GetPropertyDifferences<T1, T2>(T1 obj1, T2 obj2)
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

                if (!Equals(value1, value2))
                {
                    differences.Add($"{prop1.Name}: change from {value1} to {value2}");
                }
            }
        }

        return new Collection<string>(differences);
    }
}
