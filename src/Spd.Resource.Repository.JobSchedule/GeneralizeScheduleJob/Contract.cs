namespace Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob
{
    public interface IGeneralizeScheduleJobRepository
    {
        public Task<IEnumerable<ResultResp>> RunJobsAsync(RunJobRequest request, int ConcurrentRequests, CancellationToken cancellationToken, int delayInMilliSec);
    }

    public record RunJobRequest
    {
        public string PrimaryTypeName { get; set; } //exp: account
        public String PrimaryEntityName { get; set; } //exp: accounts
        public string PrimaryEntityIdName { get; set; } //exp: accountid
        public string? PrimaryEntityFilterStr { get; set; }
        public string PrimaryEntityActionStr { get; set; }
    }

    public record ResultResp
    {
        public bool IsSuccess { get; set; }
        public string? ResultStr { get; set; }
        public Guid PrimaryEntityId { get; set; }
    }
}