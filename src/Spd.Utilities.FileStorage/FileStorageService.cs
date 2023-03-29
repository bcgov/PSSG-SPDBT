using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.FileStorage
{
    internal class FileStorageService : IFileStorageService
    {
        public AmazonS3Client _amazonS3Client;
        public IOptions<S3Settings> _config;
        public FileStorageService(AmazonS3Client amazonS3Client, IOptions<S3Settings> config)
        {
            _amazonS3Client = amazonS3Client;
            _config = config;
        }
        public async Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken)
        {
            return cmd switch
            {
                UploadItemCommand c => await UploadStorageItem(c, cancellationToken),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<StorageQueryResults> HandleQuery(StorageQuery query, CancellationToken cancellationToken)
        {
            var file = query switch
            {
                GetItemByKeyQuery q => await DownloadStorageItem(q.Key, cancellationToken),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
            return new StorageQueryResults { File = file };
        }

        private async Task<string> UploadStorageItem(UploadItemCommand cmd, CancellationToken cancellationToken)
        {
            File spdFile = cmd.File;
            var folder = spdFile.Folder == null ? "" : $"{spdFile.Folder}/";
            var key = $"{spdFile.EntityName}-{Guid.NewGuid()}";

            var request = new PutObjectRequest
            {
                Key = key,
                ContentType = cmd.File.ContentType,
                InputStream = new MemoryStream(spdFile.Content),
                BucketName = _config.Value.Bucket,
                //TagSet = GetTagSet(cmd.File.Tags), //todo: enable it when we have the permission.
            };
            request.Metadata.Add("contenttype", spdFile.ContentType);
            request.Metadata.Add("filename", spdFile.FileName);
            request.Metadata.Add("entityname", spdFile.EntityName);
            request.Metadata.Add("entityid", spdFile.EntityId.ToString());
            request.Metadata.Add("classification", spdFile.Classification);

            var response = await _amazonS3Client.PutObjectAsync(request, cancellationToken);
            response.EnsureSuccess();
            return request.Key;
        }

        private async Task<File> DownloadStorageItem(string key, CancellationToken ct)
        {
            var request = new GetObjectRequest
            {
                BucketName = _config.Value.Bucket,
                Key = key,
            };

            var response = await _amazonS3Client.GetObjectAsync(request, ct);
            response.EnsureSuccess();

            using var contentStream = response.ResponseStream;

            using var ms = new MemoryStream();

            await contentStream.CopyToAsync(ms);
            contentStream.Flush();
            return new File
            {
                Key = key,
                EntityId = Guid.Parse(response.Metadata["entityid"]),
                EntityName = response.Metadata["entityname"],
                FileName = response.Metadata["filename"],
                ContentType = response.Metadata["contenttype"],
                Classification = response.Metadata["classification"],
                Content = ms.ToArray(),
                //Tags: todo: need to read tags too.
            };
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
