using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.FileStorage
{
    internal class MainFileStorageService : FileStorageService, IMainFileStorageService
    {
        private readonly S3Settings _transientConfig;

        public MainFileStorageService(
            [FromKeyedServices("main")] IAmazonS3 amazonS3Client,
            IOptionsMonitor<S3Settings> settings)
            : base(amazonS3Client, settings.Get("main"))
        {
            _transientConfig = settings.Get("transient");
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
                SourceBucket = _transientConfig.Bucket,
                SourceKey = key,
                DestinationBucket = _config.Bucket,
                DestinationKey = destKey,
            };

            var response = await _amazonS3Client.CopyObjectAsync(request, cancellationToken);
            response.EnsureSuccess();

            return cmd.SourceKey;
        }
    }
}