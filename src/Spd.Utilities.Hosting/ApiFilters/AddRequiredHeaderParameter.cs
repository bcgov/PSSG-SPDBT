using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Rsvp.Cms.Api.Filters;
public class AddRequiredHeaderParameter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Parameters.Add(
            new OpenApiParameter
            {
                Name = "organization",
                In = ParameterLocation.Header,
                Description = "Add Organization Id",
                Required = true
            }
        );
    }
}