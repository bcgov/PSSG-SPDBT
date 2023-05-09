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
        public static readonly string AppConsentForm = "Applicant Consent Form";
        public static readonly string AppInformation = "Applicant Information";
        public static readonly ImmutableDictionary<string, Guid> BcGovTagDictionary = new Dictionary<string, Guid>()
        {
            {AppConsentForm, Guid.Parse("b9bc7549-0cea-ed11-b840-005056830319")},
            {AppInformation, Guid.Parse("bdbc7549-0cea-ed11-b840-005056830319")},
            {"Armoured Car Guard", Guid.Parse("e7bc7549-0cea-ed11-b840-005056830319")},
            {"Armoured Vehicle Purpose", Guid.Parse("ddbc7549-0cea-ed11-b840-005056830319")},
            {"Armoured Vehicle Rationale", Guid.Parse("dfbc7549-0cea-ed11-b840-005056830319")},
            {"B.C. Companies Registration Verification", Guid.Parse("fbbc7549-0cea-ed11-b840-005056830319")},
            {"BC Services Card", Guid.Parse("d1bc7549-0cea-ed11-b840-005056830319")},
            {"Birth Certificate", Guid.Parse("c3bc7549-0cea-ed11-b840-005056830319")},
            {"Body Armour Purpose", Guid.Parse("e1bc7549-0cea-ed11-b840-005056830319")},
            {"Body Armour Rationale", Guid.Parse("e3bc7549-0cea-ed11-b840-005056830319")},
            {"Business Insurance", Guid.Parse("fdbc7549-0cea-ed11-b840-005056830319")},
            {"Canadian Citizenship", Guid.Parse("c5bc7549-0cea-ed11-b840-005056830319")},
            {"Canadian Firearms License", Guid.Parse("cdbc7549-0cea-ed11-b840-005056830319")},
            {"Canadian Native Status Card", Guid.Parse("cfbc7549-0cea-ed11-b840-005056830319")},
            {"Certificate of Advanced Security Training", Guid.Parse("f7bc7549-0cea-ed11-b840-005056830319")},
            {"Confirmation Letter from Superior Officer", Guid.Parse("ffbc7549-0cea-ed11-b840-005056830319")},
            {"Confirmation of Fingerprints", Guid.Parse("b7bc7549-0cea-ed11-b840-005056830319")},
            {"Convicted Offence", Guid.Parse("dbbc7549-0cea-ed11-b840-005056830319")},
            {"Criminal Charges", Guid.Parse("d9bc7549-0cea-ed11-b840-005056830319")},
            {"Driver's License", Guid.Parse("cbbc7549-0cea-ed11-b840-005056830319")},
            {"Govt-issued Photo ID", Guid.Parse("d5bc7549-0cea-ed11-b840-005056830319")},
            {"Legal Name Change", Guid.Parse("bfbc7549-0cea-ed11-b840-005056830319")},
            {"Legal Work Status", Guid.Parse("c9bc7549-0cea-ed11-b840-005056830319")},
            {"Letter of No Conflict", Guid.Parse("f3bc7549-0cea-ed11-b840-005056830319")},
            {"Locksmith", Guid.Parse("e9bc7549-0cea-ed11-b840-005056830319")},
            {"Mental Health Condition Form", Guid.Parse("f9bc7549-0cea-ed11-b840-005056830319")},
            {"Passport", Guid.Parse("c1bc7549-0cea-ed11-b840-005056830319")},
            {"Permanent Residence Card", Guid.Parse("c7bc7549-0cea-ed11-b840-005056830319")},
            {"Photograph", Guid.Parse("d7bc7549-0cea-ed11-b840-005056830319")},
            {"Private Investigator", Guid.Parse("ebbc7549-0cea-ed11-b840-005056830319")},
            {"Private Investigator Under Supervision", Guid.Parse("edbc7549-0cea-ed11-b840-005056830319")},
            {"Security Alarm Installer", Guid.Parse("e5bc7549-0cea-ed11-b840-005056830319")},
            {"Security Consultant", Guid.Parse("f1bc7549-0cea-ed11-b840-005056830319")},
            {"Security Guard", Guid.Parse("efbc7549-0cea-ed11-b840-005056830319")},
            {"Statutory Declaration", Guid.Parse("bbbc7549-0cea-ed11-b840-005056830319")},
            {"Validation Certificate", Guid.Parse("f5bc7549-0cea-ed11-b840-005056830319")},
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

        public static async Task<spd_application?> GetApplicationById(this DynamicsContext context, Guid appId, CancellationToken ct)
            => await context.spd_applications.Where(a => a.spd_applicationid == appId).SingleOrDefaultAsync(ct);

        public static async Task<spd_portaluser?> GetUserById(this DynamicsContext context, Guid userId, CancellationToken ct)
            => await context.spd_portalusers.Where(a => a.spd_portaluserid == userId).SingleOrDefaultAsync(ct);

        public static async Task<account?> GetOrgById(this DynamicsContext context, Guid organizationId, CancellationToken ct)
           => await context.accounts.Where(a => a.accountid == organizationId).SingleOrDefaultAsync(ct);
    }
}
