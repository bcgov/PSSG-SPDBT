using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.ControllingMemberInvite
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ControllingMemberInvite, spd_portalinvitation>()
            .ForMember(d => d.spd_portalinvitationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_invitationtype, opt => opt.MapFrom(s => s.InviteTypeCode == ControllingMemberAppInviteTypeEnum.New ? (int)InvitationTypeOptionSet.ControllingMemberCRC : (int)InvitationTypeOptionSet.ControllingMemberCRCUpdate))
            .ForMember(d => d.spd_views, opt => opt.MapFrom(s => 0))
            .ForMember(d => d.spd_payeetype, opt => opt.MapFrom(s => PayerPreferenceOptionSet.Applicant))
            .ReverseMap()
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.spd_surname))
            .ForMember(d => d.InviteTypeCode, opt => opt.MapFrom(s => s.spd_invitationtype == (int)InvitationTypeOptionSet.ControllingMemberCRC ? ControllingMemberAppInviteTypeEnum.New : ControllingMemberAppInviteTypeEnum.Update));

            _ = CreateMap<spd_portalinvitation, ControllingMemberInviteResp>()
            .IncludeBase<spd_portalinvitation, ControllingMemberInvite>()
            .ForMember(d => d.BizId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portalinvitationid))
            .ForMember(d => d.ErrorMsg, opt => opt.MapFrom(s => s.spd_errormessage))
            .ForMember(d => d.CreatedByUserId, opt => opt.MapFrom(s => s._spd_invitedby_value))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.statuscode == null ? ApplicationInviteStatusEnum.Draft : Enum.Parse<ApplicationInviteStatusEnum>(((InvitationStatus)s.statuscode).ToString())))
            .ForMember(d => d.Viewed, opt => opt.MapFrom(s => s.spd_views != null && s.spd_views > 0));

            _ = CreateMap<spd_portalinvitation, ControllingMemberInviteVerifyResp>()
            .ForMember(d => d.BizId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.BizContactId, opt => opt.MapFrom(s => s._spd_businesscontact_value))
            .ForMember(d => d.InviteId, opt => opt.MapFrom(s => s.spd_portalinvitationid))
            .ForMember(d => d.InviteTypeCode, opt => opt.MapFrom(s => s.spd_invitationtype == (int)InvitationTypeOptionSet.ControllingMemberCRC ? ControllingMemberAppInviteTypeEnum.New : ControllingMemberAppInviteTypeEnum.Update));
        }
    }
}
