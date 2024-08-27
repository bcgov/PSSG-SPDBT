using Spd.Utilities.Printing.BCMailPlus;

namespace Spd.Utilities.Printing;

internal sealed class Printer(IBcMailPlusApi bcMailPlusApi) : IPrinter
{
    public async Task<PreviewResponse> Preview(PrintRequest request, CancellationToken ct)
    {
        return request switch
        {
            BCMailPlusPrintRequest req => await GeneratePreview(req, ct),
            _ => throw new NotImplementedException()
        };
    }

    public async Task<SendResponse> Send(PrintRequest request, CancellationToken ct)
    {
        return request switch
        {
            BCMailPlusPrintRequest req => await CreateJob(req, ct),
            _ => throw new NotImplementedException()
        };
    }

    public async Task<ReportResponse> Report(ReportRequest request, CancellationToken ct)
    {
        return request switch
        {
            BCMailPlusPrintStatusRequest req => await CheckJobStatus(req, ct),
            _ => throw new NotImplementedException()
        };
    }

    private async Task<PreviewResponse> GeneratePreview(BCMailPlusPrintRequest req, CancellationToken ct)
    {
        var createStatus = await bcMailPlusApi.CreateJob(req.JobTemplate, req.payload, ct);
        if (!string.IsNullOrWhiteSpace(createStatus.Errors)) return new PreviewResponse(string.Empty, JobStatus.Failed, createStatus.Errors, null, null);
        if (createStatus.JobId == null) return new PreviewResponse(string.Empty, JobStatus.Failed, "job id was returned null", null, null);
        var jobId = createStatus.JobId!;

        var jobStatus = (await bcMailPlusApi.GetJobStatus([jobId], CancellationToken.None)).Jobs.SingleOrDefault();
        if (jobStatus == null) throw new InvalidOperationException($"no job status was returned for job {jobId}");
        var counter = 0;
        var delay = 1000;
        var retries = 30;
        while (!ct.IsCancellationRequested && jobStatus.Status != JobStatusValues.PdfCreated)
        {
            await Task.Delay(delay, ct); //make configurable
            jobStatus = (await bcMailPlusApi.GetJobStatus([createStatus.JobId], CancellationToken.None)).Jobs.SingleOrDefault();
            if (jobStatus == null) throw new InvalidOperationException("no job status was returned");
            if (jobStatus.Status == JobStatusValues.ProcessingError) throw new InvalidOperationException($"Error in job: {jobStatus.Errors}");
            counter++;
            if (counter > retries) return new PreviewResponse(string.Empty, JobStatus.Failed, $"Timeout retrieving BcMailPlus job status for job {jobId}, the last known status was {jobStatus.Status}", null, null);
        }

        if (jobStatus.JobProperties == null || jobStatus.JobProperties.Asset == null) throw new InvalidOperationException("job status returned in an inconsistent state");
        var asset = await bcMailPlusApi.GetAsset(createStatus.JobId, jobStatus.JobProperties.Asset, ct);
        if (asset == null) throw new InvalidOperationException($"asset was returned null for job {jobId}");
        var contentType = ResolveContentType(jobStatus);
        return new PreviewResponse(jobId, JobStatus.Completed, null, asset, contentType);
    }

    private static string? ResolveContentType(BCMailPlus.JobStatus jobStatus) =>
        jobStatus?.JobProperties?.Asset switch
        {
            "CARD_PREVIEW_IMAGE" => "image/png",

            _ => "application/pdf"
        };

    private async Task<SendResponse> CreateJob(BCMailPlusPrintRequest req, CancellationToken ct)
    {
        var createStatus = await bcMailPlusApi.CreateJob(req.JobTemplate, req.payload, ct);
        if (createStatus.Errors != null && createStatus.Errors.Length != 0) return new SendResponse(string.Empty, JobStatus.Failed, createStatus.Errors);
        if (createStatus.JobId == null) return new SendResponse(string.Empty, JobStatus.Failed, "job id was returned null");
        var jobId = createStatus.JobId!;
        return new SendResponse(jobId, JobStatus.InProgress, null);
    }

    private async Task<ReportResponse> CheckJobStatus(BCMailPlusPrintStatusRequest req, CancellationToken ct)
    {
        var jobStatus = (await bcMailPlusApi.GetJobStatus([req.PrintJobId], ct)).Jobs.SingleOrDefault();
        var status = jobStatus?.Status switch
        {
            JobStatusValues.PdfCreated => JobStatus.Completed,
            JobStatusValues.ProcessingError => JobStatus.Failed,
            _ => JobStatus.InProgress
        };
        return new ReportResponse(req.PrintJobId, status, jobStatus?.Errors);
    }
}