using System.Collections.Concurrent;
using System.Collections.Immutable;
using Spd.Utilities.Printing.BCMailPlus;

namespace Spd.Utilities.Printing;

internal sealed class Printer : IPrinter
{
    private readonly IBcMailPlusApi bcMailPlusApi;

    public Printer(IBcMailPlusApi bcMailPlusApi)
    {
        this.bcMailPlusApi = bcMailPlusApi;
    }

    public async Task<PrintResponse> PrintAsync(PrintRequest request, CancellationToken ct)
    {
        return request switch
        {
            SynchronousBcMailPlusPrintRequest req => await HandleBcMailPlusPrintRequest(req, ct),
            _ => throw new InvalidOperationException("")
        };
    }

    private async Task<PrintResponse> HandleBcMailPlusPrintRequest(SynchronousBcMailPlusPrintRequest req, CancellationToken ct)
    {
        var jobs = new ConcurrentBag<JobStatus>();
        await Parallel.ForEachAsync(req.Items, ct, async (item, ct) =>
        {
            var jobStatus = await bcMailPlusApi.CreateJob(req.JobClass, item, ct);
            while (!ct.IsCancellationRequested && jobStatus.Status != JobStatus.PdfCreated && string.IsNullOrEmpty(jobStatus.JobProperties?.Asset))
            {
                if (jobStatus.Status == JobStatus.ProcessingError) throw new InvalidOperationException($"job '{jobStatus.JobId}' error: {jobStatus.Errors}");
                await Task.Delay(5000, ct);
            }
            jobs.Add(jobStatus);
        });

        var assets = new ConcurrentBag<byte[]>();
        await Parallel.ForEachAsync(jobs, ct, async (job, ct) =>
        {
            var asset = await bcMailPlusApi.GetAsset(job.JobId!, job.JobProperties!.Asset!, ct);
            if (asset != null) assets.Add(asset);
        });
        return new BcMailPlusPrintResponse(assets.ToImmutableList());
    }
}