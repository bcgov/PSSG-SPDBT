using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Application
{
    internal class Mappings : Profile
    {
        public Mappings()
        {

            _ = CreateMap<ApplicationCreateCmd, spd_application>()
            .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => (int)Enum.Parse<ApplicationOriginOptionSet>(s.OriginTypeCode.ToString())))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
            .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => new Microsoft.OData.Edm.Date(s.DateOfBirth.Value.Year, s.DateOfBirth.Value.Month, s.DateOfBirth.Value.Day)))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.DriversLicense))
            .ForMember(d => d.spd_birthplace, opt => opt.MapFrom(s => s.BirthPlace))
            .ForMember(d => d.spd_contractedcompanyname, opt => opt.MapFrom(s => s.ContractedCompanyName))
            .ForMember(d => d.spd_applicantsposition, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.City))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.Province))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.Country))
            .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
            .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => DateTime.Now))
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
            .ForMember(d => d.birthdate, opt => opt.MapFrom(s => new Microsoft.OData.Edm.Date(s.DateOfBirth.Value.Year, s.DateOfBirth.Value.Month, s.DateOfBirth.Value.Day)))
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.DriversLicense))
            .ForMember(d => d.spd_birthplace, opt => opt.MapFrom(s => s.BirthPlace))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.City))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.Province))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.Country));

            _ = CreateMap<spd_application, ApplicationResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_applicationid))
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.ApplicationNumber, opt => opt.MapFrom(s => s.spd_name))
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.spd_lastname))
            .ForMember(d => d.JobTitle, opt => opt.MapFrom(s => s.spd_applicantsposition))
            .ForMember(d => d.PaidBy, opt => opt.MapFrom(s => GetPaidBy(s.spd_payer)))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.spd_emailaddress1))
            .ForMember(d => d.ContractedCompanyName, opt => opt.MapFrom(s => s.spd_contractedcompanyname))
            .ForMember(d => d.CreatedOn, opt => opt.MapFrom(s => s.createdon))
            .ForMember(d => d.HaveVerifiedIdentity, opt => opt.MapFrom(s => s.spd_identityconfirmed))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.statuscode == null ? string.Empty : ((ApplicationActiveStatus)s.statuscode).ToString()));
        }
        private static string? GetPaidBy(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(PayerPreferenceOptionSet), code);
        }
    }
}
