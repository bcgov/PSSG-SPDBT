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
            services.AddOptions<S3Settings>("main").Bind(configuration.GetSection("storage:MainBucketSettings"));
            services.AddOptions<S3Settings>("transient").Bind(configuration.GetSection("storage:TransientBucketSettings"));

            services.AddKeyedSingleton<IAmazonS3>("main", (sp, _) =>
            {
                var settings = sp.GetRequiredService<IOptionsMonitor<S3Settings>>().Get("main");
                var config = new AmazonS3Config
                {
                    ServiceURL = settings.Url.ToString(),
                    ForcePathStyle = true,
                    SignatureVersion = "2",
                    SignatureMethod = SigningAlgorithm.HmacSHA1,
                    UseHttp = false,
                };
                return new AmazonS3Client(new BasicAWSCredentials(settings.AccessKey, settings.Secret), config);
            });

            services.AddKeyedSingleton<IAmazonS3>("transient", (sp, _) =>
            {
                var settings = sp.GetRequiredService<IOptionsMonitor<S3Settings>>().Get("transient");
                var config = new AmazonS3Config
                {
                    ServiceURL = settings.Url.ToString(),
                    ForcePathStyle = true,
                    SignatureVersion = "2",
                    SignatureMethod = SigningAlgorithm.HmacSHA1,
                    UseHttp = false,
                };
                return new AmazonS3Client(new BasicAWSCredentials(settings.AccessKey, settings.Secret), config);
            });

            services.AddTransient<IMainFileStorageService, MainFileStorageService>();
            services.AddTransient<ITransientFileStorageService, TransientFileStorageService>();
            services.AddTransient<ITempFileStorageService, TempFileStorageService>();

            return services;
        }
    }
}