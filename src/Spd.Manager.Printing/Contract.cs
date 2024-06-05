using MediatR;

namespace Spd.Manager.Printing;

public interface IPrintingManager
{
    public Task<string> Handle(StartPrintJobCommand cmd, CancellationToken ct);
    public Task<string> Handle(PrintJobStatusQuery cmd, CancellationToken ct);
    public Task<PreviewDocumentResp> Handle(PreviewDocumentCommand request, CancellationToken ct);
}
public record StartPrintJobCommand(Guid EventId) : IRequest<string>;
public record PrintJobStatusQuery(Guid EventId) : IRequest<string>;
public record PreviewDocumentCommand(PrintJob PrintJob) : IRequest<PreviewDocumentResp>;

public record PrintJob(DocumentType DocumentType, Guid? ApplicationId, Guid? LicenceId);

public enum DocumentType
{
    FingerprintLetter,
    PersonalLicencePreview,
}

public record PrintJobStatusResp(PrintJobStatus Status, string? Error);

public enum PrintJobStatus
{
    InProgress,
    Completed,
    Failed
}

public record PreviewDocumentResp(string ContentType, IEnumerable<byte> Content);