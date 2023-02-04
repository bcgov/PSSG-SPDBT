var builder = WebApplication.CreateBuilder(args);

var startup = new SPD.Api.Startup(builder.Configuration);
startup.RegisterServices(builder.Services);

var app = builder.Build();
startup.SetupHttpRequestPipeline(app, builder.Environment);

