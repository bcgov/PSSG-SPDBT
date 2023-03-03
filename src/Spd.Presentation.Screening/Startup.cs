using FluentValidation.AspNetCore;
using MediatR;
using Spd.Manager.Membership;
using Spd.Utilities.Hosting;
using SPD.DynamicsProxy;
using System.Reflection;
using System.Text.Json.Serialization;

namespace Spd.Presentation.Screening
{
    public class Startup
    {
        public IConfiguration _configuration { get; }
        public IWebHostEnvironment _hostEnvironment { get; }
        public Assembly[] _assemblies { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment hostEnvironment)
        {
            string assembliesPrefix = "Spd";
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
#pragma warning disable S3885 // "Assembly.Load" should be used
            _assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "*.dll", SearchOption.TopDirectoryOnly)
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
            services.ConfigureCors(_configuration);

            services
                .AddEndpointsApiExplorer()
                .AddSwaggerGen()
                .AddControllersWithViews()
                .AddJsonOptions(x =>
                {
                    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                })
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<FluentValidationEntry>());
            ;

            services.AddAutoMapper(_assemblies);
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(Spd.Manager.Membership.MediatREntrypoint).Assembly));
            services.AddDistributedMemoryCache();
            services
              .AddDynamicsProxy(_configuration);
            //.AddStorageProxy(builder.Configuration);

            services.ConfigureComponentServices(_configuration, _hostEnvironment, _assemblies);
        }

        public void SetupHttpRequestPipeline(WebApplication app, IWebHostEnvironment env)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseStaticFiles();
            app.UseRouting();

            app.ConfigureComponentPipeline(_configuration, _hostEnvironment, _assemblies);

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}
