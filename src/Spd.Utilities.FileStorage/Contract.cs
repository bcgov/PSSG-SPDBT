namespace Spd.Utilities.FileStorage
{
    public interface IS3StorageService
    {
        Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken);
    }

    public abstract record StorageCommand { }
    public record UploadItemCommand : StorageCommand
    {
        public SpdFile SpdFile { get; set; } = null!;
    }

    public record SpdFile
    {
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


    public record DeleteItemCommand : StorageCommand
    {
        public string Bucket { get; set; } = string.Empty;
        public string Id { get; set; } = null!;
    }



    public abstract record StorageQuery
    {
        public string Bucket { get; set; } = string.Empty;
    }

    public record StorageQueryResults
    {
        public IEnumerable<SpdFile> SpdFiles { get; set; } = Array.Empty<SpdFile>();
    }

    public record FileQuery : StorageQuery
    {
        public string? ByKey { get; set; }
        public string? ByFolder { get; set; }
    }
}
