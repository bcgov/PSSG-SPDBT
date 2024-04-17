using System.Text.Json;

namespace Spd.Engines.Transformation.Documents;

public interface IDocumentTransformationEngine
{
    Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken);
}

public abstract record DocumentTransformRequest;

public abstract record DocumentTransformResponse;

public record BcMailPlusTransformResponse(string JobTemplateId, JsonDocument Document) : DocumentTransformResponse;

internal interface IDocumentTransformStrategy
{
    bool CanTransform(DocumentTransformRequest request);

    Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken);
}