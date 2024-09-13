using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Exceptions;
using Serilog.Sinks.OpenTelemetry;
using System.Reflection;
using System.Security.Claims;

namespace Spd.Utilities.Hosting;

public static class ObservabilityExtensions
{
    private const string logOutputTemplate = "[{Timestamp:HH:mm:ss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}";

    /// <summary>
    /// Configures observability instruments like logging to the web application and return an initial logger
    /// </summary>
    /// <returns>A logger that can be used during starting up the web application</returns>
    public static ILogger ConfigureWebApplicationObservability(this WebApplicationBuilder builder, string? serviceName = null)
    {
        Serilog.Debugging.SelfLog.Enable(Console.Error);
        var logger = CreateBootstrapLogger(builder.Configuration);

        serviceName ??= Assembly.GetEntryAssembly()!.GetName().Name ?? throw new InvalidOperationException("Could not establish the service name");
        var otelEnabled = !builder.Configuration.GetValue("OTEL_SDK_DISABLED", false);
        var otelEndpoint = builder.Configuration.GetValue<Uri>("OTEL_EXPORTER_OTLP_ENDPOINT");
        var otelProtocol = builder.Configuration.GetValue("OTEL_EXPORTER_OLTP_PROTOCOL", "http/protobuf")!.Equals("http/protobuf", StringComparison.OrdinalIgnoreCase)
          ? OtlpExportProtocol.HttpProtobuf
          : OtlpExportProtocol.Grpc;

        builder.Services.AddSerilog((services, config) =>
        {
            config
          .ReadFrom.Configuration(builder.Configuration)
          .ReadFrom.Services(services)
          .Enrich.WithProperty("service", serviceName)
          .Enrich.FromLogContext()
          .Enrich.WithMachineName()
          .Enrich.WithExceptionDetails()
          .Enrich.WithClientIp()
          .Enrich.WithCorrelationId()
          .WriteTo.Console(outputTemplate: logOutputTemplate);

            if (otelEnabled && otelEndpoint != null)
            {
                config.WriteTo.OpenTelemetry(opts =>
            {
                opts.Endpoint = otelEndpoint.ToString();
                opts.Protocol = otelProtocol == OtlpExportProtocol.HttpProtobuf ? OtlpProtocol.HttpProtobuf : OtlpProtocol.Grpc;
                opts.IncludedData = IncludedData.SourceContextAttribute | IncludedData.SpanIdField | IncludedData.TraceIdField;
            });
            }
            else
            {
                logger.Warning("OpenTelemetry is disabled; logs will not be sent");
            }
        });

        if (otelEnabled && otelEndpoint != null)
        {
            logger.Information("OpenTelemetry will export to {Address}", otelEndpoint);

            var enableTracing = !builder.Configuration.GetValue("OTEL_METRICS_EXPORTER", "otlp")!.Equals("none", StringComparison.OrdinalIgnoreCase);

            if (enableTracing)
            {
                builder.Services.AddOpenTelemetry()
                  .ConfigureResource(resource => resource.AddService(serviceName))
                  .WithTracing(tracing => tracing
                    .AddAspNetCoreInstrumentation()
                    .AddRedisInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddOtlpExporter(opts =>
                    {
                        opts.Endpoint = new Uri(otelEndpoint, "/v1/traces");
                        opts.Protocol = otelProtocol;
                        opts.ExportProcessorType = OpenTelemetry.ExportProcessorType.Batch;
                    }));
            }
            else
            {
                logger.Warning("OpenTelemetry tracing is disabled");
            }

            var enableMetrics = !builder.Configuration.GetValue("OTEL_TRACES_EXPORTER", "otlp")!.Equals("none", StringComparison.OrdinalIgnoreCase);
            if (enableMetrics)
            {
                builder.Services.AddOpenTelemetry()
                  .WithMetrics(metrics => metrics
                  .AddAspNetCoreInstrumentation()
                  .AddRuntimeInstrumentation()
                  .AddHttpClientInstrumentation()
                  .AddOtlpExporter(opts =>
                  {
                      opts.Endpoint = new Uri(otelEndpoint, "/v1/metrics");
                      opts.Protocol = otelProtocol;
                  }));
            }
            else
            {
                logger.Warning("OpenTelemetry metrics is disabled");
            }
        }
        else
        {
            logger.Warning("OpenTelemetry is disabled; metrics and traces will not be sent");
        }

        return logger;
    }

    /// <summary>
    /// Adds observability instruments like logging to the web application's middleware pipelines
    /// </summary>
    public static void UseObservabilityMiddleware(this WebApplication webApplication)
    {
        webApplication.UseSerilogRequestLogging(opts =>
        {
            opts.IncludeQueryInRequestPath = true;
            opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
        {
            diagCtx.Set("User", httpCtx.User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty);
        };
        });
    }

    private static ILogger CreateBootstrapLogger(IConfiguration configuration)
    {
        Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(configuration).WriteTo.Console(outputTemplate: logOutputTemplate).CreateBootstrapLogger();
        return Log.Logger;
    }
}