using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Contact
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<contact, ContactResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.contactid))
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.firstname))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.lastname))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => SharedMappingFuncs.GetGenderEnum(s.spd_sex)))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.emailaddress1))
            ;

            _ = CreateMap<ContactCmd, contact>()
            .ForMember(d => d.firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.lastname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.BirthDate)))
            .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.Gender)))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2));

            _ = CreateMap<CreateContactCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .IncludeBase<ContactCmd, contact>();

            _ = CreateMap<UpdateContactCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.MapFrom(s => s.Id))
            .IncludeBase<ContactCmd, contact>();
        }

        private static bool? GetBool(int? value)
        {
            if (value == null) return null;
            if (value == (int)YesNoOptionSet.Yes) return true;
            return false;
        }
    }
}
