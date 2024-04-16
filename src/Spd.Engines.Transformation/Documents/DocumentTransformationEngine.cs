


namespace Spd.Engines.Transformation.Documents;

internal class DocumentTransformationEngine(IEnumerable<IDocumentTransformStrategy> strategies) : IDocumentTransformationEngine
{
    public Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken)
    {
        var strategy = resolveTransformationStrategy(request);
        if (strategy==null) throw new InvalidOperationException($"No transformation strategy found for {request.GetType().Name}");
        return strategy.Transform(request, cancellationToken);
    }

    private IDocumentTransformStrategy? resolveTransformationStrategy(DocumentTransformRequest request) =>
        strategies.SingleOrDefault(x => x.CanTransform(request));
}
