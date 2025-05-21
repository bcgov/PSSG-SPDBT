namespace Spd.Resource.Repository.JobSchedule.ScheduleJobSession
{
    public interface IScheduleJobSessionRepository
    {
        public Task<ScheduleJobSessionListResp> QueryAsync(ScheduleJobSessionQry query, CancellationToken cancellationToken);
        public Task<ScheduleJobSessionResp> ManageAsync(UpdateScheduleJobSessionCmd cmd, CancellationToken cancellationToken);
        public Task<ScheduleJobSessionResp?> GetAsync(Guid ScheduleJobSessionId, CancellationToken cancellationToken);
    }

    public record ScheduleJobSessionQry { };
    public record UpdateScheduleJobSessionCmd
    {
        public Guid ScheduleJobSessionId { get; set; }
        public JobSessionStatusCode JobSessionStatusCode { get; set; }
        public decimal? Duration { get; set; }
        public string? ErrorMsg { get; set; }

    };

    public record ScheduleJobSessionListResp
    {
        public IEnumerable<ScheduleJobSessionResp> Items { get; set; } = Array.Empty<ScheduleJobSessionResp>();
    }


    public record ScheduleJobSessionResp()
    {
        public Guid? ScheduleJobSessionId { get; set; }
        public Guid ScheduleJobId { get; set; }
        public string EndPoint { get; set; }
        public string PrimaryEntity { get; set; }
        public string FilterStr { get; set; }
    }

    public enum JobSessionStatusCode
    {
        Success,
        Failed
    }
}