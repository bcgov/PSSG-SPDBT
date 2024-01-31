using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Contact
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
            .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => GetResidentialAddress(s)))
            .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => GetMailingAddress(s)))
            .ForMember(d => d.Aliases, opt => opt.MapFrom(s => s.spd_Contact_Alias))
            ;

            _ = CreateMap<ContactCmd, contact>()
            .ForMember(d => d.firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.lastname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.BirthDate)))
            .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.Gender)))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.AddressLine2))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.City))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.Country))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.Province))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.PostalCode))
            //.ForMember(d => d.address1_addresstypecode, opt => opt.MapFrom(s => AddressTypeOptionSet.Mailing))
            .ForMember(d => d.address2_line1, opt => opt.MapFrom(s => s.ResidentialAddress == null ? null : s.ResidentialAddress.AddressLine1))
            .ForMember(d => d.address2_line2, opt => opt.MapFrom(s => s.ResidentialAddress == null ? null : s.ResidentialAddress.AddressLine2))
            .ForMember(d => d.address2_city, opt => opt.MapFrom(s => s.ResidentialAddress == null ? null : s.ResidentialAddress.City))
            .ForMember(d => d.address2_country, opt => opt.MapFrom(s => s.ResidentialAddress == null ? null : s.ResidentialAddress.Country))
            .ForMember(d => d.address2_stateorprovince, opt => opt.MapFrom(s => s.ResidentialAddress == null ? null : s.ResidentialAddress.Province))
            .ForMember(d => d.address2_postalcode, opt => opt.MapFrom(s => s.ResidentialAddress == null ? null : s.ResidentialAddress.PostalCode))
            //.ForMember(d => d.address2_addresstypecode, opt => opt.MapFrom(s => AddressTypeOptionSet.Physical))
            ;

            _ = CreateMap<CreateContactCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .IncludeBase<ContactCmd, contact>();

            _ = CreateMap<UpdateContactCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.MapFrom(s => s.Id))
            .IncludeBase<ContactCmd, contact>();

            _ = CreateMap<Alias, spd_alias>()
              .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
              .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
              .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
              .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
              .ForMember(d => d.spd_source, opt => opt.MapFrom(s => AliasSourceTypeOptionSet.UserEntered))
              .ReverseMap();
        }

        private static ResidentialAddr? GetResidentialAddress(contact contact)
        {
            if (string.IsNullOrWhiteSpace(contact.address2_line1) && string.IsNullOrEmpty(contact.address2_line2)) return null;
            ResidentialAddr addr = new();
            addr.AddressLine1 = contact.address2_line1;
            addr.AddressLine2 = contact.address2_line2;
            addr.City = contact.address2_city;
            addr.Country = contact.address2_country;
            addr.Province = contact.address2_county;
            addr.PostalCode = contact.address2_postalcode;
            return addr;
        }

        private static MailingAddr? GetMailingAddress(contact contact)
        {
            if (string.IsNullOrWhiteSpace(contact.address1_line1) && string.IsNullOrEmpty(contact.address1_line2)) return null;
            MailingAddr addr = new();
            addr.AddressLine1 = contact.address1_line1;
            addr.AddressLine2 = contact.address1_line2;
            addr.City = contact.address1_city;
            addr.Country = contact.address1_country;
            addr.Province = contact.address1_county;
            addr.PostalCode = contact.address1_postalcode;
            return addr;
        }
    }
}
