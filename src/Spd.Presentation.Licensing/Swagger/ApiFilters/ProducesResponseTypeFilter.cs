using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Spd.Presentation.Licensing.Swagger.ApiFilters
{
    internal class ProducesResponseTypeFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var returnType = GetReturnType(context);
            var returnTypeSuccess = returnType;

            var openApiResponseSuccess = GetOpenApiResponse("Success", context, returnTypeSuccess);

            if (returnType.Name == "FileResult")
            {
                openApiResponseSuccess = GetOpenApiResponse("Success", context, returnType, "application/octet-stream");
            }

            if (returnType.Name == "FileStreamResult")
            {
                openApiResponseSuccess = GetOpenApiResponse("Success", context, returnType, "application/pdf");
            }

            operation.Responses.Clear();
            operation.Responses.Add("200", openApiResponseSuccess);
        }

        private static Type? GetReturnType(OperationFilterContext context)
        {
            var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            var returnType = descriptor?.MethodInfo?.ReturnType;

            if (returnType == null)
            {
                return null;
            }

            if (returnType.IsGenericType && returnType.GetGenericTypeDefinition() == typeof(Task<>))
            {
                var returnTypeGenericParam = descriptor?.MethodInfo?.ReturnType?.GetGenericArguments();

                if (returnTypeGenericParam == null || returnTypeGenericParam?.Length == 0)
                {
                    return null;
                }

                returnType = returnTypeGenericParam[0];
            }

            return returnType;
        }

        private static OpenApiResponse GetOpenApiResponse(string description,
            OperationFilterContext context,
            Type returnType,
            string mediaType = "application/json") =>
            new OpenApiResponse
            {
                Description = description,
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    [mediaType] = new OpenApiMediaType
                    {
                        Schema = GetOpenApiSchema(context, returnType)
                    }
                }
            };

        private static OpenApiSchema GetOpenApiSchema(OperationFilterContext context, Type returnType) =>
            context.SchemaGenerator.GenerateSchema(returnType, context.SchemaRepository);
    }
}
