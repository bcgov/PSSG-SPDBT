using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Spd.Manager.Cases.Payment
{
    public interface IPaymentManager
    {
        public Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand command, CancellationToken ct);
        public Task<PrePaymentLinkResponse> Handle(PrePaymentLinkCreateCommand command, CancellationToken ct);
        public Task<Guid> Handle(PaymenCreateCommand command, CancellationToken ct);
        public Task<PaymentResponse> Handle(PaymentQuery query, CancellationToken ct);
        public Task<int> Handle(PaymentFailedAttemptCountQuery query, CancellationToken ct);
    }

    //pre payment link - for dynamics internal use
    public record PrePaymentLinkCreateCommand(Guid ApplicationId, string ScreeningAppPaymentUrl) : IRequest<PrePaymentLinkResponse>;
    public record PrePaymentLinkResponse(string PrePaymentLinkUrl);

    //payment link
    public record PaymentLinkCreateCommand(PaymentLinkCreateRequest PaymentLinkCreateRequest, string RedirectUrl, int MaxFailedTimes = 3, bool IsFromSecurePaymentLink = false) : IRequest<PaymentLinkResponse>;
    public record PaymentLinkCreateRequest
    {
        public Guid? ApplicationId { get; set; }
        public string? EncodedApplicationId { get; set; } = null; //from secure payment link
        [MaxLength(100)]
        public string Description { get; set; } = null!;
        public PaymentMethodCode PaymentMethod { get; set; } //CC-credit card, VI - debit card

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

    //payment result
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
        public Guid PaymentId { get; set; }
        public string CaseNumber { get; set; }
        public bool PaidSuccess { get; set; }
        public PaymentStatusCode PaymentStatus { get; set; }
        public string Message { get; set; }
        public string TransOrderId { get; set; }
        public DateTimeOffset TransDateTime { get; set; }
        public decimal TransAmount { get; set; }
    }
}
