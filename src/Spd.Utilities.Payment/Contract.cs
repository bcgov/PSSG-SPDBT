using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Spd.Utilities.Payment
{
    public interface IPaymentService
    {
        Task<PaymentResult> HandleCommand(PaymentCommand cmd);
    }

    public interface PaymentCommand { };
    public interface PaymentResult { };

    # region direct payment link
    public class CreateDirectPaymentLinkCommand : PaymentCommand
    {
        public string RevenueAccount { get; set; } = null!;
        public string PbcRefNumber { get; set; } = null!;
        public string TransNumber { get; set; } = null!;
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
    #endregion

    #region validate direct payment result str
    public class ValidatePaymentResultStrCommand : PaymentCommand
    {
        public string QueryStr { get; set; } = null!;
    }
    public class PaymentValidationResult : PaymentResult
    {
        public bool ValidationPassed { get; set; }
    }
    #endregion

    #region direct pay refund
    public class RefundPaymentCommand : PaymentCommand
    {
        public string OrderNumber { get; set; } = null!;
        public string PbcRefNumber { get; set; } = null!;
        public decimal TxnAmount { get; set; }
        public string TxnNumber { get; set; } = null!;
    }
    public class RefundPaymentResult : PaymentResult
    {
        public string RefundId { get; set; }
        public bool Approved { get; set; } //true: approved, false: declined.
        public decimal TxnAmount { get; set; }
        public string OrderNumber { get; set; } = null!;
        public string TxnNumber { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTimeOffset RefundTxnDateTime { get; set; }
    }
    #endregion
}
