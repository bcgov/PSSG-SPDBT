using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.FileStorage
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddFileStorageProxy(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection("storage").Get<StorageSetting>()!;

            services.Configure<StorageSetting>(opts => configuration.GetSection("storage").Bind(opts));

            //create main bucket
            var mainBucketConfig = new AmazonS3Config
            {
                ServiceURL = options.MainBucketSettings.Url.ToString(),
                ForcePathStyle = true,
                SignatureVersion = "2",
                SignatureMethod = SigningAlgorithm.HmacSHA1,
                UseHttp = false,
            };

            var mainClient = new AmazonS3Client(new BasicAWSCredentials(options.MainBucketSettings.AccessKey, options.MainBucketSettings.Secret), mainBucketConfig);
            services.AddSingleton<IMainFileStorageService>(sp => new MainFileStorageService(
                mainClient,
                Options.Create(options.MainBucketSettings),
                Options.Create(options.TransientBucketSettings),
                sp.GetService<ILogger<FileStorageService>>()
                ));

            //create transient bucket
            if (options.TransientBucketSettings?.Url != null && !string.IsNullOrWhiteSpace(options.TransientBucketSettings?.Url.ToString()))
            {
                var transientBucketConfig = new AmazonS3Config
                {
                    ServiceURL = options.TransientBucketSettings.Url.ToString(),
                    ForcePathStyle = true,
                    SignatureVersion = "2",
                    SignatureMethod = SigningAlgorithm.HmacSHA1,
                    UseHttp = false,
                };
                var transientClient = new AmazonS3Client(new BasicAWSCredentials(options.TransientBucketSettings.AccessKey, options.TransientBucketSettings.Secret), transientBucketConfig);
                services.AddSingleton<ITransientFileStorageService>(sp => new TransientFileStorageService(
                    transientClient,
                    Options.Create(options.TransientBucketSettings),
                    sp.GetService<ILogger<FileStorageService>>()));
            }

            return services;
        }
    }
}