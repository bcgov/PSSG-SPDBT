using MediatR;

namespace Spd.Manager.Printing;

public interface IPrintingManager
{
    public Task<string> Handle(StartPrintJobCommand cmd, CancellationToken ct);
    public Task<PrintJobStatusResponse> Handle(PrintJobStatusQuery cmd, CancellationToken ct);
    public Task<PreviewDocumentResponse> Handle(PreviewDocumentCommand request, CancellationToken ct);
}
public record StartPrintJobCommand(PrintJob PrintJob) : IRequest<string>;
public record PrintJobStatusQuery(string PrintJobId) : IRequest<PrintJobStatusResponse>;
public record PreviewDocumentCommand(PrintJob PrintJob) : IRequest<PreviewDocumentResponse>;

public record PrintJob(DocumentType DocumentType, Guid DocumentReferenceId);

public enum DocumentType
{
    FingerprintLetter,
}

public record PrintJobStatusResponse(PrintJobStatus Status, string? Error);

public enum PrintJobStatus
{
    InProgress,
    Completed,
    Failed
}

public record PreviewDocumentResponse(string ContentType, IEnumerable<byte> Content);