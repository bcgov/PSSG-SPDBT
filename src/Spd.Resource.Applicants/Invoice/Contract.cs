namespace Spd.Resource.Applicants.Invoice
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
        public Guid ApplicationId { get; set; }
        public Guid PortalUserId { get; set; }
        public string Name { get; set; } = null!;
        public PSSOUserRoleEnum PSSOUserRoleCode { get; set; }
    }

    public record InvoiceQry
    {
        public Guid? ApplicationId { get; set; }
        public Guid? PortalUserId { get; set; }
    };

    public abstract record InvoiceCmd { };
    public record CreateInvoiceCmd : InvoiceCmd
    {
        public Guid ApplicationId { get; set; }
        public Guid PortalUserId { get; set; }
        public PSSOUserRoleEnum PSSOUserRoleCode { get; set; }
        public string Name { get; set; } = null!;
    }

    public enum PSSOUserRoleEnum
    {
        Delegate,
        HiringManager
    }
}
