using System.Text.Json;
using MediatR;
using Spd.Engines.Transformation.Documents;
using Spd.Utilities.Printing;

namespace Spd.Manager.Common.Admin;

internal partial class AdminManager
: IRequestHandler<SendToPrintCommand, PrintJobResponse>,
  IRequestHandler<PrintJobStatusQuery, PrintJobStatusResponse>
{
    public async Task<PrintJobResponse> Handle(SendToPrintCommand request, CancellationToken cancellationToken)
    {
        var transformRequest = CreateDocumentTransformRequest(request.JobSpecification);
        var transformResponse = await _documentTransformationEngine.Transform(transformRequest, cancellationToken);
        var document = SerializeDocument(transformResponse.Document);
        var response = await printerService.Preview(new BCMailPlusPrintRequest("", document), cancellationToken);

        return new PrintJobResponse(request.JobId);
    }

    private DocumentTransformRequest CreateDocumentTransformRequest(JobSpecification jobSpecification) =>
        jobSpecification switch
        {
            FingerprintLetterJobSpecification spec => new FingerprintLetterTransformRequest(spec.ApplicationId),

            _ => throw new NotImplementedException()
        };

    private static JsonDocument SerializeDocument(DocumentData document) => JsonSerializer.SerializeToDocument(document);

    public Task<PrintJobStatusResponse> Handle(PrintJobStatusQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
