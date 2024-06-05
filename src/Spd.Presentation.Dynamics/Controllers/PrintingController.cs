using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Printing;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Dynamics.Controllers;

[Authorize]
public class PrintingController(IMediator mediator, IMapper mapper) : SpdControllerBase
{
    /// <summary>
    ///  a GET request that takes an event id. It should be like
    ///    GET /api/printjobs/{eventid}
    /// where eventid is the GUID for spd_eventqueue record.
    /// Now, it will exe the event according to the eventype (now, only finger print), and update the event according to the response from bcMail plus.
    /// </summary>
    /// <param name="eventId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/printjobs/{eventId}")]
    public async Task<Results<Ok<string>, BadRequest>> GetPrintJob([FromRoute] Guid eventId, CancellationToken ct)
    {
        var createdJobId = await mediator.Send(new StartPrintJobCommand(eventId), ct);
        return TypedResults.Ok(createdJobId);
    }

    /// <summary>
    /// return the preview picture of personal licence.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpPost("api/printjobs/preview")]
    public async Task<Results<FileContentHttpResult, BadRequest>> PostPrintJobPreview(PrintJobRequest request, CancellationToken ct)
    {
        var printJob = mapper.Map<PrintJob>(request);
        var previewResponse = await mediator.Send(new PreviewDocumentCommand(printJob), ct);
        return TypedResults.File(previewResponse.Content.ToArray(), previewResponse.ContentType);
    }

    /// <summary>
    /// input eventId, this endpoint will get jobId from event queue and then query the job status to bc mail plus. After that, it will
    /// update the event queue..
    /// </summary>
    /// <param name="eventId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/printjobs/{eventId}/status")]
    public async Task<Results<Ok<string>, BadRequest>> GetPrintJobStatus(Guid eventId, CancellationToken ct)
    {
        var jobId = await mediator.Send(new PrintJobStatusQuery(eventId), ct);
        return TypedResults.Ok(jobId);
    }
}