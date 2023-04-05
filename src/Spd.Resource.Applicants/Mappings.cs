using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

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

            _ = CreateMap<ApplicationCreateCmd, spd_application>()
            .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => (int)Enum.Parse<ApplicationOriginOptionSet>(s.OriginTypeCode.ToString())))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
            .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.DriversLicense))
            .ForMember(d => d.spd_birthplace, opt => opt.MapFrom(s => s.BirthPlace))
            .ForMember(d => d.spd_applicantsposition, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.City))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.Province))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.Country))
            .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
            .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => s.HaveVerifiedIdentity));

            _ = CreateMap<AliasCreateCmd, spd_alias>()
            .ForMember(d => d.spd_aliasid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_aliastype, opt => opt.MapFrom(s => AliasTypeOptionSet.FormerName))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => s.Surname + ", " + s.GivenName + " " + s.MiddleName1 + " " + s.MiddleName2));

            _ = CreateMap<ApplicationCreateCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.firstname, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
            .ForMember(d => d.lastname, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            //.ForMember(d => d.birthdate, opt => opt.MapFrom(s => s.DateOfBirth)) // todo cbc Datatype issue
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.DriversLicense))
            .ForMember(d => d.spd_birthplace, opt => opt.MapFrom(s => s.BirthPlace))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.City))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.Province))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.Country));
        }
    }
}
