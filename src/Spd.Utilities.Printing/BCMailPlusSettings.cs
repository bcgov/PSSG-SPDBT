using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.Printing;

internal sealed class BCMailPlusSettings
{
    [Required]
    public Uri ServerUrl { get; set; } = null!;

    [Required]
    public string User { get; set; } = null!;

    [Required]
    public string Secret { get; set; } = null!;
}