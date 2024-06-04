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
    IRequestHandler<PrintJobStatusQuery, PrintJobStatusResp>,
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
            PrintJob printJob = new(DocumentType.FingerprintLetter, eventResp.RegardingObjectId, null);
            var transformResponse = await _documentTransformationEngine.Transform(
                CreateDocumentTransformRequest(printJob),
                cancellationToken);
            if (transformResponse is BcMailPlusTransformResponse)
            {
                return await PrintViaBcMailPlus((BcMailPlusTransformResponse)transformResponse, request.EventId, cancellationToken);
            };
        }

        return string.Empty;
    }

    public async Task<PrintJobStatusResp> Handle(PrintJobStatusQuery request, CancellationToken cancellationToken)
    {
        var statusResponse = await _printer.Report(new BCMailPlusPrintStatusRequest(request.PrintJobId), cancellationToken);
        var status = statusResponse.Status switch
        {
            JobStatus.Completed => PrintJobStatus.Completed,
            JobStatus.Failed => PrintJobStatus.Failed,
            _ => PrintJobStatus.InProgress,
        };
        return new PrintJobStatusResp(status, statusResponse.Error);
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

    private async Task<string> PrintViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, Guid eventId, CancellationToken cancellationToken)
    {
        var printResponse = await _printer.Send(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        //update event queue
        DateTimeOffset exeTime = DateTimeOffset.UtcNow;
        EventUpdateCmd update = new();
        update.Id = eventId;
        update.LastExeTime = exeTime;
        update.JobId = printResponse.PrintJobId;
        update.StateCode = DynamicsConstants.StateCode_Inactive;
        if (printResponse.Status == JobStatus.Failed)
        {
            update.EventStatusReasonEnum = EventStatusReasonEnum.Fail;
            update.ErrorDescription = printResponse.Error;
        }
        if (printResponse.Status == JobStatus.Completed)
        {
            update.EventStatusReasonEnum = EventStatusReasonEnum.Success;
            update.ErrorDescription = string.Empty;
        }
        if (printResponse.Status == JobStatus.InProgress)
        {
            update.EventStatusReasonEnum = EventStatusReasonEnum.Processed;
            update.ErrorDescription = string.Empty;
        }
        await _eventRepo.ManageAsync(update, cancellationToken);
        return printResponse.PrintJobId!;
    }

    private async Task<PreviewDocumentResp> PreviewViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, CancellationToken cancellationToken)
    {
        var previewResponse = await _printer.Preview(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        if (previewResponse.Status != JobStatus.Completed) throw new InvalidOperationException(previewResponse.Error);
        return new PreviewDocumentResp(previewResponse.ContentType!, previewResponse.Content!);
    }
}