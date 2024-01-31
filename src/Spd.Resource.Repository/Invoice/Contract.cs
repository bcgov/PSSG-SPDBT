namespace Spd.Resource.Repository.Invoice
{
    public interface IInvoiceRepository
    {
        public Task<InvoiceListResp> QueryAsync(InvoiceQry cmd, CancellationToken cancellationToken);
        public Task<InvoiceResp> ManageAsync(InvoiceCmd cmd, CancellationToken cancellationToken);
    }

    public record InvoiceListResp
    {
        public IEnumerable<InvoiceResp> Items { get; set; } = Array.Empty<InvoiceResp>();
    }

    public record InvoiceResp
    {
        public Guid Id { get; set; }
        public Guid? OrganizationId { get; set; }
        public InvoiceStatusEnum? InvoiceStatus { get; set; }
        public string? InvoiceNumber { get; set; }
        public string PartyNumber { get; set; } = null!;
        public string AccountNumber { get; set; } = null!;
        public string SiteNumber { get; set; } = null!;
        public int NumberOfApplications { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTimeOffset? TransactionDate { get; set; }
        public DateTimeOffset? GlDate { get; set; }
        public string? Comments { get; set; }
    }

    public record InvoiceQry
    {
        public Guid? InvoiceId { get; set; }
        public Guid? OrganizationId { get; set; }
        public InvoiceStatusEnum? InvoiceStatus { get; set; }
        public bool IncludeInactive { get; set; } = false;
    };

    public enum InvoiceStatusEnum
    {
        Draft,
        Pending,
        Sent,
        Failed,
        Paid,
        Cancelled
    }
    public abstract record InvoiceCmd { };
    public record UpdateInvoiceCmd : InvoiceCmd
    {
        public Guid InvoiceId { get; set; }
        public InvoiceStatusEnum? InvoiceStatus { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? CasResponse { get; set; }
    }

}
