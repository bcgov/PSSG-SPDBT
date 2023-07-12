namespace Spd.Resource.Applicants.Payment
{
    public interface IPaymentRepository
    {
        public Task<PaymentListResp> QueryAsync(PaymentQry query, CancellationToken cancellationToken);
        public Task<PaymentResp> ManageAsync(PaymentCmd cmd, CancellationToken cancellationToken);
    }

    public record PaymentQry(Guid? ApplicationId = null, Guid? PaymentId = null);
    public record PaymentListResp
    {
        public IEnumerable<PaymentResp> Items { get; set; } = Array.Empty<PaymentResp>();
    }

    public record PaymentResp
    {
        public Guid ApplicationId { get; set; }
        public Guid PaymentId { get; set; }
        public string CaseNumber { get; set; }
        public bool PaidSuccess { get; set; }
        public string Message { get; set; }
        public string? TransOrderId { get; set; }
        public string TransDate { get; set; }
        public decimal TransAmount { get; set; }
    }

    public abstract record PaymentCmd;

    public record CreatePaymentCmd : PaymentCmd
    {
        public Guid ApplicationId { get; set; }
        public bool Success { get; set; }
        public string? MessageText { get; set; }
        public string TransNumber { get; set; } = null!;
        public string? TransOrderId { get; set; }
        public DateTimeOffset TransDate { get; set; }
        public decimal TransAmount { get; set; }
        public string? CardType { get; set; }
        public string? PaymentAuthCode { get; set; }
        public PaymentMethodEnum PaymentMethod { get; set; }
    }

    public enum PaymentMethodEnum
    {
        CreditCard
    }
}
