﻿using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Printing;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.Shared;
using PrintJobStatus = Spd.Presentation.Dynamics.Models.PrintJobStatus;

namespace Spd.Presentation.Dynamics.Controllers;

[Authorize]
public class PrintingController(IMediator mediator, IMapper mapper) : SpdControllerBase
{
    /// <summary>
    /// Set applicationId, this endpoint will print out paper for mailing to applicant. Set jobId to null.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpPost("api/printjobs")]
    public async Task<Results<Ok<string>, BadRequest>> PostPrintJob([FromBody] PrintJobRequest request, CancellationToken ct)
    {
        var printJob = mapper.Map<PrintJob>(request);
        var createdJobId = await mediator.Send(new StartPrintJobCommand(printJob), ct);
        return TypedResults.Ok(createdJobId);
    }

    [HttpPost("api/printjobs/{jobId}/preview")]
    public async Task<Results<FileContentHttpResult, BadRequest>> PostPrintJobPreview(string? jobId, PrintJobRequest request, CancellationToken ct)
    {
        if (jobId != request.JobId) return TypedResults.BadRequest();
        var printJob = mapper.Map<PrintJob>(request);
        var previewResponse = await mediator.Send(new PreviewDocumentCommand(printJob), ct);
        return TypedResults.File(previewResponse.Content.ToArray(), previewResponse.ContentType);
    }

    /// <summary>
    /// input jobId, this endpoint will return the job status.
    /// </summary>
    /// <param name="jobId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("api/printjobs/{jobId}/status")]
    public async Task<PrintJobStatusResponse> GetPrintJobStatus(string jobId, CancellationToken ct)
    {
        var response = await mediator.Send(new PrintJobStatusQuery(jobId), ct);
        if (response.Status == Spd.Manager.Printing.PrintJobStatus.Failed)
        {
            return new PrintJobStatusResponse(jobId, PrintJobStatus.Failed, response.Error);
        }
        return new PrintJobStatusResponse(jobId, PrintJobStatus.Success, null);
    }
}