namespace Spd.Presentation.Dynamics.Models
{
    public record PrintJobStatusResponse(string JobId, PrintJobStatus Status, string? ErrorMessage);

    public enum PrintJobStatus
    {
        Success,
        Pending,
        Failed
    }
}
