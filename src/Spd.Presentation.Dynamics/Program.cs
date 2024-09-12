using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;
using Spd.Presentation.Dynamics.Swagger;
using Spd.Utilities.BCeIDWS;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using Spd.Utilities.Payment;
using Spd.Utilities.Printing;
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
    var assemblyName = $"{typeof(Program).Assembly.GetName().Name}";

    builder.Services.ConfigureDataProtection(builder.Configuration, "ProtectionShareKeyApp");
    builder.Services.ConfigureSwagger(assemblyName);
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddControllers()
        .AddJsonOptions(x =>
        {
            x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

    builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(assemblies));
    builder.Services.AddAutoMapper(assemblies);

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

    builder.Services
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
    builder.Services.AddRequestDecompression().AddResponseCompression();
    builder.Services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);
    builder.Services.AddBCeIDService(builder.Configuration);
    builder.Services.AddHealthChecks(builder.Configuration, assemblies);

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseRequestDecompression();
    app.UseResponseCompression();
    app.UseRouting();
    app.UseObservabilityMiddleware();
    app.UseHealthChecks();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

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