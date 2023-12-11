using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Spd.Presentation.Screening.Swagger.ApiFilters;

namespace Spd.Presentation.Screening.Swagger
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

                //c.OperationFilter<AddRequiredHeaderParameter>();
                c.OperationFilter<ProducesResponseTypeFilter>();
                c.OperationFilter<AddApplicationPostParamTypesFilter>();
                // Set the comments path for the Swagger JSON and UI.
                var xmlFileName = $"{assemblyName}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFileName);
                if (File.Exists(xmlPath))
                    c.IncludeXmlComments(xmlPath);
                // Provide sample for JsonElement
                //c.SchemaFilter<ExamplesSchemaFilter>();
                //c.SchemaFilter<EnumSchemaFilter>(xmlPath);
            });
        }
    }
}
