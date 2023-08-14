using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Organizations.Identity
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_identity, Identity>()
             .ForMember(d => d.IdentityNumber, opt => opt.MapFrom(s => s.spd_identitynumber))
             .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_identityid))
             .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s._organizationid_value))
             .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.spd_ContactId.contactid))
             .ForMember(d => d.LastName, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.spd_ContactId.lastname)))
             .ForMember(d => d.FirstName, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.spd_ContactId.firstname)));

            _ = CreateMap<CreateIdentityCmd, spd_identity>()
             .ForMember(d => d.spd_identityid, opt => opt.MapFrom(s => Guid.NewGuid()))
             .ForMember(d => d.spd_userguid, opt => opt.MapFrom(s => s.UserGuid))
             .ForMember(d => d.spd_orgguid, opt => opt.MapFrom(s => s.OrgGuid))
             .ForMember(d => d.spd_type, opt => opt.MapFrom(s => Enum.Parse<IdentityTypeOptionSet>(s.IdentityProviderType.ToString())));

            _ = CreateMap<spd_identity, IdentityCmdResult>()
             .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_identityid));
        }
    }
}
