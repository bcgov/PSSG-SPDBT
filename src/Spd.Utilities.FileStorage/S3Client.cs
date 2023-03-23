using Amazon.S3;
using Amazon.S3.Model;

namespace Spd.Utilities.FileStorage
{
    internal class S3StorageService : IS3StorageService
    {
        public AmazonS3Client _amazonS3Client;
        public S3StorageService(AmazonS3Client amazonS3Client)
        {
            _amazonS3Client = amazonS3Client;
        }
        public async Task<string> HandleCommand(StorageCommand cmd, CancellationToken cancellationToken)
        {
            return cmd switch
            {
                UploadItemCommand c => await UploadStorageItem(c, cancellationToken),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<string> UploadStorageItem(UploadItemCommand cmd, CancellationToken cancellationToken)
        {
            //if (!(cmd.Item is Contract.Storage.File file)) throw new NotImplementedException($"handler only supports storing {nameof(Contract.Storage.File)} types");

            //var s3client = ctx.Services.GetRequiredService<AmazonS3Client>();

            //var folder = file.Folder == null ? "" : $"{file.Folder}/";
            //var key = $"{folder}{cmd.Item.Id ?? Guid.NewGuid().ToString()}";

            //var request = new PutObjectRequest
            //{
            //    Key = key,
            //    ContentType = file.ContentType,
            //    InputStream = new MemoryStream(file.Content),
            //    BucketName = file.Bucket,
            //};
            //request.Metadata.Add("contenttype", file.ContentType);
            //request.Metadata.Add("filename", file.Name);

            //var response = await s3client.PutObjectAsync(request);
            //response.EnsureSuccess();

            //return request.Key;
            return null;
        }
    }
}
