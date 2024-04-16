namespace Spd.Engines.Transformation.Documents;

public interface IDocumentTransformationEngine
{
    Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken);
}

public abstract record DocumentTransformRequest;

public abstract record DocumentData;

public record DocumentTransformResponse(DocumentData Document, string ContentType);

internal interface IDocumentTransformStrategy
{
    bool CanTransform(DocumentTransformRequest request);
    Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken);
}