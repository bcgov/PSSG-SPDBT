
using MediatR;
using Spd.Resource.Repository.Application;

namespace Spd.Manager.FinanceReconciliation
{
    internal class FinanceReconciliationManager :
        IRequestHandler<GetDuplicatedApplicationNumberCommand, SuccessPaymentResultProcessResponse>,
        IFinanceReconciliationManager
    {
        private readonly IApplicationRepository appRepo;

        public FinanceReconciliationManager(IApplicationRepository appRepo)
        {
            this.appRepo = appRepo;
        }

        public Task<SuccessPaymentResultProcessResponse> Handle(SuccessPaymentResultProcessCommand command, CancellationToken ct)
            => throw new NotImplementedException();

        public async Task<SuccessPaymentResultProcessResponse> Handle(GetDuplicatedApplicationNumberCommand command, CancellationToken ct)
        {
            foreach (var d in command.duplicatedPaymentAppInfos)
            {
                ApplicationResult app = await appRepo.QueryApplicationAsync(new ApplicationQry(Guid.Parse(d.ApplicationId)), ct);
                if (app != null)
                    d.ApplicationNumber = app.ApplicationNumber;
            }
            return new SuccessPaymentResultProcessResponse(command.duplicatedPaymentAppInfos);
        }
    }

}