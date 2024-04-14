using System.Text.Json;

namespace Spd.Utilities.Printing;

public interface IPrinter
{
    Task<PrintResponse> PrintAsync(PrintRequest request, CancellationToken ct);
}

public abstract record PrintRequest();

public abstract record PrintResponse();

public record SynchronousBcMailPlusPrintRequest(string JobClass, IEnumerable<JsonDocument> Items) : PrintRequest;

public record BcMailPlusPrintResponse(IEnumerable<byte[]> Items) : PrintResponse;