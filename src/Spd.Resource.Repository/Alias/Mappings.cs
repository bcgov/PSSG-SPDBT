using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Alias;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<AliasResp, spd_alias>()
        .ForMember(d => d.spd_aliasid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
        .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
        .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
        .ForMember(d => d.spd_source, opt => opt.MapFrom(s => AliasSourceTypeOptionSet.UserEntered));

        _ = CreateMap<spd_alias, AliasResp>()
         .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_aliasid))
         .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.spd_firstname))
         .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.spd_surname))
         .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
         .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2));
    }
}
