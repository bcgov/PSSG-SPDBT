using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.FileStorage
{
    internal class FileStorageService : IFileStorageService
    {
        protected AmazonS3Client _amazonS3Client;
        protected IOptions<S3Settings> _config;
        public FileStorageService(AmazonS3Client amazonS3Client, IOptions<S3Settings> config)
        {
            _amazonS3Client = amazonS3Client;
            _config = config;
        }
        public async Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken)
        {
            return cmd switch
            {
                UploadFileCommand c => await UploadStorageItem(c, cancellationToken),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<StorageQueryResults> HandleQuery(StorageQuery query, CancellationToken cancellationToken)
        {
            return query switch
            {
                FileQuery q => await DownloadStorageItem(q.Key, q.Folder, cancellationToken),
                FileExistsQuery q => await StorageItemExists(q.Key, q.Folder, cancellationToken),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<string> UploadStorageItem(UploadFileCommand cmd, CancellationToken cancellationToken)
        {
            File file = cmd.File;
            var folder = file.Folder == null ? "" : $"{file.Folder}/";
            var key = $"{folder}{cmd.File.Key}";

            var request = new PutObjectRequest
            {
                Key = key,
                ContentType = cmd.File.ContentType,
                InputStream = new MemoryStream(file.Content),
                BucketName = _config.Value.Bucket,
                TagSet = GetTagSet(cmd.File.Tags),
            };
            request.Metadata.Add("contenttype", file.ContentType);
            request.Metadata.Add("filename", file.FileName);
            if (file.Metadata != null)
            {
                foreach (Metadata md in file.Metadata)
                    request.Metadata.Add(md.Key, md.Value);
            }

            var response = await _amazonS3Client.PutObjectAsync(request, cancellationToken);
            response.EnsureSuccess();

            return cmd.File.Key;
        }

        private async Task<FileQueryResult> DownloadStorageItem(string key, string? folder, CancellationToken ct)
        {
            var dir = folder == null ? "" : $"{folder}/";
            var requestKey = $"{dir}{key}";
            var request = new GetObjectRequest
            {
                BucketName = _config.Value.Bucket,
                Key = requestKey,
            };

            var response = await _amazonS3Client.GetObjectAsync(request, ct);
            response.EnsureSuccess();

            using var contentStream = response.ResponseStream;

            using var ms = new MemoryStream();

            await contentStream.CopyToAsync(ms);
            contentStream.Flush();
            return new FileQueryResult
            {
                File = new File
                {
                    Key = key,
                    ContentType = response.Metadata["contentType"],
                    FileName = response.Metadata["filename"],
                    Content = ms.ToArray(),
                    Metadata = GetMetadata(response).ToArray(),
                }
            };
        }

        private async Task<FileExistsQueryResult> StorageItemExists(string key, string? folder, CancellationToken cancellationToken)
        {
            try
            {
                var dir = folder == null ? "" : $"{folder}/";
                var requestKey = $"{dir}{key}";

                await _amazonS3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest()
                {
                    BucketName = _config.Value.Bucket,
                    Key = requestKey,
                }, cancellationToken);
                return new FileExistsQueryResult { FileExists = true };
            }
            catch (AmazonS3Exception ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                    return new FileExistsQueryResult { FileExists = false };

                //status wasn't not found, so throw the exception
                throw;
            }
        }

        private List<Amazon.S3.Model.Tag> GetTagSet(Tag[] tags)
        {
            if (tags != null && tags.Any())
            {
                var taglist = new List<Amazon.S3.Model.Tag>();
                foreach (Tag tag in tags)
                {
                    taglist.Add(new Amazon.S3.Model.Tag() { Key = tag.Key, Value = tag.Value });
                }
                return taglist;
            }
            return null;
        }

        private List<Metadata> GetMetadata(GetObjectResponse response)
        {
            var metadata = new List<Metadata>();
            MetadataCollection mc = response.Metadata;
            foreach (var key in mc.Keys)
            {
                if (key != "contentType" && key != "fileName")
                {
                    metadata.Add(new Metadata { Key = key, Value = mc[key] });
                }
            }
            return metadata;
        }
    }

    internal static class S3ClientEx
    {
        public static void EnsureSuccess(this AmazonWebServiceResponse response)
        {
            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                throw new InvalidOperationException($"Operation failed with status {response.HttpStatusCode}");
        }
    }
}
