using Microsoft.OData.Client;

namespace SPD.DynamicsProxy.Entities
{
    [Key("Id")]
    [OriginalName("spd_orgregistration")]
    public class OrgRegistration : DynamicsEntity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [OriginalName("spd_orgregistrationid")]
        public Guid Id { get; set; }

        [OriginalName("spd_city")]
        public string City { get; set; }

        [OriginalName("spd_province")]
        public string Province { get; set; }

        [OriginalName("spd_identityguid")]
        public string IdentityNumber { get; set; }

        [OriginalName("spd_authorizedcontactphonenumber")]
        public string AuthorizedContactPhoneNumber { get; set; }

        [OriginalName("spd_authorizedcontactdateofbirth")]
        public DateTime AuthorizedContactBirthDate { get; set; }

        [OriginalName("spd_registrationnumber")]
        public string RegistrationNumber { get; set; }

        [OriginalName("spd_organizationlegalname")]
        public string OrganizationLegalName { get; set; }
    }
}
