using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.Payment
{
    public interface IPaymentService
    {
        Task<PaymentResult> HandleCommand(PaymentCommand cmd, CancellationToken ct = default);

        Task<PaymentResult> HandleQuery(PaymentQuery cmd, CancellationToken ct = default);
    }

#pragma warning disable S2094 // Classes should not be empty

    public class PaymentCommand;

    public class PaymentResult;

    public class PaymentQuery;

#pragma warning restore S2094 // Classes should not be empty

    #region direct payment link

    public class CreateDirectPaymentLinkCommand : PaymentCommand
    {
        public string RevenueAccount { get; set; } = null!;
        public string PbcRefNumber { get; set; } = null!;
        public string TransNumber { get; set; } = null!;

        [MaxLength(100)]
        public string? Description { get; set; }

        public PaymentMethodType PaymentMethod { get; set; } //CC-credit card, VI - debit card
        public decimal Amount { get; set; }
        public string RedirectUrl { get; set; } = null!;

        //public string? Ref1 { get; set; } = null; //do not set ref1, it is reserved for paybc internal use
        public string? Ref2 { get; set; }

        public string? Ref3 { get; set; }
    }

    public class CreateDirectPaymentLinkResult : PaymentResult
    {
        public string PaymentLinkUrl { get; set; } = null!;
    };

    public enum PaymentMethodType
    {
        CC, //credit card
        DI //debit card
    }

    #endregion direct payment link

    #region validate direct payment result str

    public class ValidatePaymentResultStrCommand : PaymentCommand
    {
        public string QueryStr { get; set; } = null!;
    }

    public class PaymentValidationResult : PaymentResult
    {
        public bool ValidationPassed { get; set; }
    }

    #endregion validate direct payment result str

    #region direct pay refund

    public class RefundPaymentCmd : PaymentCommand
    {
        public string OrderNumber { get; set; } = null!;
        public string PbcRefNumber { get; set; } = null!;
        public decimal TxnAmount { get; set; }
        public string TxnNumber { get; set; } = null!;
    }

    public class RefundPaymentResult : PaymentResult
    {
        public bool IsSuccess { get; set; }
        public string? RefundId { get; set; }
        public bool Approved { get; set; } //true: approved, false: declined.
        public decimal TxnAmount { get; set; }
        public string OrderNumber { get; set; } = null!;
        public string TxnNumber { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTimeOffset RefundTxnDateTime { get; set; }
    }

    #endregion direct pay refund

    #region Invoice

    public class CreateInvoiceCmd : PaymentCommand
    {
        public string PartyNumber { get; set; } = null!;
        public string AccountNumber { get; set; } = null!;
        public string SiteNumber { get; set; } = null!;
        public string BatchSource { get; set; } = null!;
        public string CustTrxType { get; set; } = null!;
        public DateTimeOffset TransactionDate { get; set; }
        public DateTimeOffset GlDate { get; set; }
        public string? Comments { get; set; }
        public string LateChargesFlag { get; set; } = null!;
        public string TermName { get; set; } = null!;
        public IEnumerable<InvoiceLine> Lines { get; set; } = Array.Empty<InvoiceLine>();
    }

    public class InvoiceLine
    {
        public int LineNumber { get; set; }
        public string LineType { get; set; } = null!;
        public string MemoLineName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
    }

    public class InvoiceResult : PaymentResult
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public string InvoiceNumber { get; set; } = null!;
        public string PbcRefNumber { get; set; } = null!;
        public string PartyNumber { get; set; } = null!;
        public string PartyName { get; set; } = null!;
        public string AccountName { get; set; } = null!;
        public string AccountNumber { get; set; } = null!;
        public string CustomerSiteId { get; set; } = null!;
        public string SiteNumber { get; set; } = null!;
        public string CustTrxDate { get; set; } = null!;
        public string TransactionDate { get; set; } = null!;
        public double AmountDue { get; set; }
    };

    public class InvoiceStatusQuery : PaymentQuery
    {
        public string PartyNumber { get; set; } = null!;
        public string AccountNumber { get; set; } = null!;
        public string SiteNumber { get; set; } = null!;
        public string InvoiceNumber { get; set; } = null!;
    }

    #endregion Invoice
}