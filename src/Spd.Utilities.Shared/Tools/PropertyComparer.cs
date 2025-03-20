using System.Collections.ObjectModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Xml.Linq;

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

        // Ignore these properties and just handle it in SecurityWorkerAppManager/PermitAppManager
        List<PropertyInfo> type1PropertiesFiltered = type1Properties.Where(prop => 
            prop.Name != "IsPoliceOrPeaceOfficer" && 
            prop.Name != "PoliceOfficerRoleCode" && 
            prop.Name != "OtherOfficerRole" &&
            prop.Name != "HasCriminalHistory" &&
            prop.Name != "CriminalChargeDescription" &&
            prop.Name != "EmployerPrimaryAddress").ToList();

        foreach (var prop1 in type1PropertiesFiltered)
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
                        var listName = prop1.Name;
                        switch (prop1.Name)
                        {
                            case "CategoryCodes":
                                listName = "category";
                                break;
                            case "PermitPurposeEnums":
                                listName = "purpose";
                                break; 
                        }

                        foreach (var item in missing)
                        {
                            var inputName = Regex.Replace(item.ToString()!, "([A-Z])", " $1").Trim();
                            differences.Add($"{inputName} {listName} has been removed");
                        }

                        foreach (var item in added)
                        {
                            var inputName = Regex.Replace(item.ToString()!, "([A-Z])", " $1").Trim();
                            differences.Add($"{inputName} {listName} has been added");
                        }
                    }
                }
                else if (!Equals(value1, value2))
                {
                    value1 = GetDisplayValue(value1);
                    value2 = GetDisplayValue(value2);
                    var inputName = Regex.Replace(prop1.Name, "([A-Z])", " $1").Trim();
                    differences.Add($"{inputName} has been updated from {value1} to {value2}");
                }
            }
        }

        return new Collection<string>(differences);
    }

    private static string GetDisplayValue(object? value)
    {
        if (value != null)
        {
            var valueStr = value.ToString();
            if (valueStr == "False") return "No";
            else if (valueStr == "True") return "Yes";
            else return valueStr!;

        }
        return "blank";
    }
}
