using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Applicants
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationInviteCreateReq, spd_portalinvitation>()
            .ForMember(d => d.spd_portalinvitationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle));
            //.ForMember(d => d.spd_potentialduplicate, opt => opt.MapFrom(s => (int)Enum.Parse<YesNoOptionSet>(s.HasPotentialDuplicate.ToString())));
        }
    }
}
