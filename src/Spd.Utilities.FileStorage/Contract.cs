namespace Spd.Utilities.FileStorage
{
    public interface IFileStorageService
    {
        Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken);
        Task<StorageQueryResults> HandleQuery(StorageQuery query, CancellationToken cancellationToken);
    }

    public abstract record StorageCommand {}
    public record UploadFileCommand : StorageCommand 
    {
        public File File { get; set; } = null!;
    }
    public record UpdateTagsCommand : StorageCommand 
    { 
        public FileTag FileTag { get; set; } = null!;
    }

    public record FileTag
    {
        public string Key { get; set; } = null!;
        public IEnumerable<Tag> Tags { get; set; } = Array.Empty<Tag>();
        public string? Folder { get; set; }
    }
    public record File : FileTag
    {
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string? ContentType { get; set; }
        public string? FileName { get; set; }
        public IEnumerable<Metadata> Metadata { get; set; } = Array.Empty<Metadata>();
    }

    public record Tag
    {
        public string Key { get; set; } = null!;
        public string Value { get; set; } = null!;
    }

    public record Metadata
    {
        public string Key { get; set; } = null!;
        public string Value { get; set; } = null!;
    }

    public abstract record StorageQuery
    {
        public string Key { get; set; } = null!;
        public string? Folder { get; set; }
    }
    public record FileQuery : StorageQuery { }
    public record FileMetadataQuery : StorageQuery { }
    public record StorageQueryResults { }
    public record FileQueryResult : StorageQueryResults
    {
        public File File { get; set; } = null!;
    }
    public record FileMetadataQueryResult : StorageQueryResults
    {
        public IEnumerable<Metadata> Metadata { get; set; }
    }
}
