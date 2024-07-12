using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.User
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
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_servicecategory, opt => opt.MapFrom(s => (int)PortalUserServiceCategoryOptionSet.Screening))
            .ReverseMap()
            .ForMember(d => d.ContactAuthorizationTypeCode, opt => opt.MapFrom(s => GetAuthorizationTypeCode(s.spd_spd_role_spd_portaluser)))
            .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s._spd_organizationid_value));

            _ = CreateMap<spd_portaluser, UserResult>()
            .IncludeBase<spd_portaluser, User>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portaluserid))
            .ForMember(d => d.OrgRegistrationId, opt => opt.MapFrom(s => s._spd_orgregistrationid_value))
            .ForMember(d => d.IsActive, opt => opt.MapFrom(s => s._spd_identityid_value.HasValue))
            .ForMember(d => d.IsFirstTimeLogin, opt => opt.MapFrom(s => !s.spd_lastloggedin.HasValue))
            .ForMember(d => d.UserGuid, opt => opt.MapFrom(s => s.spd_IdentityId == null ? null : s.spd_IdentityId.spd_userguid));

            _ = CreateMap<User, spd_portalinvitation>()
            .ForMember(d => d.spd_portalinvitationid, opt => opt.Ignore())
            .ForMember(d => d.organizationid, opt => opt.Ignore())
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_invitationtype, opt => opt.MapFrom(s => InvitationTypeOptionSet.PortalUser));
        }

        private ContactRoleCode GetAuthorizationTypeCode(ICollection<spd_role> roles)
        {
            Guid? roleId = roles?.FirstOrDefault()?.spd_roleid;
            if (roleId == null) return ContactRoleCode.Contact;
            return
                Enum.Parse<ContactRoleCode>(
                    DynamicsContextLookupHelpers.RoleGuidDictionary.FirstOrDefault(x => x.Value == roleId).Key);

        }
    }
}
