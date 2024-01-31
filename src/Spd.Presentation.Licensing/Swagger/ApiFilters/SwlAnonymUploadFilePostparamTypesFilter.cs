using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Spd.Presentation.Screening.Swagger.ApiFilters
{
    /// <summary>
    /// To manually definate the Document Post API
    /// - Swashbuckle does not currently support multipart/form-data out of the box
    /// - Manually defined the multipart, file and Data model
    ///
    /// -- https://swagger.io/docs/specification/describing-request-body/multipart-requests/
    /// </summary>
    public class SwlAnonymUploadFilePostparamTypesFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (descriptor != null &&
                descriptor.ControllerName.Equals("WorkerLicensing") &&
                descriptor.ActionName == "UploadLicenceAppFilesAnonymous")
            {
                operation.RequestBody = new OpenApiRequestBody { Required = true };
                operation.RequestBody.Content.Add("multipart/form-data", new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = {
                            {
                                "Documents",
                                new OpenApiSchema
                                {
                                    Type="array",
                                    Items = new OpenApiSchema
                                    {
                                        Type = "string",
                                        Format = "binary",
                                        Description = "PDF, Microsoft Word .docx/.doc files only"
                                    }
                                }
                            },
                            {
                                "LicenceDocumentTypeCode",
                                new OpenApiSchema()
                                {
                                    Description = "LicenceDocumentTypeCode",
                                    Type = "string",                                    
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}