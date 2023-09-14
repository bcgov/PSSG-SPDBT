using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Delegates
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<CreateDelegateCmd, spd_delegate>()
            .ForMember(d => d.spd_delegateid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_role, opt => opt.MapFrom(s => (int)Enum.Parse<PSSOUserRoleOptionSet>(s.PSSOUserRoleCode.ToString())))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.EmailAddress));

            _ = CreateMap<spd_delegate, DelegateResp>()
            .ForMember(d => d.PSSOUserRoleCode, opt => opt.MapFrom(s => ((PSSOUserRoleOptionSet)s.spd_role).ToString()))
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_delegateid))
            .ForMember(d => d.PortalUserId, opt => opt.MapFrom(s => s._spd_portaluserid_value))
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.spd_PortalUserId == null ? s.spd_firstname : s.spd_PortalUserId.spd_firstname))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.spd_PortalUserId == null ? s.spd_surname : s.spd_PortalUserId.spd_surname))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.spd_PortalUserId == null ? s.spd_email : s.spd_PortalUserId.spd_emailaddress1));
        }
    }
}
