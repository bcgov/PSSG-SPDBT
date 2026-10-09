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

    /// <summary>
    /// Set to `true` to log the raw payload sent to BCMailPlus. 
    /// This should only be enabled temporarily for debugging purposes as the payload can be very large.
    /// This should typically not be enabled in production environments to avoid logging sensitive information. 
    /// </summary>
    public bool LogPayload { get; set; }
}