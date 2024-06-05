namespace Spd.Presentation.Dynamics.Models
{
    public record PrintJobStatusResponse(string JobId, string Status, string? ErrorMessage);

}
