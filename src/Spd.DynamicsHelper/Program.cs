using Spd.DynamicsHelper;
using FluentValidation.AspNetCore;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Hosting;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

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
