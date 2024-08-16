using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.Printing;
internal sealed class BCMailPlusSettings
{
    [Required]
    [VerifyScheme("https")]
    public Uri ServerUrl { get; set; } = null!;
    [Required]
    public string User { get; set; } = null!;
    [Required]
    public string Secret { get; set; } = null!;
}

internal sealed class VerifySchemeAttribute : ValidationAttribute
{
    public string Scheme { get; private set; }
    public VerifySchemeAttribute(string scheme)
    {
        Scheme = scheme;
    }
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (((Uri)value).Scheme.Equals(Scheme, StringComparison.InvariantCultureIgnoreCase))
        {
            return ValidationResult.Success;
        }
        return new ValidationResult(FormatErrorMessage(validationContext.DisplayName));
    }
    public override string FormatErrorMessage(string name)
    {
        return $"{name} scheme must be {Scheme}";
    }
}

[OptionsValidator]
internal partial class BCMailPlusSettingsValidator : IValidateOptions<BCMailPlusSettings>
{

}