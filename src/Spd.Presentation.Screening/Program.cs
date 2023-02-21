using Spd.Presentation.Screening;

var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Configuration, builder.Environment);
startup.RegisterServices(builder.Services);

var app = builder.Build();
startup.SetupHttpRequestPipeline(app, builder.Environment);