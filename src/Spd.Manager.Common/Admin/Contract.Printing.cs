using Amazon.Runtime.Internal;
using MediatR;

namespace Spd.Manager.Common;


public record SendToPrintCommand(Guid JobId, JobSpecification JobSpecification) : IRequest<PrintJobResponse>;

public record PrintJobResponse(Guid JobId);

public abstract record JobSpecification;

public record FingerprintLetterJobSpecification(Guid ApplicationId) : JobSpecification();

public record PrintJobStatusQuery(Guid JobId) : IRequest<PrintJobStatusResponse>;
public record PrintJobStatusResponse(PrintJobStatus Status, string? Error);

public enum PrintJobStatus{
    Pending,
    InProgress,
    Completed,
    Failed,
    Cancelled
}

public record PrintJobContentQuery(Guid JobId) : IRequest<PrintJobContentResponse>;

public record PrintJobContentResponse(Guid JobId, string ContentType, IEnumerable<byte> Content);