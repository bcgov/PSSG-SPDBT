using System.Text.Json;

namespace Spd.Engines.Transformation.Documents;

internal abstract class BcMailPlusTransformStrategyBase<TRequest, TDocument>(string jobTemplate) : IDocumentTransformStrategy
    where TRequest : DocumentTransformRequest
{
    public virtual bool CanTransform(DocumentTransformRequest request) => request is TRequest;

    public virtual async Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken)
    {
        var document = await CreateDocument((TRequest)request, cancellationToken);
        return new BcMailPlusTransformResponse(jobTemplate, JsonSerializer.SerializeToDocument(document));
    }

    protected abstract Task<TDocument> CreateDocument(TRequest request, CancellationToken cancellationToken);
}