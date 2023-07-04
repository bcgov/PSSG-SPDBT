using System.Reflection;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using Spd.Utilities.Hosting.Logging;

var builder = WebApplication.CreateBuilder(args);

var secretsFile = Environment.GetEnvironmentVariable($"SECRETS_FILE");
if (!string.IsNullOrEmpty(secretsFile)) builder.Configuration.AddJsonFile(secretsFile, true, true);

Observability.GetInitialLogger(builder.Configuration);

builder.Host.UseDefaultLogging(Assembly.GetEntryAssembly()!.GetName().Name!);

builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = int.MaxValue; // if don't set default value is: 30 MB
});

builder.Services.ConfigureCors(builder.Configuration);
var assemblyName = $"{typeof(Program).Assembly.GetName().Name}";
builder.Services.ConfigureSwagger(assemblyName);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddFileStorageProxy(builder.Configuration);

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    builder.Configuration.GetSection("authentication:jwt").Bind(options);
    options.Validate();
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
    {
        policy
            .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
            .RequireAuthenticatedUser();
    });
    options.DefaultPolicy = options.GetPolicy(JwtBearerDefaults.AuthenticationScheme)!;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.UseDefaultHttpRequestLogging();

app.MapControllers();

app.Run();