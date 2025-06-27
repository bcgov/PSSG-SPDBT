using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.Identity
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_identity, Identity>()
             .ForMember(d => d.IdentityNumber, opt => opt.MapFrom(s => s.spd_identitynumber))
             .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_identityid))
             .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s._organizationid_value))
             .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s._spd_contactid_value))
             .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.spd_ContactId != null ? StringHelper.ToTitleCase(s.spd_ContactId.lastname) : null))
             .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.spd_ContactId != null ? StringHelper.ToTitleCase(s.spd_ContactId.firstname) : null))
             .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_ContactId != null ? StringHelper.ToTitleCase(s.spd_ContactId.spd_middlename1) : null))
             .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_ContactId != null ? StringHelper.ToTitleCase(s.spd_ContactId.spd_middlename2) : null))
             .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.spd_ContactId != null ? s.spd_ContactId.emailaddress1 : null))
             .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.spd_ContactId != null ? GetDateOnly(s.spd_ContactId.birthdate) : null))
             .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.spd_ContactId != null ? GetGenderEnum(s.spd_ContactId.spd_sex) : null))
             .ForMember(d => d.Sub, opt => opt.MapFrom(s => s.spd_userguid));

            _ = CreateMap<CreateIdentityCmd, spd_identity>()
             .ForMember(d => d.spd_identityid, opt => opt.MapFrom(s => Guid.NewGuid()))
             .ForMember(d => d.spd_userguid, opt => opt.MapFrom(s => s.UserGuid))
             .ForMember(d => d.spd_orgguid, opt => opt.MapFrom(s => s.OrgGuid))
             .ForMember(d => d.spd_type, opt => opt.MapFrom(s => Enum.Parse<IdentityTypeOptionSet>(s.IdentityProviderType.ToString())));

            _ = CreateMap<spd_identity, IdentityCmdResult>()
             .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_identityid));
        }

        internal static DateOnly? GetDateOnly(Date? date)
        {
            if (date == null) return null;
            return new DateOnly(date.Value.Year, date.Value.Month, date.Value.Day);
        }
        internal static GenderEnum? GetGenderEnum(int? optionset)
        {
            if (optionset == null) return null;
            return Enum.Parse<GenderEnum>(Enum.GetName(typeof(GenderOptionSet), optionset));
        }
    }
}
