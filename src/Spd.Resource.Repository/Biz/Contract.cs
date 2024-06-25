namespace Spd.Resource.Repository.Biz
{
    public interface IBizRepository
    {
        Task<IEnumerable<BizResult>> QueryBizAsync(BizsQry qry, CancellationToken ct);
        Task<BizResult?> GetBizAsync(Guid bizId, CancellationToken ct);
        Task<BizResult> ManageBizAsync(BizCmd cmd, CancellationToken ct);
    }
    //command
    public abstract record BizCmd : Biz;
    public record UpdateBizCmd() : BizCmd;
    public record UpdateBizServiceTypeCmd(Guid BizId, ServiceTypeEnum ServiceTypeEnum) : BizCmd;
    public record CreateBizCmd() : BizCmd;
    public record AddBizServiceTypeCmd(Guid BizId, ServiceTypeEnum ServiceTypeEnum) : BizCmd;

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
        public IEnumerable<ServiceTypeEnum> ServiceTypes { get; set; } = Array.Empty<ServiceTypeEnum>();
        public string? BizName { get; set; }
        public string? BizLegalName { get; set; }
        public Guid? BizGuid { get; set; }
        public BizTypeEnum? BizType { get; set; }
        public IEnumerable<BranchAddr> BranchAddresses { get; set; } = Array.Empty<BranchAddr>();

        public bool UpdateSoleProprietor { get; set; } = true;
        //sole proprietor properties
        public SwlContactInfo? SoleProprietorSwlContactInfo { get; set; } = new(); //for sole proprietor (registered or non-registered)
    }

    public record BizResult : Biz
    {
        public int MaxContacts { get; } = 6;
        public int MaxPrimaryContacts { get; } = 2;
        public string? AccessCode { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid? ParentBizId { get; set; }
    }

    public record BranchAddr() : Addr
    {
        public Guid? BranchId { get; set; }
        public string? BranchManager { get; set; }
        public string? BranchPhoneNumber { get; set; }
        public string? BranchEmailAddr { get; set; }
    }

    public record NonSwlContactInfo() : ContactInfo
    {
        public Guid? BizContactId { get; set; }
    }

    public record ContactInfo
    {
        public string? GivenName { get; set; }
        public string? Surname { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? EmailAddress { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
