using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.FileStorage
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddFileStorageProxy(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection("storage:S3").Get<S3Settings>()!;

            services.Configure<S3Settings>(opts => configuration.GetSection("storage:S3").Bind(opts));

            var config = new AmazonS3Config
            {
                ServiceURL = options.Url.ToString(),
                ForcePathStyle = true,
                SignatureVersion = "2",
                SignatureMethod = SigningAlgorithm.HmacSHA1,
                UseHttp = false,
            };

            var client = new AmazonS3Client(new BasicAWSCredentials(options.AccessKey, options.Secret), config);

            services.AddSingleton(client);
            services.AddTransient<IS3StorageService, S3StorageService>();

            return services;
        }
    }
}