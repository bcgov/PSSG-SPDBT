using System.Net;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Common;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Dynamics;

[Authorize]
public class PrintingController(IMediator mediator, Mapper mapper) : SpdControllerBase
{

    [HttpPost("api/printjobs/{jobId}")]
    public async Task PostPrintJob(Guid? jobId, PrintJobRequest request, CancellationToken ct)
    {
        await mediator.Send(new SendToPrintCommand(jobId ?? Guid.NewGuid(), mapper.Map<Spd.Manager.Common.JobSpecification>(request)), ct);
    }

    [HttpGet("api/printjobs/{jobId}/status")]
    public async Task<ActionResult<PrintStatusResponse>> GetPrintJobStatus(Guid jobId, CancellationToken ct)
    {
        var response = await mediator.Send(new PrintJobStatusQuery(jobId), ct);
        if (response.Status == PrintJobStatus.Failed) return BadRequest(new PrintStatusResponse(jobId, response.Error));
        return Ok(new PrintStatusResponse(jobId, null));
    }

    [HttpGet("api/printjobs/{jobId}")]
    public async Task<FileContentResult> GetPrintJob(Guid jobId, CancellationToken ct)
    {
        var response = await mediator.Send(new PrintJobContentQuery(jobId), ct);
        return File(response.Content.ToArray(), response.ContentType);
    }
}

public record PrintJobRequest(Guid JobId, JobSpecification JobSpecification);

public record JobSpecification(JobClassification Class, Guid JobContextId);

public enum JobClassification
{
    BcMailPlusFingerprintLetter,
    BCMailPlusBusinessLicence,
}

public record PrintStatusResponse(Guid JobId, string? ErrorMessage);