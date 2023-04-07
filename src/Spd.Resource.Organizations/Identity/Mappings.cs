using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Organizations.Identity
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_identity, IdentityInfo>()
             .ForMember(d => d.IdentityNumber, opt => opt.MapFrom(s => s.spd_identitynumber))
             .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_identityid))
             .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s._organizationid_value));
        }
    }
}
