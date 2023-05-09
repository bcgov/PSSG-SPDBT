using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection.Metadata;

namespace Rsvp.Cms.Api.Filters
{
    /// <summary>
    /// To manually definate the Document Post API
    /// - Swashbuckle does not currently support multipart/form-data out of the box
    /// - Manually defined the multipart, file and Data model
    ///
    /// -- https://swagger.io/docs/specification/describing-request-body/multipart-requests/
    /// </summary>
    public class AddApplicationPostParamTypesFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (descriptor != null &&
                descriptor.ControllerName.Equals("Application") &&
                descriptor.ActionName == "AddApplication")
            {
                operation.RequestBody = new OpenApiRequestBody { Required = true };
                operation.RequestBody.Content.Add("multipart/form-data", new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = {
                            {
                                "ConsentFormFile",
                                new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary",
                                    Description = "PDF, Microsoft Word .docx/.doc files only"
                                }
                            },
                            {
                                "ApplicationCreateRequestJson",
                                new OpenApiSchema()
                                {
                                    Description = "See ApplicationCreateRequest schema",
                                    Type = "object",
                                    Properties = {
                                        {
                                            "orgId",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        },
                                        {
                                            "GivenName",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        },
                                        {
                                            "MiddleName1",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        },
                                        {
                                            "MiddleName2",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        },
                                        {
                                            "Surname",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        },
                                        {
                                            "EmailAddress",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        },
                                        {
                                            "JobTitle",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        },
                                        {
                                            "DateOfBirth",
                                            new OpenApiSchema
                                            {
                                                Type = "string"
                                            }
                                        }
                                    },
                                    Example = new OpenApiString(
@"{
	""OriginTypeCode"": ""Portal"",
	""PhoneNumber"": ""1234567890"",
	""DriversLicense"": ""dl02398403"",
	""DateOfBirth"": ""2001-01-10"",
	""BirthPlace"": ""hh"",
	""ScreeningTypeCode"": ""Staff"",
	""AddressLine1"": ""address 1"",
	""AddressLine2"": null,
	""City"": ""city"",
	""PostalCode"": ""postalcode"",
	""Province"": ""bc"",
	""Country"": ""canada"",
	""OneLegalName"": true,
	""AgreeToCompleteAndAccurate"": true,
	""HaveVerifiedIdentity"": true,
	""Aliases"": [],
	""RequireDuplicateCheck"": false,
	""ConsentFormFile"": null,
	""OrgId"": ""00000000-0000-0000-0000-000000000000"",
	""GivenName"": ""given name"",
	""MiddleName1"": null,
	""MiddleName2"": null,
	""Surname"": ""value"",
	""EmailAddress"": ""test@test.com"",
	""JobTitle"": ""teacher"",
	""ContractedCompanyName"": ""standard company"",
	""PayeeType"": ""Organization""
}")
                                }
                            }
                        }
                    },
                    Encoding = {
                        {
                            "ConsentFormFile",
                            new OpenApiEncoding
                            {
                                ContentType =  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            }
                        }
                    }
                });
            }
        }
    }
}