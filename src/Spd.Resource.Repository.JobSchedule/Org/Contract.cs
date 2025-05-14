using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;

namespace Spd.Resource.Repository.JobSchedule.Org
{
    public interface IOrgRepository
    {
        public Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(int concurrentRequests, CancellationToken cancellationToken);
        public Task<IEnumerable<ResultResp>> RunMonthlyOrgInChuncksAsync(RunJobRequest request, int concurrentRequests, CancellationToken cancellationToken);
    }
}
