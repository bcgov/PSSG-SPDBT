
namespace Spd.Manager.FinanceReconciliation
{
    internal class FinanceReconciliationManager :
        IFinanceReconciliationManager
    {

        public FinanceReconciliationManager()
        {
        }

        public Task<SuccessPaymentResultProcessResponse> Handle(SuccessPaymentResultProcessCommand command, CancellationToken ct)
            => throw new NotImplementedException();
    }

}