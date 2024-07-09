using MediatR;
using Microsoft.AspNetCore.Http;

namespace Spd.Manager.Licence;
public interface ILicenceAppDocumentManager
{
    public Task<IEnumerable<LicAppFileInfo>> Handle(CreateDocumentInCacheCommand command, CancellationToken ct);
    public Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateDocumentInTransientStoreCommand command, CancellationToken ct);
}

#region file upload
public record CreateDocumentInTransientStoreCommand(LicenceAppDocumentUploadRequest Request, string? BcscId, Guid AppId) : IRequest<IEnumerable<LicenceAppDocumentResponse>>;
public record CreateDocumentInCacheCommand(LicenceAppDocumentUploadRequest Request) : IRequest<IEnumerable<LicAppFileInfo>>;

public record LicenceAppDocumentUploadRequest(
    IList<IFormFile> Documents,
    LicenceDocumentTypeCode LicenceDocumentTypeCode
);
public record LicenceAppDocumentResponse
{
    public Guid DocumentUrlId { get; set; }
    public DateTimeOffset UploadedDateTime { get; set; }
    public Guid? LicenceAppId { get; set; }
    public string? DocumentName { get; set; }
    public string? DocumentExtension { get; set; }
};
public record LicenceAppDocumentsCache
{
    public IEnumerable<LicAppFileInfo> Items { get; set; } = Enumerable.Empty<LicAppFileInfo>();
}
public record LicAppFileInfo
{
    public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
    public string? TempFileKey { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public long FileSize { get; set; }
}
#endregion