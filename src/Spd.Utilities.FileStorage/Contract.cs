namespace Spd.Utilities.FileStorage
{
    public interface IFileStorageService
    {
        Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken);

        Task<StorageQueryResults?> HandleQuery(StorageQuery query, CancellationToken cancellationToken);
    }

    public interface IMainFileStorageService : IFileStorageService
    {
        Task<string> HandleCopyStorageFromTransientToMainCommand(CopyStorageFromTransientToMainCommand cmd, CancellationToken cancellationToken);
    }

    public interface ITransientFileStorageService : IFileStorageService
    {
        Task<string> HandleDeleteCommand(StorageDeleteCommand cmd, CancellationToken cancellationToken);
    }

    public abstract record StorageCommand(string Key, string? Folder);

    public record UploadFileCommand(string Key, string? Folder, File File, FileTag FileTag) : StorageCommand(Key, Folder);
    public record UploadFileStreamCommand(string Key, string? Folder, FileContent FileStream, FileTag FileTag) : StorageCommand(Key, Folder);
    public record UpdateTagsCommand(string Key, string? Folder, FileTag? FileTag) : StorageCommand(Key, Folder);

    //copy the file from source to dest for the same bucket.
    public record CopyFileCommand(string SourceKey, string? SourceFolder, string DestKey, string? DestFolder) : StorageCommand(SourceKey, SourceFolder);

    //copy the file from transient bucket Source to main bucket destination
    public record CopyStorageFromTransientToMainCommand(string SourceKey, string? SourceFolder, string DestKey, string? DestFolder);
    public record StorageDeleteCommand(string Key, string? Folder);
    public record FileTag
    {
        public IEnumerable<Tag> Tags { get; set; } = Array.Empty<Tag>();
    }
    public record File
    {
#pragma warning disable CA1819 // Properties should not return arrays
        public byte[] Content { get; set; } = [];
#pragma warning restore CA1819 // Properties should not return arrays
        public string? ContentType { get; set; }
        public string? FileName { get; set; }
        public IEnumerable<FileMetadata> Metadata { get; set; } = Array.Empty<FileMetadata>();
    }

    public record FileContent
    {
        public Stream? FileContentStream { get; set; }
        public string? ContentType { get; set; }
        public string? FileName { get; set; }
        public IEnumerable<FileMetadata> Metadata { get; set; } = Array.Empty<FileMetadata>();
    }

    public record Tag(string Key, string Value);
    public record FileMetadata(string Key, string Value);

    public abstract record StorageQuery
    {
        public string Key { get; set; } = null!;
        public string? Folder { get; set; }
    }
    public record FileQuery : StorageQuery { }
    public record FileMetadataQuery : StorageQuery { }
    public record StorageQueryResults(string Key, string? Folder) { }
    public record FileQueryResult(string Key, string? Folder, File File, FileTag? FileTag) : StorageQueryResults(Key, Folder);
    public record FileMetadataQueryResult(string Key, string? Folder, IEnumerable<FileMetadata>? Metadata) : StorageQueryResults(Key, Folder);
}