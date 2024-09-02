using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using System.Web;

namespace Spd.Utilities.FileStorage
{
    internal abstract class FileStorageService : IFileStorageService
    {
        protected readonly IAmazonS3 _amazonS3Client;
        protected readonly S3Settings _config;

        protected FileStorageService(IAmazonS3 amazonS3Client, S3Settings config)
        {
            _amazonS3Client = amazonS3Client;
            _config = config;
        }

        public async Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken)
        {
            return cmd switch
            {
                UploadFileCommand c => await UploadStorageItem(c, cancellationToken),
                UploadFileStreamCommand c => await UploadStorageItemStream(c, cancellationToken),
                UpdateTagsCommand c => await UpdateTags(c, cancellationToken),
                CopyFileCommand c => await CopyStorageItem(c, cancellationToken),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<StorageQueryResults?> HandleQuery(StorageQuery query, CancellationToken cancellationToken)
        {
            return query switch
            {
                FileQuery q => await DownloadStorageItem(q.Key, q.Folder, cancellationToken),
                FileMetadataQuery q => await GetStorageMetaData(q.Key, q.Folder, cancellationToken),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<string> UploadStorageItem(UploadFileCommand cmd, CancellationToken cancellationToken)
        {
            File file = cmd.File;
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";

            var request = new PutObjectRequest
            {
                Key = key,
                ContentType = cmd.File.ContentType,
                InputStream = new MemoryStream(file.Content),
                BucketName = _config.Bucket,
                TagSet = GetTagSet(cmd.FileTag?.Tags ?? []),
            };
            request.Metadata.Add("contenttype", file.ContentType);
            request.Metadata.Add("filename", HttpUtility.HtmlEncode(file.FileName));
            if (file.Metadata != null)
            {
                foreach (FileMetadata md in file.Metadata)
                    request.Metadata.Add(md.Key, md.Value);
            }

            var response = await _amazonS3Client.PutObjectAsync(request, cancellationToken);
            response.EnsureSuccess();

            return cmd.Key;
        }

        private async Task<string> UploadStorageItemStream(UploadFileStreamCommand cmd, CancellationToken cancellationToken)
        {
            FileContent file = cmd.FileStream;
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";

            var request = new PutObjectRequest
            {
                Key = key,
                ContentType = cmd.FileStream.ContentType,
                InputStream = file.FileContentStream,
                BucketName = _config.Bucket,
                TagSet = GetTagSet(cmd.FileTag?.Tags ?? []),
            };
            request.Metadata.Add("contenttype", file.ContentType);
            request.Metadata.Add("filename", HttpUtility.HtmlEncode(file.FileName));
            if (file.Metadata != null)
            {
                foreach (FileMetadata md in file.Metadata)
                    request.Metadata.Add(md.Key, md.Value);
            }

            var response = await _amazonS3Client.PutObjectAsync(request, cancellationToken);
            response.EnsureSuccess();

            return cmd.Key;
        }

        private async Task<string> UpdateTags(UpdateTagsCommand cmd, CancellationToken cancellationToken)
        {
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";

            var request = new PutObjectTaggingRequest
            {
                Key = key,
                BucketName = _config.Bucket,
                Tagging = new Tagging { TagSet = GetTagSet(cmd.FileTag?.Tags ?? []) }
            };

            var response = await _amazonS3Client.PutObjectTaggingAsync(request, cancellationToken);
            response.EnsureSuccess();

            return cmd.Key;
        }

        private async Task<string> CopyStorageItem(CopyFileCommand cmd, CancellationToken cancellationToken)
        {
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";

            var destFolder = cmd.DestFolder == null ? "" : $"{cmd.DestFolder}/";
            var destKey = $"{destFolder}{cmd.DestKey}";
            var request = new CopyObjectRequest
            {
                SourceBucket = this._config.Bucket,
                SourceKey = key,
                DestinationBucket = this._config.Bucket,
                DestinationKey = destKey,
            };

            var response = await _amazonS3Client.CopyObjectAsync(request, cancellationToken);
            response.EnsureSuccess();

            return cmd.Key;
        }

        private async Task<FileQueryResult> DownloadStorageItem(string key, string? folder, CancellationToken ct)
        {
            var dir = folder == null ? "" : $"{folder}/";
            var requestKey = $"{dir}{key}";

            //get object
            var request = new GetObjectRequest
            {
                BucketName = _config.Bucket,
                Key = requestKey,
            };
            var response = await _amazonS3Client.GetObjectAsync(request, ct);
            response.EnsureSuccess();
            using var contentStream = response.ResponseStream;
            using var ms = new MemoryStream();
            await contentStream.CopyToAsync(ms, ct);
            await contentStream.FlushAsync(ct);

            //get tagging
            var tagResponse = await _amazonS3Client.GetObjectTaggingAsync(
                new GetObjectTaggingRequest
                {
                    BucketName = _config.Bucket,
                    Key = requestKey,
                }, ct);
            tagResponse.EnsureSuccess();

            return new FileQueryResult
            (
                key,
                folder,
                new File
                {
                    ContentType = response.Metadata["contentType"],
                    FileName = response.Metadata["filename"],
                    Content = ms.ToArray(),
                    Metadata = GetMetadata(response.Metadata).AsEnumerable(),
                },
                new FileTag
                {
                    Tags = GetTags(tagResponse.Tagging).AsEnumerable()
                }
            );
        }

        private async Task<FileMetadataQueryResult?> GetStorageMetaData(string key, string? folder, CancellationToken cancellationToken)
        {
            try
            {
                var dir = folder == null ? "" : $"{folder}/";
                var requestKey = $"{dir}{key}";

                GetObjectMetadataResponse response = await _amazonS3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest()
                {
                    BucketName = _config.Bucket,
                    Key = requestKey,
                }, cancellationToken);
                return new FileMetadataQueryResult(key, folder, GetMetadata(response.Metadata));
            }
            catch (AmazonS3Exception ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                    return null;

                //status wasn't not found, so throw the exception
                throw;
            }
        }

        private static List<Amazon.S3.Model.Tag> GetTagSet(IEnumerable<Tag> tags)
            =>
            tags.Select(tag => new Amazon.S3.Model.Tag()
            {
                Key = tag.Key,
                Value = tag.Value
            }).ToList();

        private static List<FileMetadata> GetMetadata(MetadataCollection mc) =>
            mc.Keys.Where(key => key != "contentType" && key != "fileName")
                .Select(key => new FileMetadata(key, mc[key]))
                .ToList();

        private static List<Tag> GetTags(List<Amazon.S3.Model.Tag> tags) =>
            tags.ConvertAll(tag => new Tag(tag.Key, tag.Value));
    }

    internal static class S3ClientEx
    {
        public static void EnsureSuccess(this AmazonWebServiceResponse response)
        {
            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                throw new InvalidOperationException($"Operation failed with status {response.HttpStatusCode}");
        }

        public static void EnsureNoContent(this AmazonWebServiceResponse response)
        {
            if (response.HttpStatusCode != System.Net.HttpStatusCode.NoContent)
                throw new InvalidOperationException($"Delete Operation failed with status {response.HttpStatusCode}");
        }
    }
}