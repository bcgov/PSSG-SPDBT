using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.PortalUser
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_portaluser, PortalUserResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portaluserid))
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.spd_surname))
            .ForMember(d => d.IdentityId, opt => opt.MapFrom(s => s._spd_identityid_value))
            .ForMember(d => d.IsPSA, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_psa)))
            .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.ContactRoleCodes, opt => opt.MapFrom(s => GetContactRoleCodes(s.spd_spd_role_spd_portaluser)));

            _ = CreateMap<CreatePortalUserCmd, spd_portaluser>()
            .ForMember(d => d.spd_portaluserid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress));
        }

        private IEnumerable<ContactRoleCode> GetContactRoleCodes(IEnumerable<spd_role> spd_Roles)
        {
            List<ContactRoleCode> contactRoleCodes = new();
            foreach (var spd_role in spd_Roles)
            {
                contactRoleCodes.Add(Enum.Parse<ContactRoleCode>(
                    DynamicsContextLookupHelpers.RoleGuidDictionary.FirstOrDefault(x => x.Value == spd_role.spd_roleid).Key));
            }
            return contactRoleCodes;
        }
    }
}
