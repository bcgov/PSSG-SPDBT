using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Reflection;

namespace Spd.Utilities.Hosting;

public static class ServiceExtensionsHealthChecks
{
    public static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration, Assembly[] assemblies)
    {
        var healthChecks = assemblies.SelectMany(a => a.Discover<IHealthCheck>());

        var healthCheckBuilder = services.AddHealthChecks();

        foreach (var healthCheck in healthChecks)
        {
            healthCheckBuilder.Add(new HealthCheckRegistration(healthCheck.Name, sp => (IHealthCheck)sp.GetRequiredService(healthCheck), null, null));
        }

        var redisConnection = configuration.GetValue<string?>("RedisConnection");
        if (redisConnection != null)
        {
            healthCheckBuilder.AddRedis(redisConnection);
        }

        var s3url = configuration.GetValue<string?>("storage:MainBucketSettings:url");
        if (s3url != null)
        {
            healthCheckBuilder.AddS3(options =>
            {
                options.S3Config = new AmazonS3Config
                {
                    ServiceURL = s3url,
                    ForcePathStyle = true,
                    SignatureVersion = "2",
                    SignatureMethod = SigningAlgorithm.HmacSHA1,
                    UseHttp = false,
                };
                options.BucketName = configuration.GetValue("storage:MainBucketSettings:bucket", string.Empty)!;
                options.Credentials = new BasicAWSCredentials(
                    configuration.GetValue("storage:MainBucketSettings:accessKey", string.Empty),
                    configuration.GetValue("storage:MainBucketSettings:secret", string.Empty));
            });
        }

        return services;
    }
}