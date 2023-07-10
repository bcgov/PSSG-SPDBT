using MediatR;
using Spd.Manager.Cases.Application;
using System.ComponentModel.DataAnnotations;

namespace Spd.Manager.Cases.Payment
{
    public interface IPaymentManager
    {
        public Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand request, CancellationToken ct);
    }

    public record PaymentLinkCreateCommand(PaymentLinkCreateRequest PaymentLinkCreateRequest) : IRequest<PaymentLinkResponse>;
    //public record PaymentLinkCreateRequest
    //{
    //    [MaxLength(100)]
    //    public string Description { get; set; }
    //    public PaymentMethodCode PaymentMethod { get; set; } //CC-credit card, VI - debit card
    //    public decimal Amount { get; set; }
    //    public string RedirectUrl { get; set; }
    //    public string? Ref1 { get; set; } //caseId
    //    public string? Ref2 { get; set; }
    //    public string? Ref3 { get; set; }
    //}

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
        CreditCard,
        DebitCard
    }
}
