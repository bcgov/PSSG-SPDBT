using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Printing;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Dynamics.Controllers;

[Authorize]
public class PrintingController(IMediator mediator, IMapper mapper) : SpdControllerBase
{
    /// <summary>
    ///  a GET request that takes an event id. It should be like
    ///    GET /api/printjobs/{eventid}
    /// where eventid is the GUID for spd_eventqueue record.
    /// Now, it will exe the event according to the eventype (now, only finger print. sbl and msdr), and update the event according to the response from bcMail plus.
    /// </summary>
    /// <param name="eventId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/printjobs/{eventId}")]
    public async Task<ResultResponse> GetPrintJob([FromRoute] Guid eventId, CancellationToken ct)
    {
        return await mediator.Send(new StartPrintJobCommand(eventId), ct);
    }

    /// <summary>
    ///  a GET request that will print all cards (swl, permit) in event queue
    /// Now, it will find all previous event queues which is for printing swl, permit and gdsd card printing, and create batch job, then update the events according to the response from bcMail plus.
    /// </summary>
    /// <param name="eventId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/print-cards-in-batch")]
    public async Task<ResultResponse> PrintCardsInBatch(CancellationToken ct)
    {
        return await mediator.Send(new PrintCardsInBatchCommand(), ct);
    }
    /// <summary>
    /// return the preview picture of licence.
    /// The bcmp job id will be returned in the http header as "bcmp-personal-licence-preview-jobid"
    /// </summary>
    /// <param name="eventId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/person-licence-preview/{licenceId}")]
    public async Task<Results<FileContentHttpResult, BadRequest>> GetPersonLicencePreview([FromRoute] Guid licenceId, CancellationToken ct)
    {
        var previewResponse = await mediator.Send(new PreviewDocumentCommand(licenceId), ct);
        Response.Headers.Append("bcmp-personal-licence-preview-jobid", previewResponse.JobId);
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
    public async Task<ResultResponse> GetPrintJobStatus(Guid eventId, CancellationToken ct)
    {
        return await mediator.Send(new PrintJobStatusQuery(eventId), ct);
    }

    /// <summary>
    /// return the generated pdf of the event if the event is to print Biz licence.
    /// </summary>
    /// <param name="eventId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/printjobs/images/{eventId}")]
    public async Task<Results<FileContentHttpResult, BadRequest>> GetEventPrintingImage([FromRoute] Guid eventId, CancellationToken ct)
    {
        var previewResponse = await mediator.Send(new PrintingEventImageQuery(eventId), ct);
        return TypedResults.File(previewResponse.Content.ToArray(), previewResponse.ContentType);
    }
}