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

            _ = CreateMap<ApplicationManualSubmissionCreateCmd, spd_application>()
            .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            //.ForMember(d => d._spd_organizationid_value, opt => opt.MapFrom(s => s.OrganizationId))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
            .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
            //.ForMember(d => d.spd, opt => opt.MapFrom(s => s.DriversLicense))
            .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.spd_birthplace, opt => opt.MapFrom(s => s.BirthPlace))
            //.ForMember(d => d.spd_, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.City))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.Province))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.Country));

            //vulnerableSectorCategory
            //public string Alias1GivenName { get; set; }
            //public string Alias1MiddleName1 { get; set; }
            //public string Alias1MiddleName2 { get; set; }
            //public string Alias1Surname { get; set; }
            //public string Alias2GivenName { get; set; }
            //public string Alias2MiddleName1 { get; set; }
            //public string Alias2MiddleName2 { get; set; }
            //public string Alias2Surname { get; set; }
            //public string Alias3GivenName { get; set; }
            //public string Alias3MiddleName1 { get; set; }
            //public string Alias3MiddleName2 { get; set; }
            //public string Alias3Surname { get; set; }
        }
    }
}
