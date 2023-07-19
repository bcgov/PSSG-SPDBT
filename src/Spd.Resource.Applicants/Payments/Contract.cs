namespace Spd.Resource.Applicants.Payment
{
    public interface IPaymentRepository
    {
        public Task<PaymentListResp> QueryAsync(PaymentQry query, CancellationToken cancellationToken);
        public Task<Guid> ManageAsync(PaymentCmd cmd, CancellationToken cancellationToken);
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
        public PaymentStatusEnum PaymentStatus { get; set; }
        public string Message { get; set; }
        public string? TransOrderId { get; set; }
        public DateTimeOffset TransDateTime { get; set; }
        public decimal TransAmount { get; set; }
    }

    public abstract record PaymentCmd
    {
        public Guid ApplicationId { get; set; }
        public string TransNumber { get; set; } = null!;
        public decimal TransAmount { get; set; }
        public PaymentMethodEnum? PaymentMethod { get; set; }
    };

    public record UpdatePaymentCmd : PaymentCmd
    {
        public Guid PaymentId { get; set; }
        public bool? Success { get; set; }
        public string? CardType { get; set; }
        public string? PaymentAuthCode { get; set; }
        public string? TransOrderId { get; set; }
        public DateTimeOffset? TransDateTime { get; set; }
        public string? MessageText { get; set; }
    };
    public record CreatePaymentCmd : PaymentCmd;


    public enum PaymentStatusEnum
    {
        Success,
        Failure,
        Cancelled
    }
    public enum PaymentMethodEnum
    {
        CreditCard
    }
}
