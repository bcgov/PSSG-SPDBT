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
            _ = CreateMap<BizContact, spd_businesscontact>()
                .ForMember(d => d.spd_role, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<BizContactRoleEnum, BizContactRoleOptionSet>(s.BizContactRoleCode)))
                .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
                .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
                .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
                .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
                .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.EmailAddress))
                .ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => $"{s.Surname}, {s.GivenName}"))
                .ReverseMap();

            _ = CreateMap<spd_businesscontact, BizContactResp>()
                .IncludeBase<spd_businesscontact, BizContact>()
                .ForMember(d => d.BizContactId, opt => opt.MapFrom(s => s.spd_businesscontactid))
                .ForMember(d => d.BizContactRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<BizContactRoleOptionSet, BizContactRoleEnum>(s.spd_role)))
                .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s._spd_contactid_value))
                .ForMember(d => d.LicenceId, opt => opt.MapFrom(s => s._spd_swlnumber_value))
                .ForMember(d => d.BizId, opt => opt.MapFrom(s => s._spd_organizationid_value))
                .ForMember(d => d.LatestControllingMemberInvitationId, opt => opt.MapFrom(s => GetLastestControllingMemberInvite(s.spd_businesscontact_spd_portalinvitation.ToList()).InviteId))
                .ForMember(d => d.LatestControllingMemberInvitationStatusEnum, opt => opt.MapFrom(s => GetLastestControllingMemberInvite(s.spd_businesscontact_spd_portalinvitation.ToList()).InviteStatus))
                .ForMember(d => d.LatestControllingMemberCrcAppId, opt => opt.MapFrom(s => GetLastestControllingMemberCrcApp(s.spd_businesscontact_spd_application.ToList()).AppId))
                .ForMember(d => d.LatestControllingMemberCrcAppPortalStatusEnum, opt => opt.MapFrom(s => GetLastestControllingMemberCrcApp(s.spd_businesscontact_spd_application.ToList()).PortalStatus));
        }

        private static (Guid? AppId, ApplicationPortalStatusEnum? PortalStatus) GetLastestControllingMemberCrcApp(IEnumerable<spd_application> apps)
        {
            Guid? cmServiceTypeGuid = DynamicsContextLookupHelpers.GetServiceTypeGuid(ServiceTypeEnum.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC.ToString());
            spd_application? app = apps
                .Where(a => a._spd_servicetypeid_value == cmServiceTypeGuid)
                .OrderByDescending(app => app.createdon)
                .FirstOrDefault();
            if (app == null) return (null, null);
            if (app.spd_portalstatus != (int)ApplicationPortalStatus.Draft &&
                app.spd_portalstatus != (int)ApplicationPortalStatus.VerifyIdentity &&
                app.spd_portalstatus != (int)ApplicationPortalStatus.Incomplete &&
                app.spd_portalstatus != (int)ApplicationPortalStatus.AwaitingPayment)
                return (null, null);
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

        private static (Guid? InviteId, ApplicationInviteStatusEnum? InviteStatus) GetLastestControllingMemberInvite(IEnumerable<spd_portalinvitation> invites)
        {
            spd_portalinvitation? invite = invites.Where(i => i.spd_invitationtype == (int)InvitationTypeOptionSet.ControllingMemberCRC)
                .OrderByDescending(app => app.createdon)
                .FirstOrDefault();
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
