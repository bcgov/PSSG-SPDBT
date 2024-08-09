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
            .ForMember(d => d.UserEmail, opt => opt.MapFrom(s => s.spd_emailaddress1))
            .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.spd_phonenumber))
            .ForMember(d => d.JobTitle, opt => opt.MapFrom(s => s.spd_jobtitle))
            .ForMember(d => d.IdentityId, opt => opt.MapFrom(s => s._spd_identityid_value))
            .ForMember(d => d.IsPSA, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_psa)))
            .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.ContactRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetContactRoleCode(s.spd_spd_role_spd_portaluser)))
            .ForMember(d => d.IsFirstTimeLogin, opt => opt.MapFrom(s => s.spd_lastloggedin == null))
            .ForMember(d => d.IsActive, opt => opt.MapFrom(s => s._spd_identityid_value == null ? false : true));

            _ = CreateMap<CreatePortalUserCmd, spd_portaluser>()
            .ForMember(d => d.spd_portaluserid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_servicecategory, opt => opt.MapFrom(s =>
                s.PortalUserServiceCategory == PortalUserServiceCategoryEnum.Licensing ?
                (int)PortalUserServiceCategoryOptionSet.Licensing : (int)PortalUserServiceCategoryOptionSet.Screening));

            _ = CreateMap<CreatePortalUserCmd, spd_portalinvitation>()
            .ForMember(d => d.spd_portalinvitationid, opt => Guid.NewGuid())
            .ForMember(d => d.organizationid, opt => opt.Ignore())
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_invitationtype, opt => opt.MapFrom(s => InvitationTypeOptionSet.PortalUser));
        }
    }
}
