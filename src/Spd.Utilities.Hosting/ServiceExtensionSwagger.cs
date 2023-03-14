using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.Hosting
{
    public static class ServiceExtensionSwagger
    {
        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Spd.ScreeningPortal.API", Version = "v1" });

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

                //To manually define the Document Post API
                c.OperationFilter<AddDocumentPostParamTypesFilter>();
                c.DocumentFilter<CustomModelDocumentFilter<DocumentCreateRequest>>();

                // Manually define the SecureMessaging Post API
                c.OperationFilter<AddMessagePostParamTypesFilter>();
                c.DocumentFilter<CustomModelDocumentFilter<SecureMessagingMessageCreateRequest>>();

                // Manually define the VAC Ad-Hoc Invoice Post API
                c.OperationFilter<AddVacInvoicePostParamTypesFilter>();
                c.DocumentFilter<CustomModelDocumentFilter<VacInvoiceAdHocCreateRequest>>();

                // Return type ApiResponse<T>
                c.OperationFilter<ProducesResponseTypeFilter>();
                // Set the comments path for the Swagger JSON and UI.
                var xmlFileName = $"{typeof(Startup).GetTypeInfo().Assembly.GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFileName);
                c.IncludeXmlComments(xmlPath);
                // Provide sample for JsonElement
                c.SchemaFilter<ExamplesSchemaFilter>();
                c.SchemaFilter<EnumSchemaFilter>(xmlPath);
            });
        }
    }
}
