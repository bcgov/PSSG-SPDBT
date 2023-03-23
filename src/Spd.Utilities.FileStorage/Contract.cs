namespace Spd.Utilities.FileStorage
{
    public interface IS3StorageService
    {
        Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken);
    }

    public abstract record StorageCommand { }
    public record UploadItemCommand : StorageCommand
    {
        public StorageItem Item { get; set; } = null!;
    }

    public abstract record StorageItem
    {
        public string? Id { get; set; }
        public string Bucket { get; set; } = string.Empty;
    }

    public record DeleteItemCommand : StorageCommand
    {
        public string Bucket { get; set; } = string.Empty;
        public string Id { get; set; } = null!;
    }

    public record File : StorageItem
    {
        public byte[] Content { get; set; } = Array.Empty<byte>();

        public string Name { get; set; } = null!;
        public string ContentType { get; set; } = null!;
        public string? Folder { get; set; }
    }

    public abstract record StorageQuery 
    {
        public string Bucket { get; set; } = string.Empty;
    }

    public record StorageQueryResults
    {
        public IEnumerable<StorageItem> Items { get; set; } = Array.Empty<StorageItem>();
    }

    public record FileQuery : StorageQuery
    {
        public string? ByKey { get; set; }
        public string? ByFolder { get; set; }
    }
}
