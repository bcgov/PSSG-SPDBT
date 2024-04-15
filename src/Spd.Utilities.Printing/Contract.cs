using System.Text.Json;
using Spd.Utilities.Printing.BCMailPlus;

namespace Spd.Utilities.Printing;

public interface IPrinter
{
    Task<PrintResponse> Send(PrintRequest request, CancellationToken ct);
    Task<PrintResponse> Preview(PrintRequest request, CancellationToken ct);
    Task<PrintResponse> Report(PrintRequest request, CancellationToken ct);
    
}

public abstract record PrintRequest;

public record BCMailPlusPrintRequest(string JobTemplate, JsonDocument payload) : PrintRequest();

public record PrintResponse(JobStatus Status, IEnumerable<byte>? previewContent, string? ContentType, string? Error);

public enum JobStatus{
    Queued,
    InProgress,
    Completed,
    Failed
}