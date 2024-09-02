using FluentValidation;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Spd.Presentation.Licensing;
using Spd.Presentation.Licensing.Services;
using Spd.Presentation.Licensing.Swagger;
using Spd.Utilities.Address;
using Spd.Utilities.BCeIDWS;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Payment;
using Spd.Utilities.Recaptcha;
using System.Reflection;
using System.Security.Principal;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string assembliesPrefix = "Spd";

Assembly[] assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "*.dll", SearchOption.TopDirectoryOnly)
     .Where(assembly =>
     {
         var assemblyName = Path.GetFileName(assembly);
         return !assemblyName.StartsWith("System.") && !assemblyName.StartsWith("Microsoft.") && (string.IsNullOrEmpty(assembliesPrefix) || assemblyName.StartsWith(assembliesPrefix));
     })
     .Select(assembly => Assembly.LoadFrom(assembly))
     .ToArray();

var secretsFile = Environment.GetEnvironmentVariable($"SECRETS_FILE");
if (!string.IsNullOrEmpty(secretsFile)) builder.Configuration.AddJsonFile(secretsFile, true, true);

builder.Services.ConfigureCors(builder.Configuration);
var assemblyName = $"{typeof(Program).GetTypeInfo().Assembly.GetName().Name}";
builder.Services.ConfigureSwagger(assemblyName);
builder.Services.ConfigureDataProtection(builder.Configuration, "ProtectionShareKeyApp");
builder.Services
    .AddEndpointsApiExplorer()
    .AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.ConfigureAuthentication(builder.Configuration);
builder.Services.ConfigureAuthorization();
builder.Services.AddHttpContextAccessor();
builder.Services.AddValidatorsFromAssemblies(assemblies);
builder.Services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(assemblies));

//add cache
string? redisConnection = builder.Configuration.GetValue<string>("RedisConnection");

if (redisConnection != null && !string.IsNullOrWhiteSpace(redisConnection))
{
    builder.Services.AddStackExchangeRedisCache(options => options.Configuration = redisConnection);
}
else
{
    builder.Services.AddDistributedMemoryCache();
}

builder.Services.AddAutoMapper(assemblies);
builder.Services.AddFileStorageProxy(builder.Configuration);
builder.Services.AddTransient<IMultipartRequestService, MultipartRequestService>();
builder.Services.AddFileStorageProxy(builder.Configuration);
builder.Services
  .AddBCeIDService(builder.Configuration)
  .AddGoogleRecaptcha(builder.Configuration)
  .AddPaymentService(builder.Configuration)
  .AddDynamicsProxy(builder.Configuration)
  .AddAddressAutoComplete(builder.Configuration);
builder.Services.ConfigureComponentServices(builder.Configuration, builder.Environment, assemblies);

builder.Services.AddHealthChecks();

var app = builder.Build();

// Initialize slow dependencies
app.Services.GetRequiredService<AutoMapper.IConfigurationProvider>().CompileMappings();

// Configure the HTTP request pipeline.
app.UsePathBase(builder.Configuration.GetValue("BASE_PATH", string.Empty));
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

app.MapHealthChecks("/health/startup", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
app.MapHealthChecks("/health/liveness", new HealthCheckOptions { Predicate = _ => false })
   .ShortCircuit();
app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = _ => false })
   .ShortCircuit();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html");

await app.RunAsync();