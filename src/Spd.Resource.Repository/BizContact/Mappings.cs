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
            .ForMember(d => d.BizContactRoleCode, opt => opt.MapFrom(s => GetEnum<BizContactRoleOptionSet, BizContactRoleEnum>(s.spd_role)))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.spd_surname))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
            .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s._spd_contactid_value))
            .ReverseMap();
        }

        internal static O? GetOptionset<E, O>(E? code)
            where E : struct, Enum
            where O : struct, Enum
        {
            if (code == null) return null;
            return Enum.Parse<O>(code.ToString());
        }

        internal static E? GetEnum<O, E>(int? optionset)
            where O : struct, Enum
            where E : struct, Enum
        {
            if (optionset == null) return null;
            return Enum.Parse<E>(Enum.GetName(typeof(O), optionset));
        }
    }
}
