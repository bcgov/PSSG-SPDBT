using Amazon.S3.Model;

namespace Spd.Utilities.FileStorage
{
    public interface IS3StorageService
    {
        Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken);
        Task<StorageQueryResults> HandleQuery(StorageQuery query, CancellationToken cancellationToken);
    }

    public abstract record StorageCommand { }
    public record UploadItemCommand : StorageCommand
    {
        public SpdFile SpdFile { get; set; } = null!;
    }
    public record DeleteItemCommand : StorageCommand
    {
        public string Id { get; set; } = null!;
    }

    public record SpdFile
    {
        public string Key { get; set; } = null!;
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string EntityName { get; set; }
        public Guid EntityId { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string Tag1 { get; set; }
        public string Tag2 { get; set; }
        public string Tag3 { get; set; }
        public string? Folder { get; set; }
    }


    public abstract record StorageQuery
    {
    }

    public record StorageQueryResults
    {
        public SpdFile SpdFile { get; set; }
    }

    public record GetItemByKeyQuery : StorageQuery
    {
        public string Key { get; set; }
    }
}
