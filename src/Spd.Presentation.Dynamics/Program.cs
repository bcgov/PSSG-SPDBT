using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using Spd.Utilities.Hosting.Logging;
using Spd.Utilities.Payment;
using Spd.Utilities.TempFileStorage;
using System.Reflection;
using System.Text.Json.Serialization;

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
builder.Services.ConfigureSwagger(assemblyName);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
//builder.Services.AddFileStorageProxy(builder.Configuration);

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(assemblies));
builder.Services.AddAutoMapper(assemblies);
builder.Services.AddDistributedMemoryCache();
builder.Services
    .AddTempFileStorageService()
    .AddFileStorageProxy(builder.Configuration)
    .AddPaymentService(builder.Configuration)
    .AddDynamicsProxy(builder.Configuration);
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