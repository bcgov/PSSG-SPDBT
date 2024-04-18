using MediatR;

namespace Spd.Manager.Common;

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