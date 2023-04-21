using Spd.Presentation.Screening;

var builder = WebApplication.CreateBuilder(args);

var secretsFile = Environment.GetEnvironmentVariable($"SECRETS_FILE");
if (!string.IsNullOrEmpty(secretsFile)) builder.Configuration.AddJsonFile(secretsFile, true, true);

var startup = new Startup(builder.Configuration, builder.Environment);
startup.RegisterServices(builder.Services);

var app = builder.Build();
startup.SetupHttpRequestPipeline(app, builder.Environment);