using System.Reflection;
using System.Security.Principal;
using System.Text.Json.Serialization;
using Amazon.Runtime;
using Amazon.S3;
using FluentValidation;
using FluentValidation.AspNetCore;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Spd.Manager.Screening;
using Spd.Presentation.Screening.Health;
using Spd.Presentation.Screening.Swagger;
using Spd.Utilities.Address;
using Spd.Utilities.BCeIDWS;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using Spd.Utilities.Hosting.Logging;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Payment;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.TempFileStorage;

namespace Spd.Presentation.Screening
{
    public class Startup
    {
        public IConfiguration configuration { get; }
        public IWebHostEnvironment hostEnvironment { get; }
        public Assembly[] assemblies { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment hostEnvironment)
        {
            string assembliesPrefix = "Spd";
            this.configuration = configuration;
            this.hostEnvironment = hostEnvironment;
#pragma warning disable S3885 // "Assembly.Load" should be used
            this.assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "*.dll", SearchOption.TopDirectoryOnly)
                 .Where(assembly =>
                 {
                     var assemblyName = Path.GetFileName(assembly);
                     return !assemblyName.StartsWith("System.") && !assemblyName.StartsWith("Microsoft.") && (string.IsNullOrEmpty(assembliesPrefix) || assemblyName.StartsWith(assembliesPrefix));
                 })
                 .Select(assembly => Assembly.LoadFrom(assembly))
                 .ToArray();
#pragma warning restore S3885 // "Assembly.Load" should be used
        }

        public void RegisterServices(IServiceCollection services)
        {
            // Add services to the container.
            services.ConfigureCors(configuration);
            var assemblyName = $"{typeof(Startup).GetTypeInfo().Assembly.GetName().Name}";
            services.ConfigureSwagger(assemblyName);
            services.ConfigureDataProtection(configuration, "ProtectionShareKeyApp");
            services
                .AddEndpointsApiExplorer()
                .AddControllers()
                .AddJsonOptions(x =>
                {
                    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                })
                .AddFluentValidation(fv =>
                {
                    fv.RegisterValidatorsFromAssemblyContaining<FluentValidationEntry>();
                    fv.ImplicitlyValidateChildProperties = true;
                });

            services.AddGoogleRecaptcha(configuration);
            services.AddValidatorsFromAssemblies(assemblies);
            services.ConfigureAuthentication(configuration);
            services.ConfigureAuthorization();
            services.AddHttpContextAccessor();
            services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);

            services.AddAutoMapper(assemblies);
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(assemblies));

            string? redisConnection = configuration.GetValue<string>("RedisConnection");
            if (redisConnection != null && !string.IsNullOrWhiteSpace(redisConnection))
            {
                services.AddStackExchangeRedisCache(options => options.Configuration = redisConnection);
            }
            else
            {
                services.AddDistributedMemoryCache();
            }
            services.AddTempFileStorageService();
            services.AddFileStorageProxy(configuration);
            services
              .AddBCeIDService(configuration)
              .AddPaymentService(configuration)
              .AddDynamicsProxy(configuration)
              .AddAddressAutoComplete(configuration);

            //config component services
            services.ConfigureComponentServices(configuration, hostEnvironment, assemblies);

            //add smart health check
            if (redisConnection != null)
                services.AddHealthChecks().AddRedis(redisConnection);
            services.AddHealthChecks()
                .AddCheck<DynamicsHealthCheck>("dynamics")
                .AddS3(options =>
                {
                    options.S3Config = new AmazonS3Config
                    {
                        ServiceURL = configuration["storage:MainBucketSettings:url"],
                        ForcePathStyle = true,
                        SignatureVersion = "2",
                        SignatureMethod = SigningAlgorithm.HmacSHA1,
                        UseHttp = false,
                    };
                    options.BucketName = configuration["storage:MainBucketSettings:bucket"];
                    options.Credentials = new BasicAWSCredentials(configuration["storage:MainBucketSettings:accessKey"], configuration["storage:MainBucketSettings:secret"]);
                });

            services.Configure<ForwardedHeadersOptions>(options => { options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto; });
        }

        public void SetupHttpRequestPipeline(WebApplication app, IWebHostEnvironment env)
        {
            app.UseForwardedHeaders();
            app.UsePathBase(configuration.GetValue("pathBase", string.Empty));
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseMiddleware<UsersMiddleware>();
            app.UseAuthorization();
            app.ConfigureComponentPipeline(configuration, hostEnvironment, assemblies);

            app.MapHealthChecks("/health/startup", new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            }).ShortCircuit();
            app.MapHealthChecks("/health/liveness", new HealthCheckOptions { Predicate = _ => false })
               .ShortCircuit();
            app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = _ => false })
               .ShortCircuit();

            app.UseDefaultHttpRequestLogging();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");
            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}