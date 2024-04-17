using System.Text.Json;

namespace Spd.Utilities.Printing;

public interface IPrinter
{
    Task<PrintResponse> Send(PrintRequest request, CancellationToken ct);

    Task<PrintResponse> Preview(PrintRequest request, CancellationToken ct);

    Task<PrintResponse> Report(PrintStatusRequest request, CancellationToken ct);
}

public abstract record PrintRequest;
public abstract record PrintStatusRequest;

public record BCMailPlusPrintRequest(string JobTemplate, JsonDocument payload) : PrintRequest;
public record BCMailPlusPrintStatusRequest(string PrintJobId) : PrintStatusRequest;

public record PrintResponse(string? PrintJobId, JobStatus Status, IEnumerable<byte>? PreviewContent, string? ContentType, string? Error);

public enum JobStatus
{
    Queued,
    InProgress,
    Completed,
    Failed
}