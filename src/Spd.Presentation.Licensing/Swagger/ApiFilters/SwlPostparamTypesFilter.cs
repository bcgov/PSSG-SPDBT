using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

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
                        Type = "object",
                        Properties = {
                            {
                                "docs",
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
                                "WorkerLicenceAppAnonymousSubmitRequest",
                                new OpenApiSchema()
                                {
                                    Description = "See WorkerLicenceAppAnonymousSubmitRequest schema",
                                    Type = "object",
                                    Properties = {
                                        {
                                            "serviceTypeCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "applicationTypeCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "businessTypeCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
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
                                            "dateOfBirth",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Format="date",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "genderCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "oneLegalName",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "expiredLicenceNumber",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable = true,
                                            }
                                        },
                                        {
                                            "expiredLicenceId",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Format = "uuid",
                                                Nullable = true,
                                            }
                                        },
                                        {
                                            "hasExpiredLicence",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "licenceTermCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "hasCriminalHistory",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "hasPreviousName",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "hasBcDriversLicence",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable = true
                                            }
                                        },
                                        {
                                            "bcDriversLicenceNumber",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable = true
                                            }
                                        },
                                        {
                                            "hairColourCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "eyeColourCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "height",
                                            new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Format = "int32",
                                                Nullable = true
                                            }
                                        },
                                        {
                                            "heightUnitCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "weight",
                                            new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Format = "int32",
                                                Nullable = true
                                            }
                                        },
                                        {
                                            "weightUnitCode",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable= true
                                            }
                                        },
                                        {
                                            "contactEmailAddress",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable = true
                                            }
                                        },
                                        {
                                            "contactPhoneNumber",
                                            new OpenApiSchema
                                            {
                                                Type = "string",
                                                Nullable = true
                                            }
                                        },
                                        {
                                            "isMailingTheSameAsResidential",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "isPoliceOrPeaceOfficer",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                          "policeOfficerRoleCode",
                                          new OpenApiSchema
                                          {
                                              Type = "string",
                                              Nullable = true
                                          }
                                        },
                                        {
                                          "otherOfficerRole",
                                          new OpenApiSchema
                                          {
                                              Type = "string",
                                              Nullable = true
                                          }
                                      },
                                        {
                                            "isTreatedForMHC",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "useBcServicesCardPhoto",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "carryAndUseRestraints",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "useDogs",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "isDogsPurposeProtection",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "isDogsPurposeDetectionDrugs",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "isDogsPurposeDetectionExplosives",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "isCanadianCitizen",
                                            new OpenApiSchema
                                            {
                                                Type = "boolean",
                                                Nullable= true,
                                            }
                                        },
                                        {
                                            "aliases",
                                            new OpenApiSchema
                                            {
                                                Type = "array",
                                                Items = new OpenApiSchema
                                                {
                                                    Type = "Alias",
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
                                            "residentialAddressData",
                                            new OpenApiSchema
                                            {
                                                Type = "Address",
                                                Properties =
                                                {
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
                                                        "country",
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
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "mailingAddressData",
                                            new OpenApiSchema
                                            {
                                                Type = "Address",
                                                Properties =
                                                {
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
                                                        "country",
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
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "categoryCodes",
                                            new OpenApiSchema
                                            {
                                                Type = "array",
                                                Items = new OpenApiSchema
                                                {
                                                    Type = "string"
                                                }
                                            }
                                        },
                                        {
                                            "documentInfos",
                                            new OpenApiSchema
                                            {
                                                Type = "array",
                                                Items = new OpenApiSchema
                                                {
                                                    Type = "DocumentBase",
                                                    Properties = {
                                                        {
                                                            "licenceDocumentTypeCode",
                                                            new OpenApiSchema
                                                            {
                                                                Type = "string",
                                                                Nullable= false,
                                                            }
                                                        },
                                                        {
                                                            "expiryDate",
                                                            new OpenApiSchema
                                                            {
                                                                Type = "string",
                                                                Format = "date",
                                                                Nullable= true,
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    Example = new OpenApiString(
                                        @"
                                        {
                                            ""serviceTypeCode"": ""SecurityWorkerLicence"",
                                            ""applicationTypeCode"": ""New"",
                                            ""isSoleProprietor"": false,
                                            ""givenName"": ""test2"",
                                            ""middleName1"": ""middleName2"",
                                            ""middleName2"": null,
                                            ""surname"": ""test"",
                                            ""dateOfBirth"": ""1998-09-08"",
                                            ""genderCode"": ""F"",
                                            ""oneLegalName"": null,
                                            ""expiredLicenceNumber"": ""12345679882"",
                                            ""expiryDate"": null,
                                            ""hasExpiredLicence"": true,
                                            ""licenceTermCode"": ""FiveYears"",
                                            ""hasCriminalHistory"": true,
                                            ""hasPreviousName"": false,
                                            ""aliases"": null,
                                            ""hasBcDriversLicence"": false,
                                            ""bcDriversLicenceNumber"": null,
                                            ""hairColourCode"": ""Red"",
                                            ""eyeColourCode"": ""Brown"",
                                            ""height"": 178,
                                            ""heightUnitCode"": ""Centimeters"",
                                            ""weight"": 200,
                                            ""weightUnitCode"": ""Pounds"",
                                            ""contactEmailAddress"": null,
                                            ""contactPhoneNumber"": ""2500009773"",
                                            ""isMailingTheSameAsResidential"": false,
                                            ""residentialAddressData"": null,
                                            ""mailingAddressData"": null,
                                            ""IsCanadianCitizen"": true,
                                            ""IsDogsPurposeDetectionDrugs"": true,
                                            ""IsPoliceOrPeaceOfficer"": false,
                                            ""UseBcServicesCardPhoto"": false,
                                            ""IsTreatedForMHC"": false,
                                            ""ResidentialAddressData"": {
                                                ""AddressLine1"": ""addressline1"",
                                                ""Province"": ""BC"",
                                                ""City"": ""Victoria"",
                                                ""Country"": ""Canada"",
                                                ""PostalCode"": ""VNNTT9""
                                            },
                                            ""CategoryCodes"": [
                                                ""SecurityGuard"",
                                                ""PrivateInvestigator""
                                            ],
                                            ""DocumentInfos"": [
                                                {
                                                    ""LicenceDocumentTypeCode"": ""BcServicesCard"",
                                                    ""ExpiryDate"": ""2020-01-09""
                                                },
                                                {
                                                    ""LicenceDocumentTypeCode"": ""WorkPermit"",
                                                    ""ExpiryDate"": ""2024-01-09""
                                                }
                                            ]
                                        }
                                        ")
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