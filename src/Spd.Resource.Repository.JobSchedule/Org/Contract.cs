using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;

namespace Spd.Resource.Repository.JobSchedule.Org
{
    public interface IOrgRepository
    {
        public Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(CancellationToken cancellationToken);
    }
}