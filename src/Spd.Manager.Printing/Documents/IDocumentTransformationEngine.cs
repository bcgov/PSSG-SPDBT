using System.Text.Json;

namespace Spd.Manager.Printing.Documents;

public interface IDocumentTransformationEngine
{
    Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken);
}

public abstract record DocumentTransformRequest;

public abstract record DocumentTransformResponse;

public record BcMailPlusTransformResponse(string JobTemplateId, JsonDocument Document) : DocumentTransformResponse;