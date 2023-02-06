using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using SPD.Api.ServiceExtensions;
using SPD.Common.ViewModels;
using SPD.Common.ViewModels.Organization;
using System;
using System.Text.Json.Serialization;

namespace SPD.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        private const string AllowSpecificOrigins = "AllowSpecificOrigins";
        private const string AllowedOriginsKey = "AllowedOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void RegisterServices(IServiceCollection services)
        {
            services.ConfigureValidateOptions(Configuration);
            services.ConfigureCors(Configuration, AllowedOriginsKey, AllowSpecificOrigins);

            services.AddControllers()
            .AddJsonOptions(x =>
            {
                x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            })
            .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<FluentValidationEntry>()); ;

            services.AddMediatR(typeof(SPD.Handlers.MediatREntrypoint).Assembly);
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
        }

        public void SetupHttpRequestPipeline(WebApplication app, IWebHostEnvironment env)
        {
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/error-development");
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseCors(AllowSpecificOrigins);

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();

        }
    }
}