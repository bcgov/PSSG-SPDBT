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
            .ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => s.Name));

            _ = CreateMap<spd_delegate, DelegateResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_delegateid))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.spd_fullname));
        }
    }
}
