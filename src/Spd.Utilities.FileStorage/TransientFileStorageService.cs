using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.FileStorage
{
    internal class TransientFileStorageService : FileStorageService, ITransientFileStorageService
    {
        public TransientFileStorageService(AmazonS3Client amazonS3Client, IOptions<S3Settings> config, ILogger<FileStorageService> logger)
            : base(amazonS3Client, config, logger)
        {
        }

        public async Task<string> HandleDeleteCommand(StorageDeleteCommand cmd, CancellationToken cancellationToken)
        {
            return await DeleteStorageItem(cmd, cancellationToken);
        }

        private async Task<string> DeleteStorageItem(StorageDeleteCommand cmd, CancellationToken cancellationToken)
        {
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";

            var request = new DeleteObjectRequest
            {
                Key = key,
                BucketName = _config.Value.Bucket,
            };

            var response = await _amazonS3Client.DeleteObjectAsync(request, cancellationToken);

            //If the delete action is successful, the service sends back an HTTP 204 response.
            response.EnsureNoContent();
            return cmd.Key;
        }
    }
}