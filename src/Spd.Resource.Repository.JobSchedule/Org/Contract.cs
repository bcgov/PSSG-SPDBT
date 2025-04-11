namespace Spd.Resource.Repository.JobSchedule.Org
{
    public interface IOrgRepository
    {
        public Task<IEnumerable<ResultResp>> RunMonthlyInvoiceAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<ResultResp>> RunGeneralFunctionAsync(CancellationToken cancellationToken);
    }

    public record ResultResp
    {
        public bool IsSuccess { get; set; }
        public string? ResultStr { get; set; }
        public Guid OrgId { get; set; }
    }
}