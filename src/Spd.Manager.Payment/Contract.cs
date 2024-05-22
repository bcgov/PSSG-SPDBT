using MediatR;
using Spd.Manager.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Manager.Payment
{
    public interface IPaymentManager
    {
        public Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand command, CancellationToken ct);
        public Task<PrePaymentLinkResponse> Handle(PrePaymentLinkCreateCommand command, CancellationToken ct);
        public Task<PaymentRefundResponse> Handle(PaymentRefundCommand command, CancellationToken ct);
        public Task<Guid> Handle(PaymenCreateCommand command, CancellationToken ct);
        public Task<PaymentResponse> Handle(PaymentQuery query, CancellationToken ct);
        public Task<int> Handle(PaymentFailedAttemptCountQuery query, CancellationToken ct);
        public Task<FileResponse> Handle(PaymentReceiptQuery query, CancellationToken ct);
        public Task<FileResponse> Handle(ManualPaymentFormQuery query, CancellationToken ct);
        public Task<CreateInvoicesInCasResponse> Handle(CreateInvoicesInCasCommand command, CancellationToken ct);
        public Task<CreateOneInvoiceInCasResponse> Handle(CreateOneInvoiceInCasCommand command, CancellationToken ct);
        public Task<UpdateInvoicesFromCasResponse> Handle(UpdateInvoicesFromCasCommand command, CancellationToken ct);
    }

    #region pre payment link
    //pre payment link - for dynamics internal use
    public record PrePaymentLinkCreateCommand(Guid ApplicationId, string ScreeningAppPaymentUrl, string LicensingAppPaymentUrl) : IRequest<PrePaymentLinkResponse>;
    public record PrePaymentLinkResponse(string PrePaymentLinkUrl);
    #endregion

    #region payment link
    public record PaymentLinkCreateCommand(PaymentLinkCreateRequest PaymentLinkCreateRequest, string RedirectUrl, int MaxFailedTimes = 3) : IRequest<PaymentLinkResponse>;
    public record PaymentLinkCreateRequest
    {
        public Guid? ApplicationId { get; set; }
        [MaxLength(100)]
        public string Description { get; set; } = null!;
        public PaymentMethodCode PaymentMethod { get; set; } //CC-credit card, VI - debit card

    }
    public record PaymentLinkFromSecureLinkCreateRequest : PaymentLinkCreateRequest
    {
        public string? EncodedApplicationId { get; set; } = null; //from secure payment link
        public string? EncodedPaymentId { get; set; } = null; //from secure payment link
    }

    public record PaymentLinkResponse(string PaymentLinkUrl);

    public enum PaymentStatusCode
    {
        Success,
        Failure,
    }
    public enum PaymentMethodCode
    {
        CreditCard
    }

    public enum PaymentTypeCode
    {
        PayBC_OnSubmission,
        Cash,
        CreditCard,
        MoneyOrder,
        Cheque,
        CertifiedCheque,
        CreditAccount,
        JournalVoucher,
        NoPayment,
        PayBC_SecurePaymentLink,
    }
    #endregion

    #region payment result
    public record PaymenCreateCommand(string QueryStr, PaybcPaymentResult PaybcPaymentResult) : IRequest<Guid>;
    public record PaymentQuery(Guid PaymentId) : IRequest<PaymentResponse>;
    public record PaymentFailedAttemptCountQuery(Guid ApplicationId) : IRequest<int>;
    public record PaybcPaymentResult
    {
        public bool Success { get; set; }
        public string? MessageText { get; set; }
        public string? TransNumber { get; set; }
        public string? TransOrderId { get; set; }
        public DateTimeOffset TransDateTime { get; set; }
        public decimal TransAmount { get; set; }
        public PaymentMethodCode PaymentMethod { get; set; }
        public string? CardType { get; set; }
        public string? PaymentAuthCode { get; set; }
        public Guid PaymentId { get; set; }
        public Guid ApplicationId { get; set; }
        public bool IsFromSecurePaymentLink { get; set; } = false;
    }
    public record PaymentResponse
    {
        public Guid ApplicationId { get; set; }
        public ApplicationTypeCode? ApplicationTypeCode { get; set; }
        public LicenceTermCode? LicenceTermCode { get; set; }
        public Guid PaymentId { get; set; }
        public string CaseNumber { get; set; }
        public bool PaidSuccess { get; set; }
        public PaymentStatusCode PaymentStatus { get; set; }
        public PaymentTypeCode? PaymentType { get; set; }
        public string Message { get; set; }
        public string TransOrderId { get; set; }
        public DateTimeOffset TransDateTime { get; set; }
        public decimal TransAmount { get; set; }
        public ServiceTypeCode? ServiceTypeCode { get; set; }
        public string? Email { get; set; }
    }
    #endregion

    #region payment-receipt
    public record PaymentReceiptQuery(Guid ApplicationId) : IRequest<FileResponse>;
    #endregion

    #region manual-payment-form
    public record ManualPaymentFormQuery(Guid ApplicationId) : IRequest<FileResponse>;
    #endregion

    #region payment-refund
    public record PaymentRefundCommand(Guid PaymentId) : IRequest<PaymentRefundResponse>;

    public record PaymentRefundResponse()
    {
        public Guid PaymentId { get; set; }
        public string RefundId { get; set; } = null!;
        public bool Approved { get; set; } //true: approved, false: declined.
        public decimal TxnAmount { get; set; }
        public string OrderNumber { get; set; } = null!;
        public string TxnNumber { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTimeOffset RefundTxnDateTime { get; set; }
    }
    #endregion

    #region invoice
    public record CreateInvoicesInCasCommand() : IRequest<CreateInvoicesInCasResponse>;

    public record CreateInvoicesInCasResponse(bool Success);

    public record UpdateInvoicesFromCasCommand() : IRequest<UpdateInvoicesFromCasResponse>;

    public record UpdateInvoicesFromCasResponse(bool Success);

    public record CreateOneInvoiceInCasCommand(Guid InvoiceId) : IRequest<CreateOneInvoiceInCasResponse>;
    public record CreateOneInvoiceInCasResponse(bool Success);
    #endregion
}
