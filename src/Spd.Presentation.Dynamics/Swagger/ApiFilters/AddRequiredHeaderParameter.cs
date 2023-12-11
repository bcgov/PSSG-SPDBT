using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Spd.Presentation.Dynamics.Swagger.ApiFilters;
public class AddRequiredHeaderParameter : IOperationFilter
{
    private static List<string> IgnoreOrgHeaderControllerName = new List<string>{ "Configuration", "OrgRegistration", "AddressAutoComplete"};
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        
        var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
        if (descriptor != null &&
            !IgnoreOrgHeaderControllerName.Contains(descriptor.ControllerName))
        {
            operation.Parameters.Add(
            new OpenApiParameter
            {
                Name = "organization",
                In = ParameterLocation.Header,
                Description = "Add Organization Id",
                Required = true
            });
        };
    }
}