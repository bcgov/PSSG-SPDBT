using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Rsvp.Cms.Api.Filters;
using Spd.Utilities.Hosting.ApiFilters;

namespace Spd.Utilities.Hosting
{
    public static class ServiceExtensionSwagger
    {
        public static void ConfigureSwagger(this IServiceCollection services, string assemblyName)
        {
            services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
                c.SwaggerDoc("v1", new OpenApiInfo { Title = $"{assemblyName}.API", Version = "v1" });

                // Include 'SecurityScheme' to use JWT Authentication
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Description = "**_ONLY_** input your JWT Bearer token",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });

                c.OperationFilter<AddRequiredHeaderParameter>();
                c.OperationFilter<ProducesResponseTypeFilter>();
                c.OperationFilter<AddApplicationPostParamTypesFilter>();
                // Set the comments path for the Swagger JSON and UI.
                var xmlFileName = $"{assemblyName}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFileName);
                c.IncludeXmlComments(xmlPath);
                // Provide sample for JsonElement
                //c.SchemaFilter<ExamplesSchemaFilter>();
                //c.SchemaFilter<EnumSchemaFilter>(xmlPath);
            });
        }
    }
}
