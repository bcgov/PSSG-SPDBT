using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Enrichers.Span;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Extensions.Logging;
using System.Globalization;
using System.Net;

namespace Spd.Utilities.Hosting.Logging;

public static class Observability
{
    public const string LogOutputTemplate = "[{Timestamp:HH:mm:ss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}";

    /// <summary>
    /// Create an initial logger to use during Program startup.
    /// </summary>
    /// <param name="configuration">The configuration to use.</param>
    /// <returns>An instance of a logger.</returns>
    public static Microsoft.Extensions.Logging.ILogger GetInitialLogger(IConfiguration configuration)
    {
        Serilog.Debugging.SelfLog.Enable(Console.Error);
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .ReadFrom.Configuration(configuration)
            .Enrich.FromLogContext()
            .WriteTo.Console(outputTemplate: LogOutputTemplate, formatProvider: CultureInfo.InvariantCulture)
            .CreateBootstrapLogger();

        using var factory = new SerilogLoggerFactory(Log.Logger);
        return factory.CreateLogger("Startup");
    }

    public static IHostBuilder UseDefaultLogging(this IHostBuilder builder, string serviceName)
    {
        builder.UseSerilog((ctx, services, config) => config.ConfigureDefaultLogging(ctx.Configuration, services, serviceName));

        return builder;
    }

    public static IApplicationBuilder UseDefaultHttpRequestLogging(this IApplicationBuilder app)
    {
        app.UseSerilogRequestLogging(
            opts =>
            {
                opts.IncludeQueryInRequestPath = true;
                opts.GetLevel = ExcludeHealthChecks;
                opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
                {
                    diagCtx.Set("User", httpCtx.User.Identity?.Name ?? string.Empty);
                    diagCtx.Set("Host", httpCtx.Request.Host.Value);
                    diagCtx.Set("ContentLength", httpCtx.Response.ContentLength?.ToString(CultureInfo.InvariantCulture) ?? string.Empty);
                    diagCtx.Set("Protocol", httpCtx.Request.Protocol);
                    diagCtx.Set("Scheme", httpCtx.Request.Scheme);
                };
            });

        return app;
    }

    private static LoggerConfiguration ConfigureDefaultLogging(this LoggerConfiguration loggerConfiguration, IConfiguration configuration, IServiceProvider services, string serviceName)
    {
        loggerConfiguration
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(services)
            .Enrich.WithMachineName()
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("service", serviceName)
            .Enrich.WithEnvironmentName()
            .Enrich.WithEnvironmentUserName()
            .Enrich.WithClientIp()
            .Enrich.WithSpan(new SpanOptions() { IncludeBaggage = true, IncludeTags = true, IncludeOperationName = true, IncludeTraceFlags = true })
            .WriteTo.Console(outputTemplate: LogOutputTemplate, formatProvider: CultureInfo.InvariantCulture)
            ;

        var splunkConfiguration = configuration.GetSection("Splunk");
        if (splunkConfiguration == null || !splunkConfiguration.GetChildren().Any())
        {
            Log.Warning($"Logs will not be forwarded to Splunk - configuration is missing");
        }
        else
        {
            var hostUrl = splunkConfiguration.GetValue("HostUrl", string.Empty);
            var token = splunkConfiguration.GetValue("Token", string.Empty);

            Log.Information($"Logs will be forwarded to Splunk");

#pragma warning disable CA2000 // Dispose objects before losing scope
#pragma warning disable S4830 // Server certificates should be verified during SSL/TLS connections
            loggerConfiguration
                .WriteTo.EventCollector(
                    splunkHost: hostUrl,
                    eventCollectorToken: token,
                    renderTemplate: false,
                    messageHandler: new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    });
#pragma warning restore CA2000 // Dispose objects before losing scope
#pragma warning restore S4830 // Server certificates should be verified during SSL/TLS connections
        }

        return loggerConfiguration;
    }

    private static LogEventLevel ExcludeHealthChecks(HttpContext ctx, double _, Exception? ex)
    {
        if (ex != null || ctx.Response.StatusCode >= (int)HttpStatusCode.InternalServerError)
        {
            return LogEventLevel.Error;
        }

        return ctx.Request.Path.StartsWithSegments("/hc", StringComparison.InvariantCultureIgnoreCase)
            ? LogEventLevel.Verbose
            : LogEventLevel.Information;
    }
}