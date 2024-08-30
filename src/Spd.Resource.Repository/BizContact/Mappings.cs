using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Application;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.BizContact
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_businesscontact, BizContactResp>()
            .ForMember(d => d.BizContactId, opt => opt.MapFrom(s => s.spd_businesscontactid))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.spd_email))
            .ForMember(d => d.BizContactRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<BizContactRoleOptionSet, BizContactRoleEnum>(s.spd_role)))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.spd_surname))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
            .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s._spd_contactid_value))
            .ForMember(d => d.LicenceId, opt => opt.MapFrom(s => s._spd_swlnumber_value))
            .ForMember(d => d.BizId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.LatestControllingMemberInvitationId, opt => opt.MapFrom(s => GetLastestControllingMemberInvite(s.spd_businesscontact_spd_portalinvitation.ToList()).InviteId))
            .ForMember(d => d.LatestControllingMemberInvitationStatusEnum, opt => opt.MapFrom(s => GetLastestControllingMemberInvite(s.spd_businesscontact_spd_portalinvitation.ToList()).InviteStatus))
            .ForMember(d => d.LatestControllingMemberCrcAppId, opt => opt.MapFrom(s => GetLastestControllingMemberCrcApp(s.spd_businesscontact_spd_application.ToList()).AppId))
            .ForMember(d => d.LatestControllingMemberCrcAppPortalStatusEnum, opt => opt.MapFrom(s => GetLastestControllingMemberCrcApp(s.spd_businesscontact_spd_application.ToList()).PortalStatus))
            .ReverseMap()
            .ForMember(d => d.spd_role, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<BizContactRoleEnum, BizContactRoleOptionSet>(s.BizContactRoleCode)))
            .ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => $"{s.Surname}, {s.GivenName}"));
        }

        private (Guid? AppId, ApplicationPortalStatusEnum? PortalStatus) GetLastestControllingMemberCrcApp(IEnumerable<spd_application> apps)
        {
            spd_application? app = apps.OrderByDescending(app => app.createdon).FirstOrDefault();
            if (app == null) return (null, null);
            else
            {
                if (app.spd_portalstatus == null) return (app.spd_applicationid, null);
                else
                {
                    string status = ((ApplicationPortalStatus)app.spd_portalstatus.Value).ToString();
                    ApplicationPortalStatusEnum statusEnum = Enum.Parse<ApplicationPortalStatusEnum>(status);
                    return (app.spd_applicationid, statusEnum);
                }
            }
        }

        private (Guid? InviteId, ApplicationInviteStatusEnum? InviteStatus) GetLastestControllingMemberInvite(IEnumerable<spd_portalinvitation> invites)
        {
            spd_portalinvitation? invite = invites.OrderByDescending(app => app.createdon).FirstOrDefault();
            if (invite == null) return (null, null);
            else
            {
                if (invite.statuscode == null) return (invite.spd_portalinvitationid, null);
                else
                {
                    string status = ((InvitationStatus)invite.statuscode.Value).ToString();
                    ApplicationInviteStatusEnum statusEnum = Enum.Parse<ApplicationInviteStatusEnum>(status);
                    return (invite.spd_portalinvitationid, statusEnum);
                }
            }
        }
    }
}
