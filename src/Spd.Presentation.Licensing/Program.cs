using FluentValidation;
using Serilog;
using Spd.Presentation.Licensing;
using Spd.Presentation.Licensing.Services;
using Spd.Presentation.Licensing.Swagger;
using Spd.Utilities.Hosting;
using Spd.Utilities.LogonUser;
using System.Reflection;
using System.Security.Principal;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var secretsFilePath = builder.Configuration.GetValue<string>("SECRETS_FILE");
if (!string.IsNullOrEmpty(secretsFilePath)) builder.Configuration.AddJsonFile(secretsFilePath, true, true);

var logger = builder.ConfigureWebApplicationObservability();

logger.Information("Starting up");

try
{
    var assemblies = ReflectionExtensions.DiscoverLocalAessemblies(prefix: "Spd.");

    builder.Services.ConfigureCors(builder.Configuration);
    var assemblyName = $"{typeof(Program).GetTypeInfo().Assembly.GetName().Name}";

    builder.Services.ConfigureDataProtection(builder.Configuration, "ProtectionShareKeyApp");
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
    builder.Services.AddRequestDecompression().AddResponseCompression(opts => opts.EnableForHttps = true);
    builder.Services.AddValidatorsFromAssemblies(assemblies);
    builder.Services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);
    builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(assemblies));

    var redisConnection = builder.Configuration.GetValue<string>("RedisConnection");
    if (!string.IsNullOrWhiteSpace(redisConnection))
    {
        builder.Services.AddStackExchangeRedisCache(options => options.Configuration = redisConnection);
    }
    else
    {
        logger.Warning("Redis distributed cache is not configure correctly");
        builder.Services.AddDistributedMemoryCache();
    }

    builder.Services.AddAutoMapper(assemblies);
    builder.Services.AddTransient<IMultipartRequestService, MultipartRequestService>();
    builder.Services.AddHealthChecks();

    builder.ConfigureComponents(assemblies, logger);

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    app.UsePathBase(builder.Configuration.GetValue("BASE_PATH", string.Empty));
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseForwardedHeaders();
    app.UseCors();
    app.UseResponseCaching();
    app.UseRequestDecompression();
    app.UseResponseCompression();
    app.UseStaticFiles();
    app.MapFallbackToFile("index.html");
    app.UseRouting();
    app.UseObservabilityMiddleware();
    app.UseHealthChecks();
    app.UseAuthentication();
    app.UseMiddleware<UsersMiddleware>();
    app.UseAuthorization();
    app.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");

    // Initialize slow dependencies
    app.Services.GetRequiredService<AutoMapper.IConfigurationProvider>().CompileMappings();

    await app.RunAsync();

    logger.Information("Stopped");
    return 0;
}
catch (Exception e)
{
    logger.Fatal(e, "An unhandled exception occurred during bootstrapping");
    return -1;
}
finally
{
    await Log.CloseAndFlushAsync();
}