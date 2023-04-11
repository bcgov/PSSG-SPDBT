using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.User
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<User, spd_portaluser>()
            .ForMember(d => d.spd_portaluserid, opt => opt.Ignore())
            .ForMember(d => d.organizationid, opt => opt.Ignore())
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => s.LastName + ", " + s.FirstName))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ReverseMap()
            .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.ContactAuthorizationTypeCode, opt => opt.MapFrom(s => GetAuthorizationTypeCode(s.spd_spd_role_spd_portaluser.FirstOrDefault().spd_roleid)))
            .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s._spd_organizationid_value));

            _ = CreateMap<spd_portaluser, UserResult>()
            .IncludeBase<spd_portaluser, User>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portaluserid))
            .ForMember(d => d.OrgRegistrationId, opt => opt.MapFrom(s => s._spd_orgregistrationid_value));
        }

        private ContactRoleCode GetAuthorizationTypeCode(Guid? roleId)
        {
            if (roleId == null) return ContactRoleCode.Contact;
            return
                Enum.Parse<ContactRoleCode>(
                    DynamicsContextLookupHelpers.RoleGuidDictionary.FirstOrDefault(x => x.Value == roleId).Key);

        }
    }
}
