using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using System.Collections.Immutable;

namespace Spd.Utilities.Dynamics
{
    public static class DynamicsContextLookupHelpers
    {
        #region organization type
        public static readonly ImmutableDictionary<string, Guid> OrganizationTypeGuidDictionary = new Dictionary<string, Guid>()
        {
            {"Volunteer-NonProfit", Guid.Parse("c2cc6851-56b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Childcare", Guid.Parse("1b4dbc58-56b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Healthcare", Guid.Parse("b4dc3164-56b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Education", Guid.Parse("5c7ff643-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-ProvFunded", Guid.Parse("93f5c34f-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-CrownCorp", Guid.Parse("1ec4a858-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-ProvGovt", Guid.Parse("ce908e5f-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Registrant", Guid.Parse("e93ee56f-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Municipality", Guid.Parse("7a7a0b99-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-PostSec", Guid.Parse("30b68faf-59b8-ed11-b83e-00505683fbf4")},
            {"Employee-Childcare", Guid.Parse("d2ebf78b-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Healthcare", Guid.Parse("4ba37d93-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Education", Guid.Parse("e6ee8aa9-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Funding", Guid.Parse("054ea3b0-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-CrownCorp", Guid.Parse("b48933b8-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-ProvGovt", Guid.Parse("b30335c1-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Registrant", Guid.Parse("489d1f0a-5bb8-ed11-b83e-00505683fbf4")},
            {"Employee-GovnBody", Guid.Parse("fcaa5d11-5bb8-ed11-b83e-00505683fbf4")},
            {"Employee-Appointed", Guid.Parse("61b9301b-5bb8-ed11-b83e-00505683fbf4")},
        }.ToImmutableDictionary();
        public static spd_organizationtype? LookupOrganizationType(this DynamicsContext context, string key)
        {
            var keyExisted = OrganizationTypeGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_organizationtypes
                .Where(s => s.spd_organizationtypeid == guid)
                .FirstOrDefault();
        }

        public static string LookupOrganizationTypeKey(Guid typeId)
        {
            return OrganizationTypeGuidDictionary.FirstOrDefault(s => s.Value == typeId).Key;
        }

        //return (employeeTypeCode, volunteerTypeCode)
        public static (string?, string?) GetTypeFromTypeId(Guid? orgTypeId)
        {
            if (orgTypeId == null) return (null, null);
            string key = LookupOrganizationTypeKey((Guid)orgTypeId);
            var str = key.Split("-");
            if (str.Length == 0 || str.Length > 2) return (null, null);
            if (str[0].Equals("Volunteer", StringComparison.InvariantCultureIgnoreCase))
            {
                return (null, str[1]);
            }
            else
            {
                return (str[1], null);
            }
        }
        #endregion

        #region role
        public static readonly ImmutableDictionary<string, Guid> RoleGuidDictionary = new Dictionary<string, Guid>()
        {
            {"Contact", Guid.Parse("47ca4197-12ba-ed11-b83e-00505683fbf4")},
            {"Primary", Guid.Parse("99af5c0a-a1c2-ed11-b840-00505683fbf4")},
            {"PrimaryBusinessManager", Guid.Parse("22b5624f-e38f-ee11-b849-00505683fbf4")},
            {"BusinessManager", Guid.Parse("f32fcc57-e38f-ee11-b849-00505683fbf4")}
        }.ToImmutableDictionary();

        public static spd_role? LookupRole(this DynamicsContext context, string key)
        {
            var keyExisted = RoleGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_roles
                .Where(s => s.spd_roleid == guid)
                .FirstOrDefault();
        }

        public static string LookupRoleKeyById(this DynamicsContext context, Guid value)
        {
            return RoleGuidDictionary.FirstOrDefault(x => x.Value == value).Key;
        }
        #endregion

        #region file tag
        public static readonly ImmutableDictionary<string, Guid> BcGovTagDictionary = new Dictionary<string, Guid>()
        {
            {"AdditionalGovIdDocument", Guid.Parse("fd7fb16b-297f-ee11-b846-00505683fbf4") },
            {"ApplicantConsentForm", Guid.Parse("b9bc7549-0cea-ed11-b840-005056830319")},
            {"ApplicantInformation", Guid.Parse("bdbc7549-0cea-ed11-b840-005056830319")},
            {"ApprovedLocksmithCourse", Guid.Parse("117c16fc-d37d-ee11-b846-00505683fbf4") },
            {"ArmouredCarGuard", Guid.Parse("e7bc7549-0cea-ed11-b840-005056830319")},
            {"ArmouredVehiclePurpose", Guid.Parse("ddbc7549-0cea-ed11-b840-005056830319")},
            {"ArmouredVehicleRationale", Guid.Parse("dfbc7549-0cea-ed11-b840-005056830319")},
            {"AuthorizationToCarryCertificate", Guid.Parse("6abf16e1-d37d-ee11-b846-00505683fbf4")},
            {"BCCompaniesRegistrationVerification", Guid.Parse("fbbc7549-0cea-ed11-b840-005056830319")},
            {"BCServicesCard", Guid.Parse("d1bc7549-0cea-ed11-b840-005056830319")},
            {"BirthCertificate", Guid.Parse("c3bc7549-0cea-ed11-b840-005056830319")},
            {"BodyArmourPurpose", Guid.Parse("e1bc7549-0cea-ed11-b840-005056830319")},
            {"BodyArmourRationale", Guid.Parse("e3bc7549-0cea-ed11-b840-005056830319")},
            {"BusinessInsurance", Guid.Parse("fdbc7549-0cea-ed11-b840-005056830319")},
            {"BasicSecurityTrainingCertificate", Guid.Parse("218de034-d47d-ee11-b846-00505683fbf4")},
            {"BasicSecurityTrainingCourseEquivalent", Guid.Parse("aaf10b62-d47d-ee11-b846-00505683fbf4")},
            {"CanadianCitizenship", Guid.Parse("c5bc7549-0cea-ed11-b840-005056830319")},
            {"CanadianFirearmsLicence", Guid.Parse("cdbc7549-0cea-ed11-b840-005056830319")},
            {"CanadianNativeStatusCard", Guid.Parse("cfbc7549-0cea-ed11-b840-005056830319")},
            {"CertificateOfAdvancedSecurityTraining", Guid.Parse("f7bc7549-0cea-ed11-b840-005056830319")},
            {"CertificateOfQualification", Guid.Parse("5b8d11f4-d37d-ee11-b846-00505683fbf4") },
            {"CitizenshipDocument", Guid.Parse("d881165c-297f-ee11-b846-00505683fbf4") },
            {"ClearanceLetter", Guid.Parse("90ea957e-a426-ee11-b844-00505683fbf4")},
            {"ConfirmationLetterFromSuperiorOfficer", Guid.Parse("ffbc7549-0cea-ed11-b840-005056830319")},
            {"ConfirmationOfFingerprints", Guid.Parse("b7bc7549-0cea-ed11-b840-005056830319")},
            {"ConfirmationOfPermanentResidenceDocument", Guid.Parse("10cd7d86-ea79-ee11-b846-00505683fbf4")},
            {"CourseCertificate", Guid.Parse("316235eb-d37d-ee11-b846-00505683fbf4")},
            {"ConvictedOffence", Guid.Parse("dbbc7549-0cea-ed11-b840-005056830319")},
            {"CriminalCharges", Guid.Parse("d9bc7549-0cea-ed11-b840-005056830319")},
            {"DriverLicense", Guid.Parse("cbbc7549-0cea-ed11-b840-005056830319")},
            {"ExperienceAndApprenticeship", Guid.Parse("0f7c16fc-d37d-ee11-b846-00505683fbf4")},
            {"ExperienceAndCourses", Guid.Parse("b4f4c604-d47d-ee11-b846-00505683fbf4")},
            {"ExperienceLetters", Guid.Parse("8ac3dc2d-d47d-ee11-b846-00505683fbf4") },
            {"ExperienceOrTrainingEquivalent",Guid.Parse("d3b3f125-d47d-ee11-b846-00505683fbf4") },
            {"FingerprintsPkg", Guid.Parse("23a899f9-4e1c-ee11-b844-00505683fbf4")},
            {"FingerprintProofDocument", Guid.Parse("2d6abc8e-297f-ee11-b846-00505683fbf4") },
            {"FireInvestigator", Guid.Parse("6cbf16e1-d37d-ee11-b846-00505683fbf4") },
            {"GovtIssuedPhotoID", Guid.Parse("d5bc7549-0cea-ed11-b840-005056830319")},
            {"IdPhotoDocument", Guid.Parse("28476bd7-2a7f-ee11-b846-00505683fbf4")},
            {"KnowledgeAndExperience", Guid.Parse("b46c580e-d47d-ee11-b846-00505683fbf4") },
            {"LegalNameChange", Guid.Parse("bfbc7549-0cea-ed11-b840-005056830319")},
            {"LegalWorkStatus", Guid.Parse("c9bc7549-0cea-ed11-b840-005056830319")},
            {"LetterOfNoConflict", Guid.Parse("f3bc7549-0cea-ed11-b840-005056830319")},
            {"Locksmith", Guid.Parse("e9bc7549-0cea-ed11-b840-005056830319")},
            {"ManualPaymentForm", Guid.Parse("be79f9af-3e2b-ee11-b845-00505683fbf4")},
            {"MentalHealthDocument", Guid.Parse("73ca4184-297f-ee11-b846-00505683fbf4") },
            {"MentalHealthConditionForm", Guid.Parse("f9bc7549-0cea-ed11-b840-005056830319")},
            {"PaymentReceipt", Guid.Parse("d5fec490-3e2b-ee11-b845-00505683fbf4")},
            {"Passport", Guid.Parse("c1bc7549-0cea-ed11-b840-005056830319")},
            {"PermanentResidenceCard", Guid.Parse("c7bc7549-0cea-ed11-b840-005056830319")},
            {"PoliceExperienceOrTraining", Guid.Parse("a8f10b62-d47d-ee11-b846-00505683fbf4") },
            {"PoliceOfficerDocument", Guid.Parse("aa431579-297f-ee11-b846-00505683fbf4") },
            {"Photograph", Guid.Parse("d7bc7549-0cea-ed11-b840-005056830319")},
            {"PrivateInvestigator", Guid.Parse("ebbc7549-0cea-ed11-b840-005056830319")},
            {"PrivateInvestigatorUnderSupervision", Guid.Parse("edbc7549-0cea-ed11-b840-005056830319")},
            {"PrivateSecurityTrainingNetworkCompletion", Guid.Parse("65bf0317-d47d-ee11-b846-00505683fbf4") },
            {"RecommendationLetters", Guid.Parse("8cc3dc2d-d47d-ee11-b846-00505683fbf4") },
            {"Resume", Guid.Parse("e943e5c7-f2a9-ee11-b849-00505683fbf4") },
            {"SecurityAlarmInstaller", Guid.Parse("e5bc7549-0cea-ed11-b840-005056830319")},
            {"SecurityConsultant", Guid.Parse("f1bc7549-0cea-ed11-b840-005056830319")},
            {"SecurityGuard", Guid.Parse("efbc7549-0cea-ed11-b840-005056830319")},
            {"SelfDisclosure", Guid.Parse("bbbc7549-0cea-ed11-b840-005056830319")},
            {"SelfDisclosurePkg", Guid.Parse("5b9ef416-4f1c-ee11-b844-00505683fbf4")},
            {"StudyPermit", Guid.Parse("80ef082a-eb79-ee11-b846-00505683fbf4")},
            {"TenYearsPoliceExperienceAndTraining", Guid.Parse("b6f4c604-d47d-ee11-b846-00505683fbf4")},
            {"TradesQualificationCertificate", Guid.Parse("d1b3f125-d47d-ee11-b846-00505683fbf4") },
            {"Training", Guid.Parse("9c06c71e-d47d-ee11-b846-00505683fbf4") },
            {"TrainingRecognizedCourse", Guid.Parse("b66c580e-d47d-ee11-b846-00505683fbf4") },
            {"TrainingOtherCoursesOrKnowledge", Guid.Parse("63bf0317-d47d-ee11-b846-00505683fbf4") },
            {"ValidationCertificate", Guid.Parse("f5bc7549-0cea-ed11-b840-005056830319")},
            {"VerificationLetter", Guid.Parse("336235eb-d37d-ee11-b846-00505683fbf4")},
            {"OpportunityToRespond", Guid.Parse("385edd8c-fd16-ee11-b844-00505683fbf4")},
            {"OtherCourseCompletion", Guid.Parse("9a06c71e-d47d-ee11-b846-00505683fbf4") },
            {"WorkPermit", Guid.Parse("f455ca0e-eb79-ee11-b846-00505683fbf4")},
            {"RecordOfLandingDocument", Guid.Parse("542c89dc-ea79-ee11-b846-00505683fbf4")},
            {"DogCertificate",  Guid.Parse("5c8a778d-4b8a-ee11-b848-00505683fbf4")},
            {"ASTCertificate",  Guid.Parse("25ce92a9-4b8a-ee11-b848-00505683fbf4")}, //advanced Security training certificate
            {"UseForceEmployerLetter",  Guid.Parse("f3368269-4f8a-ee11-b848-00505683fbf4")},
            {"UseForceEmployerLetterASTEquivalent",  Guid.Parse("08594985-4f8a-ee11-b848-00505683fbf4")},
            {"NonCanadianPassport",  Guid.Parse("dd0422e6-ddc9-ee11-b84a-00505683fbf4")},
            {"BCID",  Guid.Parse("b55a2223-dec9-ee11-b84a-00505683fbf4")},
            {"CompanyBranding",  Guid.Parse("88a53b43-89aa-ee11-b849-00505683fbf4")},
            {"CorporateSummary",  Guid.Parse("89d46d5e-ff03-ef11-b84b-00505683fbf4")},
            {"CorporateRegistryDocument",  Guid.Parse("01b5a2a7-7923-ef11-b850-00505683fbf4")}
        }.ToImmutableDictionary();

        public static bcgov_tag? LookupTag(this DynamicsContext context, string key)
        {
            var keyExisted = BcGovTagDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.bcgov_tags
                .Where(s => s.bcgov_tagid == guid)
                .FirstOrDefault();
        }
        #endregion

        #region service type
        public static readonly ImmutableDictionary<string, Guid> ServiceTypeGuidDictionary = new Dictionary<string, Guid>()
        {
            {"PSSO", Guid.Parse("f093141b-1e9d-ed11-b83d-00505683fbf4")},
            {"CRRP_EMPLOYEE", Guid.Parse("f193141b-1e9d-ed11-b83d-00505683fbf4")},
            {"CRRP_VOLUNTEER", Guid.Parse("a2834126-1e9d-ed11-b83d-00505683fbf4")},
            {"MCFD", Guid.Parse("a3834126-1e9d-ed11-b83d-00505683fbf4")},
            {"PE_CRC", Guid.Parse("a5d6ca3b-1e9d-ed11-b83d-00505683fbf4")},
            {"PE_CRC_VS", Guid.Parse("61a2ecee-58ae-ed11-b83e-00505683fbf4")},
            {"SecurityWorkerLicence", Guid.Parse("451101f8-58ae-ed11-b83e-00505683fbf4")},
            {"PSSO_VS", Guid.Parse("8c653cc7-64b9-ed11-b83e-00505683fbf4")},
            {"SecurityBusinessLicence", Guid.Parse("86aa9004-4c32-ee11-b845-00505683fbf4")},
            {"ArmouredVehiclePermit", Guid.Parse("b0572417-4c32-ee11-b845-00505683fbf4")}, //AVAMCCA
            {"BodyArmourPermit", Guid.Parse("f504b223-4c32-ee11-b845-00505683fbf4")}, //BAP
            {"MDRA", Guid.Parse("b212c347-4c32-ee11-b845-00505683fbf4")},
            {"SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC", Guid.Parse("9c7cf246-c942-ee11-b845-00505683fbf4")},
        }.ToImmutableDictionary();

        public static spd_servicetype? LookupServiceType(this DynamicsContext context, string? key)
        {
            if (key == null) return null;
            var keyExisted = ServiceTypeGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_servicetypes
                .Where(s => s.spd_servicetypeid == guid)
                .Where(s => s.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefault();
        }

        public static string GetServiceTypeName(Guid? serviceTypeId)
        {
            return ServiceTypeGuidDictionary.FirstOrDefault(s => s.Value == serviceTypeId).Key;
        }

        public static Guid? GetServiceTypeGuid(string serviceTypeName)
        {
            if (ServiceTypeGuidDictionary.TryGetValue(serviceTypeName, out Guid guid))
                return guid;
            else
                return null;
        }
        #endregion

        #region worker licence category
        public static readonly ImmutableDictionary<string, Guid> LicenceCategoryDictionary = new Dictionary<string, Guid>()
        {
            {"ArmouredCarGuard", Guid.Parse("41f0a63c-3a62-ee11-b843-005056830319")},
            {"ElectronicLockingDeviceInstaller", Guid.Parse("43f0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityAlarmInstallerUnderSupervision", Guid.Parse("45f0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityAlarmInstaller", Guid.Parse("47f0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityAlarmMonitor", Guid.Parse("49f0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityAlarmResponse", Guid.Parse("4bf0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityAlarmSales", Guid.Parse("4df0a63c-3a62-ee11-b843-005056830319")},
            {"ClosedCircuitTelevisionInstaller", Guid.Parse("4ff0a63c-3a62-ee11-b843-005056830319")},
            {"LocksmithUnderSupervision", Guid.Parse("51f0a63c-3a62-ee11-b843-005056830319")},
            {"Locksmith", Guid.Parse("53f0a63c-3a62-ee11-b843-005056830319")},
            {"PrivateInvestigatorUnderSupervision", Guid.Parse("55f0a63c-3a62-ee11-b843-005056830319")},
            {"PrivateInvestigator", Guid.Parse("57f0a63c-3a62-ee11-b843-005056830319")},
            {"FireInvestigator", Guid.Parse("59f0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityConsultant", Guid.Parse("5bf0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityGuardUnderSupervision", Guid.Parse("5df0a63c-3a62-ee11-b843-005056830319")},
            {"SecurityGuard", Guid.Parse("5ff0a63c-3a62-ee11-b843-005056830319")},
            {"BodyArmourSales", Guid.Parse("61f0a63c-3a62-ee11-b843-005056830319")},
        }.ToImmutableDictionary();

        public static readonly ImmutableDictionary<string, Guid> PositionDictionary = new Dictionary<string, Guid>()
        {
            {"PrivateInvestigatorManager", Guid.Parse("70bc0f0c-dc34-ef11-b850-00505683fbf4")}
        }.ToImmutableDictionary();

        public static spd_licencecategory? LookupLicenceCategory(this DynamicsContext context, string? key)
        {
            if (key == null) return null;
            var keyExisted = LicenceCategoryDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_licencecategories
                .Where(s => s.spd_licencecategoryid == guid)
                .Where(s => s.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefault();
        }

        public static string LookupLicenceCategoryKey(Guid? licenceCategoryId)
        {
            return LicenceCategoryDictionary.FirstOrDefault(s => s.Value == licenceCategoryId).Key;
        }
        #endregion

        public static async Task<spd_application?> GetApplicationById(this DynamicsContext context, Guid appId, CancellationToken ct)
        {
            try
            {
                return await context.spd_applications.Where(a => a.spd_applicationid == appId).SingleOrDefaultAsync(ct);
            }
            catch (DataServiceQueryException ex)
            {
                if (ex.Response.StatusCode == 404)
                    return null;
                else
                    throw;
            }

        }

        public static async Task<spd_portaluser?> GetUserById(this DynamicsContext context, Guid userId, CancellationToken ct)
            => await context.spd_portalusers.Where(a => a.spd_portaluserid == userId).SingleOrDefaultAsync(ct);

        public static async Task<account?> GetOrgById(this DynamicsContext context, Guid organizationId, CancellationToken ct)
        {
            try
            {
                account? account = await context.accounts
                    .Expand(a => a.spd_account_spd_servicetype)
                    .Where(a => a.accountid == organizationId)
                    .SingleOrDefaultAsync(ct);
                return account;
            }
            catch (DataServiceQueryException ex)
            {
                if (ex.Response.StatusCode == 404)
                    return null;
                else
                    throw;
            }
        }

        public static async Task<spd_clearance?> GetClearanceById(this DynamicsContext context, Guid clearanceId, CancellationToken ct)
           => await context.spd_clearances.Where(a => a.spd_clearanceid == clearanceId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .SingleOrDefaultAsync(ct);

        public static async Task<spd_clearanceaccess?> GetClearanceAccessById(this DynamicsContext context, Guid clearanceAccessId, CancellationToken ct)
           => await context.spd_clearanceaccesses.Where(a => a.spd_clearanceaccessid == clearanceAccessId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .SingleOrDefaultAsync(ct);

        public static async Task<contact?> GetContactById(this DynamicsContext context, Guid contactId, CancellationToken ct)
        {
            try
            {
                return await context.contacts.Where(a => a.contactid == contactId).SingleOrDefaultAsync(ct);
            }
            catch (DataServiceQueryException ex)
            {
                if (ex.Response.StatusCode == 404)
                    return null;
                else
                    throw;
            }

        }

        public static async Task<task?> GetTaskById(this DynamicsContext context, Guid taskId, CancellationToken ct)
           => await context.tasks.Where(a => a.activityid == taskId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .SingleOrDefaultAsync(ct);
        public static async Task<spd_identity?> GetIdentityById(this DynamicsContext context, Guid identityId, CancellationToken ct)
        {
            try
            {
                return await context.spd_identities.Where(a => a.spd_identityid == identityId).SingleOrDefaultAsync(ct);
            }
            catch (DataServiceQueryException ex)
            {
                if (ex.Response.StatusCode == 404)
                    return null;
                else
                    throw;
            }

        }

        public static async Task<spd_payment?> GetPaymentById(this DynamicsContext context, Guid paymentId, CancellationToken ct)
        {
            try
            {
                return await context.spd_payments.Where(p => p.spd_paymentid == paymentId).SingleOrDefaultAsync(ct);
            }
            catch (DataServiceQueryException ex)
            {
                if (ex.Response.StatusCode == 404)
                    return null;
                else
                    throw;
            }
        }

        public static async Task<spd_delegate?> GetDelegateById(this DynamicsContext context, Guid delegateId, CancellationToken ct)
        {
            try
            {
                return await context.spd_delegates.Where(a => a.spd_delegateid == delegateId).SingleOrDefaultAsync(ct);
            }
            catch (DataServiceQueryException ex)
            {
                if (ex.Response.StatusCode == 404)
                    return null;
                else
                    throw;
            }
        }

        public static async Task<spd_eventqueue?> GetEventById(this DynamicsContext context, Guid eventId, CancellationToken ct)
        {
            try
            {
                return await context.spd_eventqueues
                    .Where(l => l.spd_eventqueueid == eventId)
                    .FirstOrDefaultAsync(ct);
            }
            catch (DataServiceQueryException ex)
            {
                if (ex.Response.StatusCode == 404)
                    return null;
                else
                    throw;
            }
        }
    }
}
