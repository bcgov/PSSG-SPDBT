using AutoMapper;
using MediatR;
using Spd.Manager.Printing.Documents;
using Spd.Manager.Printing.Documents.TransformationStrategies;
using Spd.Resource.Repository.Event;
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
    private readonly IMapper _mapper;

    public PrintingManager(IDocumentTransformationEngine documentTransformationEngine,
        IPrinter printer,
        IEventRepository eventRepo,
        IMapper mapper)
    {
        this._documentTransformationEngine = documentTransformationEngine;
        this._printer = printer;
        this._eventRepo = eventRepo;
        this._mapper = mapper;
    }
    public async Task<ResultResponse> Handle(StartPrintJobCommand request, CancellationToken cancellationToken)
    {
        //get event 
        EventResp? eventResp = await _eventRepo.GetAsync(request.EventId, cancellationToken);
        if (eventResp == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid eventqueue id.");

        if (eventResp.EventTypeEnum == EventTypeEnum.BCMPScreeningFingerprintPrinting)
        {
            //the returned RegardingObjectTypeName should be spd_application
            if (eventResp.RegardingObjectName != "spd_application")
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid Regarding Object type.");

            try
            {
                PrintJob printJob = new(DocumentType.FingerprintLetter, eventResp.RegardingObjectId, null);
                var transformResponse = await _documentTransformationEngine.Transform(
                    CreateDocumentTransformRequest(printJob),
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
                ResultResponse result = new()
                {
                    PrintJobId = null,
                    Status = JobStatusCode.Fail,
                    Error = $"{ex.Message} {ex.InnerException?.Message}"
                };
                await UpdateResultInEvent(result, request.EventId, cancellationToken);
                return result;
            }
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

    public async Task<PreviewDocumentResp> Handle(PreviewDocumentCommand request, CancellationToken cancellationToken)
    {
        var transformResponse = await _documentTransformationEngine.Transform(CreateDocumentTransformRequest(request.PrintJob), cancellationToken);
        return transformResponse switch
        {
            BcMailPlusTransformResponse bcmailplusResponse => await PreviewViaBcMailPlus(bcmailplusResponse, cancellationToken),

            _ => throw new NotImplementedException()
        };
    }

    private static DocumentTransformRequest CreateDocumentTransformRequest(PrintJob printJob)
    {
        if (printJob.DocumentType == DocumentType.FingerprintLetter && printJob.ApplicationId == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "ApplicationId cannot be null if documentType is FingerprintLetter");

        if (printJob.DocumentType == DocumentType.PersonalLicencePreview && printJob.LicenceId == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "LicenceId cannot be null if documentType is LicencePreview");

        return printJob.DocumentType switch
        {
            DocumentType.FingerprintLetter => new FingerprintLetterTransformRequest((Guid)printJob.ApplicationId),
            DocumentType.PersonalLicencePreview => new PersonalLicencePreviewTransformRequest((Guid)printJob.LicenceId),
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
        return new PreviewDocumentResp(previewResponse.ContentType!, previewResponse.Content!);
    }

}