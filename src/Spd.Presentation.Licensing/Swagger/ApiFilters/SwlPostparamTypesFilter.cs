using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text.Json.Nodes;

namespace Spd.Presentation.Licensing.Swagger.ApiFilters
{
    /// <summary>
    /// To manually definate the Document Post API
    /// - Swashbuckle does not currently support multipart/form-data out of the box
    /// - Manually defined the multipart, file and Data model
    ///
    /// -- https://swagger.io/docs/specification/describing-request-body/multipart-requests/
    /// </summary>
    public class SwlPostPostParamTypesFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (descriptor != null &&
                descriptor.ControllerName.Equals("WorkerLicensing") &&
                descriptor.ActionName == "SubmitSecurityWorkerLicenceApplicationAnonymous")
            {
                operation.RequestBody = new OpenApiRequestBody { Required = true };
                operation.RequestBody.Content.Add("multipart/form-data", new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = JsonSchemaType.Object,
                        Properties = {
                            {
                                "docs",
                                new OpenApiSchema
                                {
                                    Type = JsonSchemaType.Array,
                                    Items = new OpenApiSchema
                                    {
                                        Type = JsonSchemaType.String,
                                        Format = "binary",
                                        Description = "PDF, Microsoft Word .docx/.doc files only"
                                    }
                                }
                            },
                            {
                                "WorkerLicenceAppAnonymousSubmitRequest",
                                new OpenApiSchema()
                                {
                                    Description = "See WorkerLicenceAppAnonymousSubmitRequest schema",
                                    Type = JsonSchemaType.Object,
                                    Properties = {
                                        {
                                            "serviceTypeCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "applicationTypeCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "businessTypeCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
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
                                            "dateOfBirth",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                Format="date",
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
                                            "oneLegalName",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "expiredLicenceNumber",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "expiredLicenceId",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                Format = "uuid",
                                            }
                                        },
                                        {
                                            "hasExpiredLicence",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "licenceTermCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "hasCriminalHistory",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "hasPreviousName",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "hasBcDriversLicence",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "bcDriversLicenceNumber",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "hairColourCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "eyeColourCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "height",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Integer | JsonSchemaType.Null,
                                                Format = "int32",
                                            }
                                        },
                                        {
                                            "heightUnitCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "weight",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Integer | JsonSchemaType.Null,
                                                Format = "int32",
                                            }
                                        },
                                        {
                                            "weightUnitCode",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "contactEmailAddress",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "contactPhoneNumber",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "isMailingTheSameAsResidential",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "isPoliceOrPeaceOfficer",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                          "policeOfficerRoleCode",
                                          new OpenApiSchema
                                          {
                                              Type = JsonSchemaType.String | JsonSchemaType.Null,
                                          }
                                        },
                                        {
                                          "otherOfficerRole",
                                          new OpenApiSchema
                                          {
                                              Type = JsonSchemaType.String | JsonSchemaType.Null,
                                          }
                                      },
                                        {
                                            "isTreatedForMHC",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "useBcServicesCardPhoto",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "carryAndUseRestraints",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "useDogs",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "isDogsPurposeProtection",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "isDogsPurposeDetectionDrugs",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "isDogsPurposeDetectionExplosives",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
                                            }
                                        },
                                        {
                                            "isCanadianCitizen",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Boolean | JsonSchemaType.Null,
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
                                            "residentialAddressData",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Object,
                                                Properties =
                                                {
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
                                                        "country",
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
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "mailingAddressData",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Object,
                                                Properties =
                                                {
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
                                                        "country",
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
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "categoryCodes",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Array,
                                                Items = new OpenApiSchema
                                                {
                                                    Type = JsonSchemaType.String
                                                }
                                            }
                                        },
                                        {
                                            "documentInfos",
                                            new OpenApiSchema
                                            {
                                                Type = JsonSchemaType.Array,
                                                Items = new OpenApiSchema
                                                {
                                                    Type = JsonSchemaType.Object,
                                                    Properties = {
                                                        {
                                                            "licenceDocumentTypeCode",
                                                            new OpenApiSchema
                                                            {
                                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                            }
                                                        },
                                                        {
                                                            "expiryDate",
                                                            new OpenApiSchema
                                                            {
                                                                Type = JsonSchemaType.String | JsonSchemaType.Null,
                                                                Format = "date",
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    Example = JsonNode.Parse(
                                        """
                                        {
                                            "serviceTypeCode": "SecurityWorkerLicence",
                                            "applicationTypeCode": "New",
                                            "isSoleProprietor": false,
                                            "givenName": "test2",
                                            "middleName1": "middleName2",
                                            "middleName2": null,
                                            "surname": "test",
                                            "dateOfBirth": "1998-09-08",
                                            "genderCode": "F",
                                            "oneLegalName": null,
                                            "expiredLicenceNumber": "12345679882",
                                            "expiryDate": null,
                                            "hasExpiredLicence": true,
                                            "licenceTermCode": "FiveYears",
                                            "hasCriminalHistory": true,
                                            "hasPreviousName": false,
                                            "aliases": null,
                                            "hasBcDriversLicence": false,
                                            "bcDriversLicenceNumber": null,
                                            "hairColourCode": "Red",
                                            "eyeColourCode": "Brown",
                                            "height": 178,
                                            "heightUnitCode": "Centimeters",
                                            "weight": 200,
                                            "weightUnitCode": "Pounds",
                                            "contactEmailAddress": null,
                                            "contactPhoneNumber": "2500009773",
                                            "isMailingTheSameAsResidential": false,
                                            "mailingAddressData": null,
                                            "IsCanadianCitizen": true,
                                            "IsDogsPurposeDetectionDrugs": true,
                                            "IsPoliceOrPeaceOfficer": false,
                                            "UseBcServicesCardPhoto": false,
                                            "IsTreatedForMHC": false,
                                            "ResidentialAddressData": {
                                                "AddressLine1": "addressline1",
                                                "Province": "BC",
                                                "City": "Victoria",
                                                "Country": "Canada",
                                                "PostalCode": "VNNTT9"
                                            },
                                            "CategoryCodes": [
                                                "SecurityGuard",
                                                "PrivateInvestigator"
                                            ],
                                            "DocumentInfos": [
                                                {
                                                    "LicenceDocumentTypeCode": "BcServicesCard",
                                                    "ExpiryDate": "2020-01-09"
                                                },
                                                {
                                                    "LicenceDocumentTypeCode": "WorkPermit",
                                                    "ExpiryDate": "2024-01-09"
                                                }
                                            ]
                                        }
                                        """)
                                }
                            }
                        }
                    },
                    Encoding = {
                        {
                            "doc",
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