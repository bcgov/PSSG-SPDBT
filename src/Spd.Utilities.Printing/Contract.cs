using System.Text.Json;

namespace Spd.Utilities.Printing;

public interface IPrinter
{
    Task<SendResponse> Send(PrintRequest request, CancellationToken ct);

    Task<PreviewResponse> Preview(PrintRequest request, CancellationToken ct);

    Task<ReportResponse> Report(ReportRequest request, CancellationToken ct);
}

public abstract record PrintRequest;
public abstract record ReportRequest;

public record SendResponse(string PrintJobId, JobStatus Status, string? Error);
public record ReportResponse(string PrintJobId, JobStatus Status, string? Error);
public record PreviewResponse(string PrintJobId, JobStatus Status, string? Error, IEnumerable<byte>? Content, string? ContentType);

public record BCMailPlusPrintRequest(string JobTemplate, JsonDocument payload) : PrintRequest;
public record BCMailPlusPrintStatusRequest(string PrintJobId) : ReportRequest;

public enum JobStatus
{
    InProgress,
    Completed,
    Failed
}