namespace Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob
{
    public interface IGeneralizeScheduleJobRepository
    {
        public Task<IEnumerable<ResultResp>> RunJobsAsync(RunJobRequest request, int ConcurrentRequests, CancellationToken cancellationToken);
    }

    public record RunJobRequest
    {
        public String PrimaryEntityName { get; set; }
        public string PrimaryEntityIdName { get; set; }
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