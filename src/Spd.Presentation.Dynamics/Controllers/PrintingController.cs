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
    /// Now, it will exe the event according to the eventype (now, only finger print), and update the event according to the response from bcMail plus.
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
    /// return the preview picture of licence.
    /// </summary>
    /// <param name="eventId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/person-licence-preview/{licenceId}")]
    public async Task<Results<FileContentHttpResult, BadRequest>> GetPersonLicencePreview([FromRoute] Guid licenceId, CancellationToken ct)
    {
        var previewResponse = await mediator.Send(new PreviewDocumentCommand(licenceId), ct);
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
}