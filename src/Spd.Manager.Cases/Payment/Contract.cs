using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Spd.Manager.Cases.Payment
{
    public interface IPaymentManager
    {
        public Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand request, CancellationToken ct);
    }

    public record PaymentLinkCreateCommand(PaymentLinkCreateRequest PaymentLinkCreateRequest, string RedirectUrl, string Ref1, string Ref2, string Ref3) : IRequest<PaymentLinkResponse>;

    public record PaymentLinkCreateRequest
    {
        [MaxLength(100)]
        public string Description { get; set; }
        public PaymentMethodCode PaymentMethod { get; set; } //CC-credit card, VI - debit card
        public decimal Amount { get; set; }
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
}
