using MediatR;
using Spd.Manager.Printing.Documents;
using Spd.Manager.Printing.Documents.TransformationStrategies;
using Spd.Utilities.Printing;

namespace Spd.Manager.Printing;

internal class PrintingManager(IDocumentTransformationEngine _documentTransformationEngine, IPrinter _printer)
  : IRequestHandler<StartPrintJobCommand, string>,
    IRequestHandler<PrintJobStatusQuery, PrintJobStatusResp>,
    IRequestHandler<PreviewDocumentCommand, PreviewDocumentResp>,
    IPrintingManager
{
    public async Task<string> Handle(StartPrintJobCommand request, CancellationToken cancellationToken)
    {
        var transformResponse = await _documentTransformationEngine.Transform(
            CreateDocumentTransformRequest(request.PrintJob),
            cancellationToken);
        return transformResponse switch
        {
            BcMailPlusTransformResponse bcmailplusResponse => await PrintViaBcMailPlus(bcmailplusResponse, cancellationToken),

            _ => throw new NotImplementedException()
        };
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

    private static DocumentTransformRequest CreateDocumentTransformRequest(PrintJob printJob) =>
      printJob.DocumentType switch
      {
          DocumentType.FingerprintLetter => new FingerprintLetterTransformRequest(printJob.ApplicationId),

          _ => throw new NotImplementedException()
      };

    private async Task<string> PrintViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, CancellationToken cancellationToken)
    {
        var printResponse = await _printer.Send(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        if (printResponse.Status == JobStatus.Failed) throw new InvalidOperationException(printResponse.Error);
        return printResponse.PrintJobId!;
    }

    private async Task<PreviewDocumentResp> PreviewViaBcMailPlus(BcMailPlusTransformResponse bcmailplusResponse, CancellationToken cancellationToken)
    {
        var previewResponse = await _printer.Preview(new BCMailPlusPrintRequest(bcmailplusResponse.JobTemplateId, bcmailplusResponse.Document), cancellationToken);
        if (previewResponse.Status != JobStatus.Completed) throw new InvalidOperationException(previewResponse.Error);
        return new PreviewDocumentResp(previewResponse.ContentType!, previewResponse.Content!);
    }
}