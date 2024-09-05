using System.ComponentModel;

namespace Spd.Utilities.Shared.Tools;

public static class EnumHelper
{
    public static string GetDescription(this Enum enumValue)
    {
        var field = enumValue.GetType().GetField(enumValue.ToString());
        if (field != null && Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) is DescriptionAttribute attribute)
        {
            return attribute.Description;
        }
        throw new ArgumentException("Item not found.", nameof(enumValue));
    }

    public static T GetValueByDescription<T>(this string description) where T : Enum
    {
        foreach (Enum enumItem in Enum.GetValues(typeof(T)))
        {
            if (enumItem.GetDescription() == description)
            {
                return (T)enumItem;
            }
        }
        throw new ArgumentException("Not found.", nameof(description));
    }

    public static TDestinationEnum? ConvertEnum<TSourceEnum, TDestinationEnum>(this TSourceEnum? value)
     where TSourceEnum : struct
     where TDestinationEnum : struct
     => value == null
        ? null
        : Enum.Parse<TDestinationEnum>(value.ToString()!);

    public static TDestinationEnum ConvertEnum<TSourceEnum, TDestinationEnum>(this TSourceEnum? value, TDestinationEnum defaultValue)
     where TSourceEnum : struct
     where TDestinationEnum : struct
     => value == null
        ? defaultValue
        : Enum.Parse<TDestinationEnum>(value.ToString()!);

    public static TDestinationEnum? ConvertEnum<TSourceEnum, TDestinationEnum>(this int? value)
        where TSourceEnum : struct
        where TDestinationEnum : struct
        => value == null
        ? null
        : Enum.Parse<TDestinationEnum>(Enum.GetName(typeof(TSourceEnum), value) ?? throw new ArgumentException($"Value {value} not found in enum {typeof(TSourceEnum).FullName}", nameof(value)));
}