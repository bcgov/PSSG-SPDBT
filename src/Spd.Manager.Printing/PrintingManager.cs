using MediatR;
using Spd.Manager.Printing.Documents;
using Spd.Manager.Printing.Documents.TransformationStrategies;
using Spd.Resource.Repository.Event;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Printing;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Printing;

internal class PrintingManager(IDocumentTransformationEngine _documentTransformationEngine,
    IPrinter _printer,
    IEventRepository _eventRepo)
  : IRequestHandler<StartPrintJobCommand, string>,
    IRequestHandler<PrintJobStatusQuery, string>,
    IRequestHandler<PreviewDocumentCommand, PreviewDocumentResp>,
    IPrintingManager
{
    public async Task<string> Handle(StartPrintJobCommand request, CancellationToken cancellationToken)
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
                    ResultResponse resultResponse = new(printResponse.PrintJobId,
                        printResponse.Status,
                        printResponse.Error);
                    return await UpdateResultInEvent(resultResponse, request.EventId, cancellationToken);
                };
            }
            catch (Exception ex)
            {
                ResultResponse result = new(null, JobStatus.Failed, $"{ex.Message} {ex.InnerException?.Message}");
                return await UpdateResultInEvent(result, request.EventId, cancellationToken);
            }
        }

        return string.Empty;
    }

    public async Task<string> Handle(PrintJobStatusQuery request, CancellationToken cancellationToken)
    {
        //get event 
        EventResp? eventResp = await _eventRepo.GetAsync(request.EventId, cancellationToken);
        if (eventResp == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid eventqueue id.");
        if (eventResp.JobId == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid eventqueue id.The event has never been executed. There is no job id.");

        try
        {
            var statusResponse = await _printer.Report(new BCMailPlusPrintStatusRequest(eventResp.JobId), cancellationToken);
            ResultResponse resultResponse = new(statusResponse.PrintJobId,
                statusResponse.Status,
                statusResponse.Error);
            return await UpdateResultInEvent(resultResponse, request.EventId, cancellationToken);
        }
        catch (Exception ex)
        {
            ResultResponse result = new(null, JobStatus.Failed, $"{ex.Message} {ex.InnerException?.Message}");
            return await UpdateResultInEvent(result, request.EventId, cancellationToken);
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

    private async Task<string> UpdateResultInEvent(ResultResponse resultResponse, Guid eventId, CancellationToken cancellationToken)
    {
        //update event queue
        DateTimeOffset exeTime = DateTimeOffset.UtcNow;
        EventUpdateCmd update = new();
        update.Id = eventId;
        update.LastExeTime = exeTime;
        update.JobId = resultResponse.PrintJobId;
        update.StateCode = DynamicsConstants.StateCode_Inactive;
        if (resultResponse.Status == JobStatus.Failed)
        {
            update.EventStatusReasonEnum = EventStatusReasonEnum.Fail;
            update.ErrorDescription = resultResponse.Error;
        }
        if (resultResponse.Status == JobStatus.Completed)
        {
            update.EventStatusReasonEnum = EventStatusReasonEnum.Success;
            update.ErrorDescription = string.Empty;
        }
        if (resultResponse.Status == JobStatus.InProgress)
        {
            update.EventStatusReasonEnum = EventStatusReasonEnum.Processed;
            update.ErrorDescription = string.Empty;
        }
        await _eventRepo.ManageAsync(update, cancellationToken);
        return resultResponse.PrintJobId;
    }

    private async Task<PreviewDocumentResp> PreviewViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, CancellationToken cancellationToken)
    {
        var previewResponse = await _printer.Preview(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        if (previewResponse.Status != JobStatus.Completed) throw new InvalidOperationException(previewResponse.Error);
        return new PreviewDocumentResp(previewResponse.ContentType!, previewResponse.Content!);
    }

    private record ResultResponse(string PrintJobId, JobStatus Status, string? Error);
}