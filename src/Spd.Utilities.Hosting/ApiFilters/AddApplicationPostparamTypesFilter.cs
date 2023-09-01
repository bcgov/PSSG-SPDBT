using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

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
                                                Type = "string",
                                                Format="uuid"
                                            }
                                        },
                                        {
                                            "givenName",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "middleName1",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "middleName2",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "surname",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "emailAddress",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "jobTitle",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "genderCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "dateOfBirth",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Format="date-time",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "contractedCompanyName",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "phoneNumber",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "driversLicense",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "birthPlace",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "addressLine1",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "addressLine2",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "city",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "postalCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "province",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "country",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "oneLegalName",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "agreeToCompleteAndAccurate",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "haveVerifiedIdentity",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "requireDuplicateCheck",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                            }
                                        },
                                        {
                                            "aliases",
                                            new OpenApiSchema
                                            {
                                                Type = "array",
                                                Items = new OpenApiSchema
                                                {
                                                    Type = "AliasCreateRequest",
                                                    Properties = {
                                                        {
                                                            "givenName",
                                                            new OpenApiSchema
                                                            {
                                                                Type = "string",
                                                                Nullable= true,
                                                            }
                                                        },
                                                        {
                                                            "middleName1",
                                                            new OpenApiSchema
                                                            {
                                                                Type = "string",
                                                                Nullable= true,
                                                            }
                                                        },
                                                        {
                                                            "middleName2",
                                                            new OpenApiSchema
                                                            {
                                                                Type = "string",
                                                                Nullable= true,
                                                            }
                                                        },
                                                        {
                                                            "surname",
                                                            new OpenApiSchema
                                                            {
                                                                Type = "string",
                                                                Nullable= true,
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "originTypeCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                            }
                                        },
                                        {
                                            "payeeType",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                            }
                                        },
                                        {
                                            "screeningType",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                            }
                                        },
                                        {
                                            "serviceType",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                            }
                                        },
                                        {
                                            "employeeId",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true,
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
	                                        ""GenderCode"": ""M"",
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