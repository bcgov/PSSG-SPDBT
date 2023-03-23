using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Spd.DynamicsHelper;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = int.MaxValue;
});
builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = int.MaxValue; // if don't set default value is: 30 MB
});

//builder.Services.Configure<FormOptions>(options =>
//{
//    options.ValueLengthLimit = int.MaxValue;
//    options.MultipartBodyLengthLimit = int.MaxValue; // if don't set default value is: 128 MB
//    options.MultipartHeadersLengthLimit = int.MaxValue;
//});

// Add services to the container.
builder.Services.ConfigureCors(builder.Configuration);
var assemblyName = $"{typeof(Program).Assembly.GetName().Name}";
builder.Services.ConfigureSwagger(assemblyName);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    })
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<FluentValidationEntry>();
        fv.ImplicitlyValidateChildProperties = true;
    });
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddFileStorageProxy(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
