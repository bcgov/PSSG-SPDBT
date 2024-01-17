using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
            services.AddSingleton<IFileStorageService>(sp => new FileStorageService(
                mainClient,
                Options.Create(options.TransientBucketSettings)));

            //create transient bucket
            if (options.TransientBucketSettings.Url != null || string.IsNullOrWhiteSpace(options.TransientBucketSettings.Url.ToString()))
            {
                var transientBucketConfig = new AmazonS3Config
                {
                    ServiceURL = options.TransientBucketSettings.Url.ToString(),
                    ForcePathStyle = true,
                    SignatureVersion = "2",
                    SignatureMethod = SigningAlgorithm.HmacSHA1,
                    UseHttp = false,
                };
                var transientClient = new AmazonS3Client(new BasicAWSCredentials(options.TransientBucketSettings.AccessKey, options.TransientBucketSettings.Secret), mainBucketConfig);
                services.AddSingleton<ITransientFileStorageService>(sp => new FileStorageService(
                    transientClient,
                    Options.Create(options.TransientBucketSettings)));
            }

            return services;
        }
    }
}