using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.Payment
{
    public interface IPaymentService
    {
        PaymentResult HandleCommand(PaymentCommand cmd);
    }

    public interface PaymentCommand { };
    public interface PaymentResult { };
    public class CreateDirectPaymentLinkCommand : PaymentCommand
    {
        public string RevenueAccount { get; set; } = null!;
        public string PbcRefNumber { get; set; } = null!;

        [MaxLength(100)]
        public string? Description { get; set; }
        public PaymentMethodEnum PaymentMethod { get; set; } //CC-credit card, VI - debit card
        public decimal Amount { get; set; }
        public string RedirectUrl { get; set; } = null!;
        public string? Ref1 { get; set; }
        public string? Ref2 { get; set; }
        public string? Ref3 { get; set; }
    }
    public class CreateDirectPaymentLinkResult : PaymentResult
    {
        public string PaymentLinkUrl { get; set; } = null!;
    };
    public enum PaymentMethodEnum
    {
        CC, //credit card
        DI //debit card
    }
    public class ValidatePaymentResultStrCommand : PaymentCommand
    {
        public string QueryStr { get; set; } = null!;
    }
    public class ValidationResult : PaymentResult
    {
        public bool ValidationPassed { get; set; }
    }
}
