using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text.Json.Nodes;

namespace Spd.Presentation.Screening.Swagger.ApiFilters
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
                        Type = JsonSchemaType.Object,
                        Properties = {
                            {
                                "ConsentFormFile",
                                new OpenApiSchema
                                {
                                    Type = JsonSchemaType.String,
                                    Format = "binary",
                                    Description = "PDF, Microsoft Word .docx/.doc files only"
                                }
                            },
                            {
                                "ApplicationCreateRequestJson",
                                new OpenApiSchema()
                                {
                                    Description = "See ApplicationCreateRequest schema",
                                    Type = JsonSchemaType.Object,
                                    Properties = {
                                        {
                                            "orgId",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String,
                                                Format="uuid"
                                            }
                                        },
                                        {
                                            "givenName",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "middleName1",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "middleName2",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "surname",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "emailAddress",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "jobTitle",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "genderCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "dateOfBirth",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                Format="date-time",
                                            }
                                        },
                                        {
                                            "contractedCompanyName",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "phoneNumber",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "driversLicense",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "birthPlace",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "addressLine1",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "addressLine2",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "city",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "postalCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "province",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "country",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "oneLegalName",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "agreeToCompleteAndAccurate",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "haveVerifiedIdentity",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "requireDuplicateCheck",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean,
                                            }
                                        },
                                        {
                                            "aliases",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Array,
                                                Items = new OpenApiSchema
                                                {
                                                    Type = JsonSchemaType.Object,
                                                    Properties = {
                                                        {
                                                            "givenName",
                                                            new OpenApiSchema
                                                            {
                                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                            }
                                                        },
                                                        {
                                                            "middleName1",
                                                            new OpenApiSchema
                                                            {
                                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                            }
                                                        },
                                                        {
                                                            "middleName2",
                                                            new OpenApiSchema
                                                            {
                                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                            }
                                                        },
                                                        {
                                                            "surname",
                                                            new OpenApiSchema
                                                            {
                                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
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
                                                Type = JsonSchemaType.String,
                                            }
                                        },
                                        {
                                            "payeeType",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String,
                                            }
                                        },
                                        {
                                            "screeningType",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String,
                                            }
                                        },
                                        {
                                            "serviceType",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String,
                                            }
                                        },
                                        {
                                            "employeeId",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        }
                                    },
                                    Example = JsonNode.Parse(
                                        """
                                        {
                                            "OriginTypeCode": "Portal",
                                            "PhoneNumber": "1234567890",
                                            "DriversLicense": "dl02398403",
                                            "DateOfBirth": "2001-01-10",
                                            "BirthPlace": "hh",
                                            "ScreeningTypeCode": "Staff",
                                            "AddressLine1": "address 1",
                                            "AddressLine2": null,
                                            "City": "city",
                                            "PostalCode": "postalcode",
                                            "Province": "bc",
                                            "Country": "canada",
                                            "OneLegalName": true,
                                            "AgreeToCompleteAndAccurate": true,
                                            "HaveVerifiedIdentity": true,
                                            "Aliases": [],
                                            "RequireDuplicateCheck": false,
                                            "ConsentFormFile": null,
                                            "OrgId": "00000000-0000-0000-0000-000000000000",
                                            "GivenName": "given name",
                                            "MiddleName1": null,
                                            "MiddleName2": null,
                                            "Surname": "value",
                                            "EmailAddress": "test@test.com",
                                            "JobTitle": "teacher",
                                            "GenderCode": "M",
                                            "ContractedCompanyName": "standard company",
                                            "PayeeType": "Organization"
                                        }
                                        """),
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