using Microsoft.Dynamics.CRM;
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
            {"ApplicantConsentForm", Guid.Parse("b9bc7549-0cea-ed11-b840-005056830319")},
            {"ApplicantInformation", Guid.Parse("bdbc7549-0cea-ed11-b840-005056830319")},
            {"ArmouredCarGuard", Guid.Parse("e7bc7549-0cea-ed11-b840-005056830319")},
            {"ArmouredVehiclePurpose", Guid.Parse("ddbc7549-0cea-ed11-b840-005056830319")},
            {"ArmouredVehicleRationale", Guid.Parse("dfbc7549-0cea-ed11-b840-005056830319")},
            {"BCCompaniesRegistrationVerification", Guid.Parse("fbbc7549-0cea-ed11-b840-005056830319")},
            {"BCServicesCard", Guid.Parse("d1bc7549-0cea-ed11-b840-005056830319")},
            {"BirthCertificate", Guid.Parse("c3bc7549-0cea-ed11-b840-005056830319")},
            {"BodyArmourPurpose", Guid.Parse("e1bc7549-0cea-ed11-b840-005056830319")},
            {"BodyArmourRationale", Guid.Parse("e3bc7549-0cea-ed11-b840-005056830319")},
            {"BusinessInsurance", Guid.Parse("fdbc7549-0cea-ed11-b840-005056830319")},
            {"CanadianCitizenship", Guid.Parse("c5bc7549-0cea-ed11-b840-005056830319")},
            {"CanadianFirearmsLicense", Guid.Parse("cdbc7549-0cea-ed11-b840-005056830319")},
            {"CanadianNativeStatusCard", Guid.Parse("cfbc7549-0cea-ed11-b840-005056830319")},
            {"CertificateOfAdvancedSecurityTraining", Guid.Parse("f7bc7549-0cea-ed11-b840-005056830319")},
            {"ConfirmationLetterFromSuperiorOfficer", Guid.Parse("ffbc7549-0cea-ed11-b840-005056830319")},
            {"ConfirmationOfFingerprints", Guid.Parse("b7bc7549-0cea-ed11-b840-005056830319")},
            {"ConvictedOffence", Guid.Parse("dbbc7549-0cea-ed11-b840-005056830319")},
            {"CriminalCharges", Guid.Parse("d9bc7549-0cea-ed11-b840-005056830319")},
            {"DriverLicense", Guid.Parse("cbbc7549-0cea-ed11-b840-005056830319")},
            {"FingerprintsPkg", Guid.Parse("23a899f9-4e1c-ee11-b844-00505683fbf4")},
            {"GovtIssuedPhotoID", Guid.Parse("d5bc7549-0cea-ed11-b840-005056830319")},
            {"LegalNameChange", Guid.Parse("bfbc7549-0cea-ed11-b840-005056830319")},
            {"LegalWorkStatus", Guid.Parse("c9bc7549-0cea-ed11-b840-005056830319")},
            {"LetterOfNoConflict", Guid.Parse("f3bc7549-0cea-ed11-b840-005056830319")},
            {"Locksmith", Guid.Parse("e9bc7549-0cea-ed11-b840-005056830319")},
            {"MentalHealthConditionForm", Guid.Parse("f9bc7549-0cea-ed11-b840-005056830319")},
            {"Passport", Guid.Parse("c1bc7549-0cea-ed11-b840-005056830319")},
            {"PermanentResidenceCard", Guid.Parse("c7bc7549-0cea-ed11-b840-005056830319")},
            {"Photograph", Guid.Parse("d7bc7549-0cea-ed11-b840-005056830319")},
            {"PrivateInvestigator", Guid.Parse("ebbc7549-0cea-ed11-b840-005056830319")},
            {"PrivateInvestigatorUnderSupervision", Guid.Parse("edbc7549-0cea-ed11-b840-005056830319")},
            {"SecurityAlarmInstaller", Guid.Parse("e5bc7549-0cea-ed11-b840-005056830319")},
            {"SecurityConsultant", Guid.Parse("f1bc7549-0cea-ed11-b840-005056830319")},
            {"SecurityGuard", Guid.Parse("efbc7549-0cea-ed11-b840-005056830319")},
            {"StatutoryDeclaration", Guid.Parse("bbbc7549-0cea-ed11-b840-005056830319")},
            {"StatutoryDeclarationPkg", Guid.Parse("5b9ef416-4f1c-ee11-b844-00505683fbf4")},
            {"ValidationCertificate", Guid.Parse("f5bc7549-0cea-ed11-b840-005056830319")},
            {"OpportunityToRespond", Guid.Parse("385edd8c-fd16-ee11-b844-00505683fbf4")},
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
            {"LICENSING", Guid.Parse("451101f8-58ae-ed11-b83e-00505683fbf4")},
            {"PSSO_VS", Guid.Parse("8c653cc7-64b9-ed11-b83e-00505683fbf4")},
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

        public static string LookupServiceTypeKey(Guid? serviceTypeId)
        {
            return ServiceTypeGuidDictionary.FirstOrDefault(s => s.Value == serviceTypeId).Key;
        }
        #endregion

        public static async Task<spd_application?> GetApplicationById(this DynamicsContext context, Guid appId, CancellationToken ct)
            => await context.spd_applications.Where(a => a.spd_applicationid == appId).SingleOrDefaultAsync(ct);

        public static async Task<spd_portaluser?> GetUserById(this DynamicsContext context, Guid userId, CancellationToken ct)
            => await context.spd_portalusers.Where(a => a.spd_portaluserid == userId).SingleOrDefaultAsync(ct);

        public static async Task<account?> GetOrgById(this DynamicsContext context, Guid organizationId, CancellationToken ct)
           => await context.accounts.Where(a => a.accountid == organizationId).SingleOrDefaultAsync(ct);

        public static async Task<spd_clearance?> GetClearanceById(this DynamicsContext context, Guid clearanceId, CancellationToken ct)
           => await context.spd_clearances.Where(a => a.spd_clearanceid == clearanceId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .SingleOrDefaultAsync(ct);

        public static async Task<contact?> GetContactById(this DynamicsContext context, Guid contactId, CancellationToken ct)
           => await context.contacts.Where(a => a.contactid == contactId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .SingleOrDefaultAsync(ct);

        public static async Task<spd_payment?> GetPaymentById(this DynamicsContext context, Guid paymentId, CancellationToken ct)
             => await context.spd_payments.Where(a => a.spd_paymentid == paymentId).SingleOrDefaultAsync(ct);
    }
}
