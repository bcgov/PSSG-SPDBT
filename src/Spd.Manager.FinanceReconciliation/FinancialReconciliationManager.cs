using MediatR;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Event;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Manager.FinanceReconciliation
{
    internal class FinanceReconciliationManager :
        IRequestHandler<GetDuplicatedApplicationNumberCommand, SuccessPaymentResultProcessResponse>,
        IRequestHandler<CardPrintAddressReconcilationCommand, IEnumerable<CardPrintAddressReconcilationResponse>>,
        IFinanceReconciliationManager
    {
        private readonly IApplicationRepository appRepo;
        private readonly ILicenceRepository licRepository;
        private readonly IPersonLicApplicationRepository personLicAppRepository;
        private readonly IEventRepository eventRepository;

        public FinanceReconciliationManager(IApplicationRepository appRepo,
            ILicenceRepository licRepository,
            IPersonLicApplicationRepository personLicAppRepository,
            IEventRepository eventRepository)
        {
            this.appRepo = appRepo;
            this.licRepository = licRepository;
            this.personLicAppRepository = personLicAppRepository;
            this.eventRepository = eventRepository;
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

        public async Task<IEnumerable<CardPrintAddressReconcilationResponse>> Handle(CardPrintAddressReconcilationCommand command, CancellationToken ct)
        {
            IEnumerable<EventResp> eventList = await this.eventRepository.QueryAsync(new EventQuery
            {
                EventStatusReasonEnum = EventStatusReasonEnum.Processed,
                EventTypeEnums = new List<EventTypeEnum> { EventTypeEnum.BCMPSecurityWorkerLicencePrinting }
            }, ct);
            IList<CardPrintAddressReconcilationResponse> responses = new List<CardPrintAddressReconcilationResponse>();
            foreach (var e in eventList)
            {
                if (e.RegardingObjectId == null)
                    continue;
                LicenceResp? lic = await licRepository.GetAsync((Guid)e.RegardingObjectId, ct);
                if (lic == null)
                    continue;
                CardPrintAddressReconcilationResponse result = new CardPrintAddressReconcilationResponse();
                LicenceApplicationResp app = await personLicAppRepository.GetLicenceApplicationAsync((Guid)lic.LicenceAppId, ct);
                result.LicenceNumber = lic.LicenceNumber;
                result.JobId = lic.PrintingPreviewJobId;
                result.MailingAddress1 = app.MailingAddressData?.AddressLine1;
                result.MailingAddress2 = app.MailingAddressData?.AddressLine2;
                result.City = app.MailingAddressData?.City;
                result.Country = app.MailingAddressData?.Country;
                result.ProvinceState = app.MailingAddressData?.Province;
                result.PostalCode = app.MailingAddressData?.PostalCode;
                responses.Add(result);
            }

            return responses;
        }
    }

}