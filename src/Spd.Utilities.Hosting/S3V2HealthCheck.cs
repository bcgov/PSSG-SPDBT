using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Spd.Utilities.Hosting;
public class S3V2HealthCheck : IHealthCheck
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3V2HealthCheck(IAmazonS3 s3Client, string bucketName)
    {
        _s3Client = s3Client;
        _bucketName = bucketName;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var request = new ListObjectsV2Request
            {
                BucketName = _bucketName,
                MaxKeys = 1
            };

            await _s3Client.ListObjectsV2Async(request, cancellationToken);

            return HealthCheckResult.Healthy("S3 bucket is reachable.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("S3 health check failed.", ex);
        }
    }
}

