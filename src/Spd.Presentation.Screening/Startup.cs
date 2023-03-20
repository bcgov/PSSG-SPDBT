using FluentValidation.AspNetCore;
using Spd.Manager.Membership;
using Spd.Utilities.Hosting;
using Spd.Utilities.Dynamics;
using System.Reflection;
using System.Text.Json.Serialization;
using Spd.Utilities.Address;
using Spd.Presentation.Screening.Controllers;
using Spd.Utilities.LogonUser;
using System.Security.Principal;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Shared.Exceptions;

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
            services
                .AddEndpointsApiExplorer()
                .AddControllers(options =>
                {
                    options.Filters.Add(new ApiExceptionFilter());
                })
                .AddJsonOptions(x =>
                {
                    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                })
                .AddFluentValidation(fv => {
                    fv.RegisterValidatorsFromAssemblyContaining<FluentValidationEntry>();
                    fv.ImplicitlyValidateChildProperties = true;
                });
            ;

            services.ConfigureAuthentication(configuration);
            services.AddHttpContextAccessor();
            services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);

            services.AddAutoMapper(assemblies);
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(assemblies));
            services.AddDistributedMemoryCache();
            services
              .AddDynamicsProxy(configuration)
            //.AddStorageProxy(builder.Configuration)
              .AddAddressAutoComplete(configuration);

            //config component services
            services.ConfigureComponentServices(configuration, hostEnvironment, assemblies);

            
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
            app.UseAuthentication();
            app.UseMiddleware<UsersMiddleware>();
            app.UseAuthorization();
            app.ConfigureComponentPipeline(configuration, hostEnvironment, assemblies);

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}
