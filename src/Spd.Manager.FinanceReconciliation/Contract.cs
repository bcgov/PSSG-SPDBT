using MediatR;

namespace Spd.Manager.FinanceReconciliation
{
    public interface IFinanceReconciliationManager
    {
        public Task<SuccessPaymentResultProcessResponse> Handle(SuccessPaymentResultProcessCommand command, CancellationToken ct);
    }

    public record SuccessPaymentResultProcessCommand(List<SuccessPaymentResult> successPaymentResults) : IRequest<SuccessPaymentResultProcessResponse>;
    public record SuccessPaymentResult()
    {
        public string AppId { get; set; }
        public string PaymentId { get; set; }
        public string OrderId { get; set; }
        public string Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string TransNumber { get; set; }
        public string TransTime { get; set; }
    }
    public record SuccessPaymentResultProcessResponse()
    {
        public List<DuplicatedPaymentApplicationInfo> DuplicatedPaymentApplicationInfos { get; set; }
    }

    public class DuplicatedPaymentApplicationInfo
    {
        public string ApplicationId { get; set; }
        public string ApplicationNumber { get; set; }
        public List<SuccessPaymentResult> Payments { get; set; }
    }
}
