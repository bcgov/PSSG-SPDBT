namespace Spd.Utilities.FileStorage
{
    public interface IFileStorageService
    {
        Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken);
        Task<StorageQueryResults> HandleQuery(StorageQuery query, CancellationToken cancellationToken);
    }

    public abstract record StorageCommand { }
    public record UploadItemCommand : StorageCommand
    {
        public File File { get; set; } = null!;
    }
    public record DeleteItemCommand : StorageCommand
    {
        public string Id { get; set; } = null!;
    }

    public record File
    {
        public string Key { get; set; } = null!;
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string EntityName { get; set; }
        public Guid EntityId { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Tag[] Tags { get; set; }
        public string? Folder { get; set; }
        public string Classification { get; set; }
    }

    public record Tag
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public abstract record StorageQuery
    {
    }

    public record StorageQueryResults
    {
        public File File { get; set; }
    }

    public record GetItemByKeyQuery : StorageQuery
    {
        public string Key { get; set; }
    }
}
