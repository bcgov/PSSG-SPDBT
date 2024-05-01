namespace Spd.Resource.Repository.Biz
{
    public interface IBizRepository
    {
        Task<IEnumerable<BizResult>> QueryBizAsync(BizsQry qry, CancellationToken ct);
        Task<BizResult?> GetBizAsync(Guid bizId, CancellationToken ct);
        Task<BizResult> ManageBizAsync(BizCmd cmd, CancellationToken ct);
    }
    //command
    public abstract record BizCmd;
    public record BizUpdateCmd(Biz Biz) : BizCmd;
    public record BizCreateCmd(Biz Biz) : BizCmd;
    public record BizAddServiceTypeCmd(Guid BizId, ServiceTypeEnum ServiceTypeEnum) : BizCmd;

    //query
    public record BizsQry(Guid? BizGuid = null, bool IncludeInactive = false, string? BizCode = null, IEnumerable<ServiceTypeEnum>? ServiceTypes = null);

    //shared content
    public record Biz
    {
        public Guid Id { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public Addr? MailingAddress { get; set; }
        public Addr? BusinessAddress { get; set; }
        public Addr? BCBusinessAddress { get; set; }
        public bool HasInvoiceSupport { get; set; }
        public IEnumerable<ServiceTypeEnum> ServiceTypes { get; set; } = Array.Empty<ServiceTypeEnum>();
        public string? BizName { get; set; }
        public string? BizLegalName { get; set; }
        public Guid? BizGuid { get; set; }
        public BizTypeEnum BizType { get; set; }
        public IEnumerable<BranchAddr>? BranchAddress { get; set; }
    }
    public record BizResult : Biz
    {
        public int MaxContacts { get; } = 6;
        public int MaxPrimaryContacts { get; } = 2;
        public string? AccessCode { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid? ParentBizId { get; set; }
    }
}
