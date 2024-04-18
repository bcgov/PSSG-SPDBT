using MediatR;
using Spd.Engines.Transformation.Documents;
using Spd.Engines.Transformation.Documents.TransformationStrategies;
using Spd.Utilities.Printing;

namespace Spd.Manager.Common.Admin;

internal partial class AdminManager
  : IRequestHandler<StartPrintJobCommand, string>,
    IRequestHandler<PrintJobStatusQuery, PrintJobStatusResponse>,
    IRequestHandler<PreviewDocumentCommand, PreviewDocumentResponse>
{
    public async Task<string> Handle(StartPrintJobCommand request, CancellationToken cancellationToken)
    {
        var transformResponse = await _documentTransformationEngine.Transform(CreateDocumentTransformRequest(request.PrintJob), cancellationToken);
        return transformResponse switch
        {
            BcMailPlusTransformResponse bcmailplusResponse => await PrintViaBcMailPlus(bcmailplusResponse, cancellationToken),

            _ => throw new NotImplementedException()
        };
    }

    public async Task<PrintJobStatusResponse> Handle(PrintJobStatusQuery request, CancellationToken cancellationToken)
    {
        var statusResponse = await _printer.Report(new BCMailPlusPrintStatusRequest(request.PrintJobId), cancellationToken);
        var status = statusResponse.Status switch
        {
            JobStatus.Completed => PrintJobStatus.Completed,
            JobStatus.Failed => PrintJobStatus.Failed,
            _ => PrintJobStatus.InProgress,
        };
        return new PrintJobStatusResponse(status, statusResponse.Error);
    }

    public async Task<PreviewDocumentResponse> Handle(PreviewDocumentCommand request, CancellationToken cancellationToken)
    {
        var transformResponse = await _documentTransformationEngine.Transform(CreateDocumentTransformRequest(request.PrintJob), cancellationToken);
        return transformResponse switch
        {
            BcMailPlusTransformResponse bcmailplusResponse => await PreviewViaBcMailPlus(bcmailplusResponse, cancellationToken),

            _ => throw new NotImplementedException()
        };
    }

    private static DocumentTransformRequest CreateDocumentTransformRequest(PrintJob printJob) =>
      printJob.DocumentType switch
      {
          DocumentType.FingerprintLetter => new FingerprintLetterTransformRequest(printJob.DocumentReferenceId),

          _ => throw new NotImplementedException()
      };

    private async Task<string> PrintViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, CancellationToken cancellationToken)
    {
        var printResponse = await _printer.Send(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        if (printResponse.Status != JobStatus.Completed) throw new InvalidOperationException(printResponse.Error);
        return printResponse.PrintJobId!;
    }

    private async Task<PreviewDocumentResponse> PreviewViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, CancellationToken cancellationToken)
    {
        var previewResponse = await _printer.Preview(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        if (previewResponse.Status != JobStatus.Completed) throw new InvalidOperationException(previewResponse.Error);
        return new PreviewDocumentResponse(previewResponse.ContentType!, previewResponse.Content!);
    }
}