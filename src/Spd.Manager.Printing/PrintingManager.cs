using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Manager.Printing.Documents;
using Spd.Manager.Printing.Documents.TransformationStrategies;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Event;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Printing;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Printing;

internal class PrintingManager
  : IRequestHandler<StartPrintJobCommand, ResultResponse>,
    IRequestHandler<PrintJobStatusQuery, ResultResponse>,
    IRequestHandler<PreviewDocumentCommand, PreviewDocumentResp>,
    IPrintingManager
{
    private readonly IDocumentTransformationEngine _documentTransformationEngine;
    private readonly IPrinter _printer;
    private readonly IEventRepository _eventRepo;
    private readonly ILicenceRepository _licenceRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<IPrintingManager> _logger;

    public PrintingManager(IDocumentTransformationEngine documentTransformationEngine,
        IPrinter printer,
        IEventRepository eventRepo,
        ILicenceRepository licenceRepository,
        IMapper mapper,
        ILogger<IPrintingManager> logger)
    {
        this._documentTransformationEngine = documentTransformationEngine;
        this._printer = printer;
        this._eventRepo = eventRepo;
        this._licenceRepository = licenceRepository;
        this._mapper = mapper;
        this._logger = logger;
    }

    public async Task<ResultResponse> Handle(StartPrintJobCommand request, CancellationToken cancellationToken)
    {
        //get event 
        EventResp? eventResp = await _eventRepo.GetAsync(request.EventId, cancellationToken);
        if (eventResp == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid eventqueue id.");

        DocumentTransformRequest transformRequest = CreateDocumentTransformRequest(eventResp);

        try
        {
            var transformResponse = await _documentTransformationEngine.Transform(
                transformRequest,
                cancellationToken);
            if (transformResponse is BcMailPlusTransformResponse)
            {
                BcMailPlusTransformResponse transformResult = (BcMailPlusTransformResponse)transformResponse;
                var printResponse = await _printer.Send(
                    new BCMailPlusPrintRequest(transformResult.JobTemplateId, transformResult.Document),
                    cancellationToken);
                ResultResponse result = _mapper.Map<ResultResponse>(printResponse);
                await UpdateResultInEvent(result, request.EventId, cancellationToken);
                return result;
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message, null);
            ResultResponse result = new()
            {
                PrintJobId = null,
                Status = JobStatusCode.Error,
                Error = $"{ex.Message} {ex.InnerException?.Message}"
            };
            await UpdateResultInEvent(result, request.EventId, cancellationToken);
            return result;
        }
        return null;
    }

    public async Task<ResultResponse> Handle(PrintJobStatusQuery request, CancellationToken cancellationToken)
    {
        //get event 
        EventResp? eventResp = await _eventRepo.GetAsync(request.EventId, cancellationToken);
        if (eventResp == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid eventqueue id.");
        if (eventResp.JobId == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid eventqueue id.The event has never been executed. There is no job id.");

        try
        {
            ReportResponse statusResponse = await _printer.Report(new BCMailPlusPrintStatusRequest(eventResp.JobId), cancellationToken);
            ResultResponse result = _mapper.Map<ResultResponse>(statusResponse);
            await UpdateResultInEvent(result, request.EventId, cancellationToken);
            return result;
        }
        catch (Exception ex)
        {
            ResultResponse result = new()
            {
                PrintJobId = eventResp.JobId,
                Status = JobStatusCode.Fail,
                Error = $"{ex.Message} {ex.InnerException?.Message}"
            };
            //await UpdateResultInEvent(result, request.EventId, cancellationToken); //we should not update job status if we read status failed.
            return result;
        }
    }

    public async Task<PreviewDocumentResp> Handle(PreviewDocumentCommand cmd, CancellationToken cancellationToken)
    {
        LicenceResp? licence = await _licenceRepository.GetAsync(cmd.LicenceId, cancellationToken);
        if (licence == null || licence.WorkerLicenceTypeCode == ServiceTypeEnum.SecurityBusinessLicence)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Cannot find the licence or the licence is not person licence.");
        DocumentTransformRequest transformRequest = new PersonalLicencePreviewTransformRequest(cmd.LicenceId);
        var transformResponse = await _documentTransformationEngine.Transform(transformRequest, cancellationToken);
        return transformResponse switch
        {
            BcMailPlusTransformResponse bcmailplusResponse => await PreviewViaBcMailPlus(bcmailplusResponse, cancellationToken),

            _ => throw new NotImplementedException()
        };
    }

    private static DocumentTransformRequest CreateDocumentTransformRequest(EventResp eventResp)
    {
        if (eventResp.EventTypeEnum == EventTypeEnum.BCMPScreeningFingerprintPrinting && (eventResp.RegardingObjectId == null || eventResp.RegardingObjectName != "spd_application"))
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "ApplicationId cannot be null if it is BCMPScreeningFingerprintPrinting");

        if (eventResp.EventTypeEnum == EventTypeEnum.BCMPSecurityWorkerLicencePrinting && (eventResp.RegardingObjectId == null || eventResp.RegardingObjectName != "spd_licence"))
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "LicenceId cannot be null if it is BCMPSecurityWorkerLicencePrinting");

        if (eventResp.EventTypeEnum == EventTypeEnum.BCMPArmouredVehiclePermitPrinting && (eventResp.RegardingObjectId == null || eventResp.RegardingObjectName != "spd_licence"))
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "LicenceId cannot be null if it is BCMPArmouredVehiclePermitPrinting");

        if (eventResp.EventTypeEnum == EventTypeEnum.BCMPBodyArmourPermitPrinting && (eventResp.RegardingObjectId == null || eventResp.RegardingObjectName != "spd_licence"))
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "LicenceId cannot be null if it is BCMPBodyArmourPermitPrinting");

        if (eventResp.EventTypeEnum == EventTypeEnum.BCMPBusinessLicencePrinting && (eventResp.RegardingObjectId == null || eventResp.RegardingObjectName != "spd_licence"))
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "LicenceId cannot be null if it is BCMPBusinessLicencePrinting");

        return eventResp.EventTypeEnum switch
        {
            EventTypeEnum.BCMPScreeningFingerprintPrinting => new FingerprintLetterTransformRequest(eventResp.RegardingObjectId.Value),
            EventTypeEnum.BCMPSecurityWorkerLicencePrinting => new PersonalLicencePrintingTransformRequest((Guid)eventResp.RegardingObjectId),
            EventTypeEnum.BCMPBodyArmourPermitPrinting => new PersonalLicencePrintingTransformRequest((Guid)eventResp.RegardingObjectId),
            EventTypeEnum.BCMPArmouredVehiclePermitPrinting => new PersonalLicencePrintingTransformRequest((Guid)eventResp.RegardingObjectId),
            EventTypeEnum.BCMPBusinessLicencePrinting => new BizLicencePrintingTransformRequest((Guid)eventResp.RegardingObjectId),
            _ => throw new NotImplementedException()
        };
    }

    private async Task UpdateResultInEvent(ResultResponse resultResponse, Guid eventId, CancellationToken cancellationToken)
    {
        //update event queue
        var cmd = _mapper.Map<EventUpdateCmd>(resultResponse);
        cmd.Id = eventId;
        await _eventRepo.ManageAsync(cmd, cancellationToken);
        return;
    }

    private async Task<PreviewDocumentResp> PreviewViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, CancellationToken cancellationToken)
    {
        var previewResponse = await _printer.Preview(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        if (previewResponse.Status != JobStatus.Completed) throw new InvalidOperationException(previewResponse.Error);
        return new PreviewDocumentResp(previewResponse.ContentType!, previewResponse.Content!, previewResponse.PrintJobId);
    }

}