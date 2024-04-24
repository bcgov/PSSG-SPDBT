using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Printing;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Dynamics.Controllers;

[Authorize]
public class PrintingController(IMediator mediator) : SpdControllerBase
{
    [HttpPost("api/printjobs/{jobId}")]
    public async Task<Results<Ok<string>, BadRequest>> PostPrintJob(string? jobId, PrintJobRequest request, CancellationToken ct)
    {
        if (jobId != request.JobId) return TypedResults.BadRequest();
        var printJob = new PrintJob(request.DocumentType, request.DocumentReferenceId);
        var createdJobId = await mediator.Send(new StartPrintJobCommand(printJob), ct);
        return TypedResults.Ok(createdJobId);
    }

    [HttpPost("api/printjobs/{jobId}/preview")]
    public async Task<Results<FileContentHttpResult, BadRequest>> PostPrintJobPreview(string? jobId, PrintJobRequest request, CancellationToken ct)
    {
        if (jobId != request.JobId) return TypedResults.BadRequest();
        var printJob = new PrintJob(request.DocumentType, request.DocumentReferenceId);
        var previewResponse = await mediator.Send(new PreviewDocumentCommand(printJob), ct);
        return TypedResults.File(previewResponse.Content.ToArray(), previewResponse.ContentType);
    }

    [HttpGet("api/printjobs/{jobId}/status")]
    public async Task<Results<Ok<PrintJobStatusResponse>, BadRequest<PrintJobStatusResponse>>> GetPrintJobStatus(string jobId, CancellationToken ct)
    {
        var response = await mediator.Send(new PrintJobStatusQuery(jobId), ct);
        if (response.Status == Spd.Manager.Printing.PrintJobStatus.Failed)
        {
            return TypedResults.BadRequest(new PrintJobStatusResponse(jobId, PrintJobStatus.Failed, response.Error));
        }
        return TypedResults.Ok(new PrintJobStatusResponse(jobId, PrintJobStatus.Success, null));
    }
}

public record PrintJobRequest(string? JobId, DocumentType DocumentType, Guid DocumentReferenceId);

public enum DocumenType
{
    BcMailPlusFingerprintLetter,
    BCMailPlusBusinessLicence,
}

public record PrintJobStatusResponse(string JobId, PrintJobStatus Status, string? ErrorMessage);

public enum PrintJobStatus
{
    Success,
    Pending,
    Failed
}