using System.Configuration;
using System.Reflection;
using System.Security.Principal;
using System.Text.Json.Serialization;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Spd.Presentation.Dynamics.Swagger;
using Spd.Utilities.BCeIDWS;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using Spd.Utilities.Hosting.Logging;
using Spd.Utilities.Payment;
using Spd.Utilities.Printing;
using Spd.Utilities.TempFileStorage;

var builder = WebApplication.CreateBuilder(args);

var assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "*.dll", SearchOption.TopDirectoryOnly)
     .Where(assembly =>
     {
         var assemblyName = Path.GetFileName(assembly);
         return !assemblyName.StartsWith("System.") && !assemblyName.StartsWith("Microsoft.") && assemblyName.StartsWith("Spd");
     })
     .Select(assembly => Assembly.LoadFrom(assembly))
     .ToArray();

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

string? protectionShareKeyAppName = builder.Configuration.GetValue<string>("ProtectionShareKeyAppName");
if (protectionShareKeyAppName == null)
    throw new ConfigurationErrorsException("ProtectionShareKeyAppName is not set correctly.");
builder.Services.ConfigureDataProtection(builder.Configuration, protectionShareKeyAppName);

builder.Services.ConfigureSwagger(assemblyName);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(assemblies));
builder.Services.AddAutoMapper(assemblies);
builder.Services.AddDistributedMemoryCache();
builder.Services
    .AddTempFileStorageService()
    .AddFileStorageProxy(builder.Configuration)
    .AddPaymentService(builder.Configuration)
    .AddDynamicsProxy(builder.Configuration)
    .AddPrinting(builder.Configuration);

builder.Services.ConfigureComponentServices(builder.Configuration, builder.Environment, assemblies);
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

builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);
builder.Services.AddBCeIDService(builder.Configuration);
builder.Services.AddHealthChecks(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapHealthChecks("/health/startup", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
app.MapHealthChecks("/health/liveness", new HealthCheckOptions { Predicate = _ => false })
   .ShortCircuit();
app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = _ => false })
   .ShortCircuit();
app.UseDefaultHttpRequestLogging();
app.MapControllers();

await app.RunAsync();