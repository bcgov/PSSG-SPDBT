using MediatR;

namespace Spd.Manager.Printing;

public interface IPrintingManager
{
    public Task<ResultResponse> Handle(StartPrintJobCommand cmd, CancellationToken ct);
    public Task<ResultResponse> Handle(PrintJobStatusQuery cmd, CancellationToken ct);
    public Task<PreviewDocumentResp> Handle(PreviewDocumentCommand request, CancellationToken ct);
}
public record StartPrintJobCommand(Guid EventId) : IRequest<ResultResponse>;
public record PrintJobStatusQuery(Guid EventId) : IRequest<ResultResponse>;
public record PreviewDocumentCommand(Guid LicenceId) : IRequest<PreviewDocumentResp>;

public record PrintJob(DocumentType DocumentType, Guid? ApplicationId, Guid? LicenceId);
public record ResultResponse()
{
    public string PrintJobId { get; set; }
    public JobStatusCode Status { get; set; }
    public string? Error { get; set; }
};
public enum DocumentType
{
    FingerprintLetter,
    PersonalLicencePreview,
}

public enum JobStatusCode
{
    Ready, //Active state status reason
    Error, //Active state status reason
    Processed, //Inactive State status reason
    Cancelled, //Inactive State status reason
    Success, //Inactive State status reason
    Fail //Inactive State status reason
}

public record PreviewDocumentResp(string ContentType, IEnumerable<byte> Content, string JobId);