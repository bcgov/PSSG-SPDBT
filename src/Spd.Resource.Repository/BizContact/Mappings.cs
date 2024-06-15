using AutoMapper;
using Microsoft.Dynamics.CRM;
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
            .ReverseMap()
            .ForMember(d => d.spd_role, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<BizContactRoleEnum, BizContactRoleOptionSet>(s.BizContactRoleCode)))
            .ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => $"{s.Surname}, {s.GivenName}"));
        }
    }
}
