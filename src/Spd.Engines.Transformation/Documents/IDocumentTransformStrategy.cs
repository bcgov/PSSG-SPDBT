namespace Spd.Engines.Transformation.Documents;

internal interface IDocumentTransformStrategy
{
    bool CanTransform(DocumentTransformRequest request);

    Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken);
}