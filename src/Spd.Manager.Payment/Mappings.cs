using AutoMapper;
using Spd.Resource.Repository.Invoice;
using Spd.Resource.Repository.Payment;
using Spd.Utilities.Payment;

namespace Spd.Manager.Payment
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<PaybcPaymentResult, CreatePaymentCmd>()
                .ForMember(d => d.TransDateTime, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
                .ForMember(d => d.PaymentStatus, opt => opt.MapFrom(s => PaymentStatusEnum.Pending))
                .ForMember(d => d.PaymentType, opt => opt.MapFrom(s => s.IsFromSecurePaymentLink ? PaymentTypeEnum.PayBC_SecurePaymentLink : PaymentTypeEnum.PayBC_OnSubmission));
            CreateMap<PaybcPaymentResult, UpdatePaymentCmd>();
            CreateMap<PaymentResp, PaymentResponse>()
                .ForMember(d => d.PaymentStatus, opt => opt.MapFrom(s => s.PaidSuccess ? PaymentStatusCode.Success : PaymentStatusCode.Failure))
                .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => s.ServiceType))
                .ForMember(d => d.Email, opt => opt.MapFrom(s => s.ApplicationEmail));
            CreateMap<PaymentResp, RefundPaymentCmd>()
                .ForMember(d => d.TxnNumber, opt => opt.MapFrom(s => s.TransactionNumber))
                .ForMember(d => d.OrderNumber, opt => opt.MapFrom(s => s.TransOrderId))
                .ForMember(d => d.TxnAmount, opt => opt.MapFrom(s => s.TransAmount));
            CreateMap<RefundPaymentResult, PaymentRefundResponse>();

            CreateMap<InvoiceResp, CreateInvoiceCmd>()
                .ForMember(d => d.TransactionDate, opt => opt.MapFrom(s => s.TransactionDate ?? DateTimeOffset.Now))
                .ForMember(d => d.GlDate, opt => opt.MapFrom(s => s.GlDate ?? DateTimeOffset.Now))
                .ForMember(d => d.BatchSource, opt => opt.MapFrom(s => "SECURITY PROGRAMS"))
                .ForMember(d => d.CustTrxType, opt => opt.MapFrom(s => "Security Screening"))
                .ForMember(d => d.LateChargesFlag, opt => opt.MapFrom(s => "N"))
                .ForMember(d => d.TermName, opt => opt.MapFrom(s => "IMMEDIATE"))
                .ForMember(d => d.Lines, opt => opt.MapFrom(s => GetInvoiceLines(s)));

            CreateMap<InvoiceResp, InvoiceStatusQuery>();
        }

        private List<InvoiceLine> GetInvoiceLines(InvoiceResp invoiceResp)
        {
            return new List<InvoiceLine> {
                new()
                {
                    LineNumber = 1,
                    LineType = "LINE",
                    MemoLineName = "Security Screening",
                    Description = "Criminal Record Checks",
                    UnitPrice = invoiceResp.TotalAmount,
                    Quantity = 1
                }
            };
        }
    }
}
