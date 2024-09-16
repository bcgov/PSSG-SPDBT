using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

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
            .ForMember(d => d.FullName, opt => opt.MapFrom(s => s.fullname))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => SharedMappingFuncs.GetGenderEnum(s.spd_sex)))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.emailaddress1))
            .ForMember(d => d.BirthPlace, opt => opt.MapFrom(s => s.spd_birthplace))
            .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.telephone1))
            .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => GetResidentialAddress(s)))
            .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => GetMailingAddress(s)))
            .ForMember(d => d.Aliases, opt => opt.MapFrom(s => GetUserEnteredAliases(s.spd_Contact_Alias)))
            .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_selfdisclosure)))
            .ForMember(d => d.CriminalChargeDescription, opt => opt.MapFrom(s => s.spd_selfdisclosuredetails))
            .ForMember(d => d.OtherOfficerRole, opt => opt.MapFrom(s => s.spd_peaceofficerother))
            .ForMember(d => d.IsPoliceOrPeaceOfficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_peaceofficer)))
            .ForMember(d => d.PoliceOfficerRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleEnum(s.spd_peaceofficerstatus)))
            .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_mentalhealthcondition)))
            .ForMember(d => d.LicensingTermAgreedDateTime, opt => opt.MapFrom(s => s.spd_lastloggedinlicensingportal))
            .ForMember(d => d.LastestScreeningLogin, opt => opt.MapFrom(s => s.spd_lastloggedinscreeningportal))
            .ForMember(d => d.IsActive, opt => opt.MapFrom(s => s.statecode == DynamicsConstants.StateCode_Active));

            _ = CreateMap<ContactCmd, contact>()
            .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.FirstName)))
            .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.LastName)))
            .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.BirthDate)))
            .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.Gender)))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName1)))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName2)))
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.MailingAddress == null ? string.Empty : s.MailingAddress.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.MailingAddress == null ? string.Empty : s.MailingAddress.AddressLine2))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.MailingAddress == null ? string.Empty : s.MailingAddress.City))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.MailingAddress == null ? string.Empty : s.MailingAddress.Country))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.MailingAddress == null ? string.Empty : s.MailingAddress.Province))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? string.Empty : s.MailingAddress.PostalCode))
            //.ForMember(d => d.address1_addresstypecode, opt => opt.MapFrom(s => AddressTypeOptionSet.Mailing))
            .ForMember(d => d.address2_line1, opt => opt.MapFrom(s => s.ResidentialAddress == null ? string.Empty : s.ResidentialAddress.AddressLine1))
            .ForMember(d => d.address2_line2, opt => opt.MapFrom(s => s.ResidentialAddress == null ? string.Empty : s.ResidentialAddress.AddressLine2))
            .ForMember(d => d.address2_city, opt => opt.MapFrom(s => s.ResidentialAddress == null ? string.Empty : s.ResidentialAddress.City))
            .ForMember(d => d.address2_country, opt => opt.MapFrom(s => s.ResidentialAddress == null ? string.Empty : s.ResidentialAddress.Country))
            .ForMember(d => d.address2_stateorprovince, opt => opt.MapFrom(s => s.ResidentialAddress == null ? string.Empty : s.ResidentialAddress.Province))
            .ForMember(d => d.address2_postalcode, opt => opt.MapFrom(s => s.ResidentialAddress == null ? string.Empty : s.ResidentialAddress.PostalCode))
            .ForMember(d => d.spd_selfdisclosure, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasCriminalHistory)))
            .ForMember(d => d.spd_selfdisclosuredetails, opt => opt.MapFrom(s => s.CriminalChargeDescription))
            .ForMember(d => d.spd_peaceofficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsPoliceOrPeaceOfficer)))
            .ForMember(d => d.spd_peaceofficerstatus, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleOptionSet(s.PoliceOfficerRoleCode)))
            .ForMember(d => d.spd_peaceofficerother, opt => opt.MapFrom(s => s.OtherOfficerRole))
            .ForMember(d => d.spd_mentalhealthcondition, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsTreatedForMHC)))
            .ForMember(d => d.spd_lastloggedinlicensingportal, opt => opt.Ignore())
            .ForMember(d => d.spd_lastloggedinscreeningportal, opt => opt.Ignore());

            _ = CreateMap<CreateContactCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .IncludeBase<ContactCmd, contact>();

            _ = CreateMap<UpdateContactCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.MapFrom(s => s.Id))
            .IncludeBase<ContactCmd, contact>();

            _ = CreateMap<spd_licence, LicenceInfo>()
             .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_licenceid))
             .ForMember(d => d.LicenceNumber, opt => opt.MapFrom(s => s.spd_licencenumber))
             .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_expirydate)));
        }

        private static ResidentialAddr? GetResidentialAddress(contact contact)
        {
            if (string.IsNullOrWhiteSpace(contact.address2_line1) && string.IsNullOrEmpty(contact.address2_line2)) return null;
            ResidentialAddr addr = new();
            addr.AddressLine1 = contact.address2_line1;
            addr.AddressLine2 = contact.address2_line2;
            addr.City = contact.address2_city;
            addr.Country = contact.address2_country;
            addr.Province = contact.address2_stateorprovince;
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
            addr.Province = contact.address1_stateorprovince;
            addr.PostalCode = contact.address1_postalcode;
            return addr;
        }

        private static IEnumerable<spd_alias> GetUserEnteredAliases(IEnumerable<spd_alias> aliases) => aliases
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active &&
                a.spd_source == (int)Enum.Parse<AliasSourceTypeOptionSet>(AliasSourceTypeOptionSet.UserEntered.ToString()));
    }
}
