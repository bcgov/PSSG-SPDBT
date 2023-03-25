using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.FileStorage
{
    internal class S3StorageService : IS3StorageService
    {
        public AmazonS3Client _amazonS3Client;
        public IOptions<S3Settings> _config;
        public S3StorageService(AmazonS3Client amazonS3Client, IOptions<S3Settings> config)
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
            return new StorageQueryResults { SpdFile= file };   
        }

        private async Task<string> UploadStorageItem(UploadItemCommand cmd, CancellationToken cancellationToken)
        {
            SpdFile spdFile = cmd.SpdFile;
            var folder = spdFile.Folder == null ? "" : $"{spdFile.Folder}/";
            var key = $"{spdFile.EntityName}-{Guid.NewGuid()}";

            var request = new PutObjectRequest
            {
                Key = key,
                ContentType = cmd.SpdFile.ContentType,
                InputStream = new MemoryStream(spdFile.Content),
                BucketName = _config.Value.Bucket,
            };
            request.Metadata.Add("contenttype", spdFile.ContentType);
            request.Metadata.Add("filename", spdFile.FileName);
            request.Metadata.Add("entityname", spdFile.EntityName);
            request.Metadata.Add("entityid", spdFile.EntityId.ToString());
            request.Metadata.Add("tag1", spdFile.Tag1);
            request.Metadata.Add("tag2", spdFile.Tag2);
            request.Metadata.Add("tag3", spdFile.Tag3);

            var response = await _amazonS3Client.PutObjectAsync(request, cancellationToken);
            response.EnsureSuccess();

            return request.Key;

        }

        private async Task<SpdFile> DownloadStorageItem(string key, CancellationToken ct)
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
            return new SpdFile
            {
                Key = key,
                EntityId = Guid.Parse(response.Metadata["entityid"]),
                EntityName = response.Metadata["entityname"],
                FileName = response.Metadata["filename"],
                ContentType = response.Metadata["contenttype"],
                Tag1 = response.Metadata["tag1"],
                Tag2 = response.Metadata["tag2"],
                Tag3 = response.Metadata["tag3"],
                Content = ms.ToArray()
            };
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
