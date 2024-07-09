using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.FileStorage
{
    internal class MainFileStorageService : FileStorageService, IMainFileStorageService
    {
        private IOptions<S3Settings> _transientConfig;

        public MainFileStorageService(AmazonS3Client amazonS3Client, IOptions<S3Settings> config, IOptions<S3Settings> transientConfig, ILogger<FileStorageService> logger)
            : base(amazonS3Client, config, logger)
        {
            _transientConfig = transientConfig;
        }

        public async Task<string> HandleCopyStorageFromTransientToMainCommand(CopyStorageFromTransientToMainCommand cmd, CancellationToken cancellationToken)
        {
            return await CopyStorageItemFromTransientToMain(cmd, cancellationToken);
        }

        private async Task<string> CopyStorageItemFromTransientToMain(CopyStorageFromTransientToMainCommand cmd, CancellationToken cancellationToken)
        {
            var folder = cmd.SourceFolder == null ? "" : $"{cmd.SourceFolder}/";
            var key = $"{folder}{cmd.SourceKey}";

            var destFolder = cmd.DestFolder == null ? "" : $"{cmd.DestFolder}/";
            var destKey = $"{destFolder}{cmd.DestKey}";
            var request = new CopyObjectRequest
            {
                SourceBucket = _transientConfig.Value.Bucket,
                SourceKey = key,
                DestinationBucket = _config.Value.Bucket,
                DestinationKey = destKey,
            };

            var response = await _amazonS3Client.CopyObjectAsync(request, cancellationToken);
            response.EnsureSuccess();

            return cmd.SourceKey;
        }
    }
}