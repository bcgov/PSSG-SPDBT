using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.ApplicationInvite
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationInvite, spd_portalinvitation>()
            .ForMember(d => d.spd_portalinvitationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_invitationtype, opt => opt.MapFrom(s => InvitationTypeOptionSet.ScreeningRequest))
            .ForMember(d => d.spd_payeetype, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayeeType.ToString())))
            .ReverseMap();

            _ = CreateMap<spd_portalinvitation, ApplicationInviteResult>()
            .IncludeBase<spd_portalinvitation, ApplicationInvite>()
            .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => GetPayeeType(s.spd_payeetype)))
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portalinvitationid))
            .ForMember(d => d.ErrorMsg, opt => opt.MapFrom(s => s.spd_errormessage))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.statuscode == null ? string.Empty : ((InvitationActiveStatus)s.statuscode).ToString()))
            ;
        }
        private static string? GetPayeeType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(PayerPreferenceOptionSet), code);
        }
    }
}
