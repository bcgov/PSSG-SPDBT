using System.Collections.Concurrent;
using System.Collections.Immutable;
using System.Net.Mime;
using Spd.Utilities.Printing.BCMailPlus;

namespace Spd.Utilities.Printing;

internal sealed class Printer(IBcMailPlusApi bcMailPlusApi) : IPrinter
{
    public async Task<PrintResponse> Preview(PrintRequest request, CancellationToken ct)
    {
        return request switch
        {
            BCMailPlusPrintRequest req => await HandleBcMailPlusPrintRequest(req, false, ct),
            _ => throw new NotImplementedException()
        };
    }

    public Task<PrintResponse> Report(PrintRequest request, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public async Task<PrintResponse> Send(PrintRequest request, CancellationToken ct)
    {
        return request switch
        {
            BCMailPlusPrintRequest req => await HandleBcMailPlusPrintRequest(req, true, ct),
            _ => throw new NotImplementedException()
        };
    }

    private async Task<PrintResponse> HandleBcMailPlusPrintRequest(BCMailPlusPrintRequest req, bool isPreview, CancellationToken ct)
    {
        var createStatus = await bcMailPlusApi.CreateJob(req.JobTemplate, req.payload, ct);
        if (createStatus.Errors != null) return new PrintResponse(JobStatus.Failed, null, null, createStatus.Errors);
        if (createStatus.JobId == null) return new PrintResponse(JobStatus.Failed, null, null, "job id was returned null");
        var jobId = createStatus.JobId!;

        var jobStatus = (await bcMailPlusApi.GetJobStatus([jobId], CancellationToken.None)).Jobs.SingleOrDefault();
        if (jobStatus == null) throw new InvalidOperationException("no job status was returned");
        while (!ct.IsCancellationRequested && jobStatus.Status != JobStatusValues.PdfCreated)
        {
            await Task.Delay(1000, ct);
            jobStatus = (await bcMailPlusApi.GetJobStatus([createStatus.JobId], CancellationToken.None)).Jobs.SingleOrDefault();
            if (jobStatus == null) throw new InvalidOperationException("no job status was returned");
            if (jobStatus.Status == JobStatusValues.ProcessingError) throw new InvalidOperationException($"Error in job: {jobStatus.Errors}");
        }
        if (isPreview)
        {
            if (jobStatus.JobProperties == null || jobStatus.JobProperties.Asset == null) throw new InvalidOperationException("job status returned in an inconsistent state");
            var asset = await bcMailPlusApi.GetAsset(createStatus.JobId, jobStatus.JobProperties.Asset, ct);
            if (asset == null) throw new InvalidOperationException("asset was returned null");
            var contentType = jobStatus.JobProperties.Asset == "CARD_PREVIEW_IMAGE" ? "image/png" : "application/pdf";
            return new PrintResponse(JobStatus.Completed, asset, contentType, null);
        }
        return new PrintResponse(JobStatus.Completed, null, null, null);
    }
}