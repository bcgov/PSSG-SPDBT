using Amazon.Runtime;
using Amazon.S3;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
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

        //after awssdk upgrade to 4.0.6.8, AspNetCore.HealthChecks.Aws.S3 does not upgrade accordingly, 
        //The AddS3 health check extension internally uses the older ListObjectsRequest API to check connectivity.
        //In newer versions of the AWS SDK, ListObjectsRequest.MaxKeys has been deprecated or removed, replaced by ListObjectsV2Request
        //When your runtime uses a newer AWSSDK.S3 version, that setter no longer exists, triggering the MissingMethodException.
        //We have to Override with a custom health check
        // Replacement for AddS3 (uses ListObjectsV2)
        var s3url = configuration.GetValue<string?>("storage:MainBucketSettings:url");
        var bucket = configuration.GetValue<string?>("storage:MainBucketSettings:bucket");
        var accessKey = configuration.GetValue<string?>("storage:MainBucketSettings:accessKey");
        var secretKey = configuration.GetValue<string?>("storage:MainBucketSettings:secret");

        if (!string.IsNullOrEmpty(s3url) && !string.IsNullOrEmpty(bucket))
        {
            services.AddSingleton<IHealthCheck>(sp =>
            {
                var s3Client = new AmazonS3Client(
                    new BasicAWSCredentials(accessKey, secretKey),
                    new AmazonS3Config
                    {
                        ServiceURL = s3url,
                        ForcePathStyle = true,
                        UseHttp = false
                    });
                return new S3V2HealthCheck(s3Client, bucket);
            });

            healthCheckBuilder.AddCheck<S3V2HealthCheck>("aws_s3_v2");
        }
        return services;
    }

    public static void UseHealthChecks(this WebApplication webApplication)
    {
        webApplication.MapHealthChecks("/health/startup", new HealthCheckOptions
        {
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });
        webApplication.MapHealthChecks("/health/liveness", new HealthCheckOptions { Predicate = _ => false })
           .ShortCircuit();
        webApplication.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = _ => false })
           .ShortCircuit();
    }
}