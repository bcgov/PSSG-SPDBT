using FluentValidation.AspNetCore;
using Spd.Infrastructure.Common;
using Spd.Manager.Membership;
using Spd.Utilities.Messaging;
using SPD.DynamicsProxy;
using System.Text.Json.Serialization;

namespace Spd.Presentation.Screening
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void RegisterServices(IServiceCollection services)
        {
            // Add services to the container.
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

            services
              .AddDynamicsProxy(Configuration)
              //.AddStorageProxy(builder.Configuration)
              .AddInMemoryBus()
              .AddTransient<AppExecutionContextMiddleware>();

        }

        public void SetupHttpRequestPipeline(WebApplication app, IWebHostEnvironment env)
        {
            app.UseMiddleware<AppExecutionContextMiddleware>();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseStaticFiles();
            app.UseRouting();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}
