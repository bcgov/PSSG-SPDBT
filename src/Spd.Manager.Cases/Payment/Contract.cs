using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Spd.Manager.Cases.Payment
{
    public interface IPaymentManager
    {
        public Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand request, CancellationToken ct);
        public Task<PaymentResponse> Handle(PaymentCreateCommand request, CancellationToken ct);
    }

    //payment link
    public record PaymentLinkCreateCommand(PaymentLinkCreateRequest PaymentLinkCreateRequest, string RedirectUrl, string Ref1, string Ref2, string Ref3) : IRequest<PaymentLinkResponse>;

    public record PaymentLinkCreateRequest
    {
        [MaxLength(100)]
        public string Description { get; set; } = null!;
        public PaymentMethodCode PaymentMethod { get; set; } //CC-credit card, VI - debit card
        public Guid ApplicationId { get; set; }
    }

    public record OrgPaymentLinkCreateRequest : PaymentLinkCreateRequest;
    public record ApplicantPaymentLinkCreateRequest : PaymentLinkCreateRequest;
    public record PaymentLinkResponse
    {
        public string PaymentLinkUrl { get; set; }
    }
    public enum PaymentMethodCode
    {
        CreditCard
    }

    //payment result
    public record PaymentCreateCommand(PaybcPaymentResult PaybcPaymentResult) : IRequest<PaymentResponse>;
    public record PaybcPaymentResult
    {
        public string PaybcPaymentResultStr { get; set; }
    }
    public record PaymentResponse
    {
        public Guid ApplicationId { get; set; }
        public bool PaidSuccess { get; set; }
        public string Message { get; set; }
        public string TransNumber { get; set; }
        public string TransOrderId { get; set; }
        public string TransDate { get; set; }
        public decimal TransAmount { get; set; }
    }
}
