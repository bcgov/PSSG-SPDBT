using System.Text.Json;

namespace Spd.Utilities.Printing;

public interface IPrinter
{
    Task<SendResponse> Send(PrintRequest request, CancellationToken ct);

    Task<PreviewResponse> Preview(PrintRequest request, CancellationToken ct);

    Task<ReportResponse> Report(ReportRequest request, CancellationToken ct);
}

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable S2094 // Classes should not be empty

public abstract record PrintRequest;
public abstract record ReportRequest;

#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
#pragma warning restore S2094 // Classes should not be empty

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