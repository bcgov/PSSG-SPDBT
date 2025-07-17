using MediatR;

namespace Spd.Manager.FinanceReconciliation
{
    public interface IFinanceReconciliationManager
    {
        public Task<SuccessPaymentResultProcessResponse> Handle(SuccessPaymentResultProcessCommand command, CancellationToken ct);
        public Task<SuccessPaymentResultProcessResponse> Handle(GetDuplicatedApplicationNumberCommand command, CancellationToken ct);
        public Task<IEnumerable<CardPrintAddressReconcilationResponse>> Handle(CardPrintAddressReconcilationCommand command, CancellationToken ct);
    }

    public record SuccessPaymentResultProcessCommand(List<SuccessPaymentResult> successPaymentResults) : IRequest<SuccessPaymentResultProcessResponse>;
    public record CardPrintAddressReconcilationCommand() : IRequest<IEnumerable<CardPrintAddressReconcilationResponse>>;
    public record SuccessPaymentResult()
    {
        public string AppId { get; set; } = null!;
        public string PaymentId { get; set; } = null!;
        public string OrderId { get; set; } = null!;
        public string Amount { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public string TransNumber { get; set; } = null!;
        public string TransTime { get; set; } = null!;
    }
    public record SuccessPaymentResultProcessResponse(List<DuplicatedPaymentApplicationInfo> duplicatedPaymentApplicationInfos);

    public record CardPrintAddressReconcilationResponse()
    {
        public string JobId { get; set; } = null!;
        public string LicenceNumber { get; set; } = null!;
        public string? MailingAddress1 { get; set; }
        public string? MailingAddress2 { get; set; }
        public string? City { get; set; }
        public string? ProvinceState { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
    }

    public class DuplicatedPaymentApplicationInfo
    {
        public string ApplicationId { get; set; }
        public string? ApplicationNumber { get; set; }
        public List<SuccessPaymentResult> Payments { get; set; }
    }

    public record GetDuplicatedApplicationNumberCommand(List<DuplicatedPaymentApplicationInfo> duplicatedPaymentAppInfos) : IRequest<SuccessPaymentResultProcessResponse>;

}
