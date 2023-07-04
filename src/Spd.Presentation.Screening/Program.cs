using System.Reflection;
using Spd.Presentation.Screening;
using Spd.Utilities.Hosting.Logging;

var builder = WebApplication.CreateBuilder(args);

var secretsFile = Environment.GetEnvironmentVariable($"SECRETS_FILE");
if (!string.IsNullOrEmpty(secretsFile)) builder.Configuration.AddJsonFile(secretsFile, true, true);

Observability.GetInitialLogger(builder.Configuration);

builder.Host.UseDefaultLogging(Assembly.GetEntryAssembly()!.GetName().Name!);

var startup = new Startup(builder.Configuration, builder.Environment);
startup.RegisterServices(builder.Services);

var app = builder.Build();
startup.SetupHttpRequestPipeline(app, builder.Environment);