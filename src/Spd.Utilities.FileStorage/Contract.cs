namespace Spd.Utilities.FileStorage
{
    public interface IFileStorageService
    {
        Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken);
        Task<StorageQueryResults> HandleQuery(StorageQuery query, CancellationToken cancellationToken);
    }

    public abstract record StorageCommand { }
    public record UploadFileCommand : StorageCommand
    {
        public File File { get; set; } = null!;
    }
    public record DeleteFileCommand : StorageCommand
    {
        public string Id { get; set; } = null!;
    }

    public record File
    {
        public string Key { get; set; } = null!;
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string ContentType { get; set; }
        public string FileName { get; set; }
        public Metadata[] Metadata { get; set; }
        public Tag[] Tags { get; set; }
        public string? Folder { get; set; }
    }

    public record Tag
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public record Metadata
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

    public record FileQuery : StorageQuery
    {
        public string Key { get; set; }
    }
}
