using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Repository.ControllingMemberCrcApplication;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<ControllingMemberCrcApplication, contact>()
        .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName1)))
        .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName2)))
        .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
        .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
        .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.GenderCode)))
        .ForMember(d => d.gendercode, opt => opt.Ignore())
        .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
        .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.BcDriversLicenceNumber))
        .ForMember(d => d.spd_birthplace, opt => opt.Ignore())
        .ForMember(d => d.address2_line1, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.AddressLine1)))
        .ForMember(d => d.address2_line2, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.AddressLine2)))
        .ForMember(d => d.address2_city, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.City)))
        .ForMember(d => d.address2_postalcode, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.PostalCode)))
        .ForMember(d => d.address2_stateorprovince, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.Province)))
        .ForMember(d => d.address2_country, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.Country)))
        .ForMember(d => d.spd_selfdisclosure, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasCriminalHistory)))
        .ForMember(d => d.spd_selfdisclosuredetails, opt => opt.MapFrom(s => s.CriminalHistoryDetail))
        .ForMember(d => d.spd_peaceofficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsPoliceOrPeaceOfficer)))
        .ForMember(d => d.spd_peaceofficerstatus, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleOptionSet(s.PoliceOfficerRoleCode)))
        .ForMember(d => d.spd_peaceofficerother, opt => opt.MapFrom(s => s.OtherOfficerRole))
        .ForMember(d => d.spd_mentalhealthcondition, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsTreatedForMHC)))
        .ReverseMap()
        .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
        .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetGenderEnum(s.spd_sex)))
        .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => GetResidentialAddressData(s)))
        .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_selfdisclosure)))
        .ForMember(d => d.IsPoliceOrPeaceOfficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_peaceofficer)))
        .ForMember(d => d.PoliceOfficerRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleEnum(s.spd_peaceofficerstatus)))
        .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_mentalhealthcondition)))
        .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.firstname))
        .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
        .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
        .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.lastname))
        .ForMember(d => d.BcDriversLicenceNumber, opt => opt.Ignore());
        _ = CreateMap<contact, ControllingMemberCrcApplicationResp>()
        .IncludeBase<contact, ControllingMemberCrcApplication>();

        _ = CreateMap<CreateControllingMemberCrcAppCmd, contact>()
        .IncludeBase<ControllingMemberCrcApplication, contact>()
        .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()));

        _ = CreateMap<ControllingMemberCrcApplication, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
         .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
         .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
         .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
         .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => (int)ApplicationOriginOptionSet.Portal))
         .ForMember(d => d.spd_payer, opt => opt.MapFrom(s => (int)PayerPreferenceOptionSet.Applicant))
         .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
         .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.GenderCode)))
         .ForMember(d => d.spd_criminalhistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasCriminalHistory)))
         .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.BcDriversLicenceNumber))
         .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
         .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
         .ForMember(d => d.spd_residentialaddress1, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.AddressLine1))
         .ForMember(d => d.spd_residentialaddress2, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.AddressLine2))
         .ForMember(d => d.spd_residentialcity, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.City))
         .ForMember(d => d.spd_residentialcountry, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.Country))
         .ForMember(d => d.spd_residentialprovince, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.Province))
         .ForMember(d => d.spd_residentialpostalcode, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.PostalCode))
         .ForMember(d => d.spd_peaceofficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsPoliceOrPeaceOfficer)))
         .ForMember(d => d.spd_policebackgroundrole, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleOptionSet(s.PoliceOfficerRoleCode)))
         .ForMember(d => d.spd_policebackgroundother, opt => opt.MapFrom(s => s.OtherOfficerRole))
         .ForMember(d => d.spd_mentalhealthcondition, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsTreatedForMHC)))
         .ForMember(d => d.spd_bankruptcyhistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasBankruptcyHistory)))
         .ForMember(d => d.spd_bankruptcyhistorydetails, opt => opt.MapFrom(s => s.BankruptcyHistoryDetail))
         .ForMember(d => d.spd_canadiancitizen, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsCanadianCitizen)))
         .ForMember(d => d.spd_haspreviousnames, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasPreviousNames)))
         .ForMember(d => d.spd_hasdriverslicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasBcDriversLicence)))
         .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
         .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
         .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         //TODO: ask if we need to add a property for spd_resideincanada, or fill it in another way 
         //.ForMember(d => d.spd_resideincanada, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsCanadianResident)))
         .ForMember(d => d.spd_criminalchargesconvictionsdetails, opt => opt.MapFrom(s => s.CriminalHistoryDetail))
         .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .ReverseMap()
         .ForMember(d => d.EmailAddress, opt => opt.Ignore())
         .ForMember(d => d.DateOfBirth, opt => opt.Ignore())
         .ForMember(d => d.GenderCode, opt => opt.Ignore())
         .ForMember(d => d.GivenName, opt => opt.Ignore())
         .ForMember(d => d.Surname, opt => opt.Ignore())
         .ForMember(d => d.MiddleName1, opt => opt.Ignore())
         .ForMember(d => d.MiddleName2, opt => opt.Ignore())
         .ForMember(d => d.DateOfBirth, opt => opt.Ignore())
         .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetGenderEnum(s.spd_sex)))
         .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_criminalhistory)))
         .ForMember(d => d.ResidentialAddressData, opt => opt.Ignore())
         .ForMember(d => d.IsPoliceOrPeaceOfficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_peaceofficer)))
         .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_mentalhealthcondition)))
         .ForMember(d => d.IsCanadianCitizen, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_canadiancitizen)))
         .ForMember(d => d.HasBcDriversLicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_hasdriverslicence)))
         .ForMember(d => d.HasPreviousNames, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_haspreviousnames)))
         .ForMember(d => d.PoliceOfficerRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleEnum(s.spd_policebackgroundrole)))
         .ForMember(d => d.HasBankruptcyHistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_bankruptcyhistory)));
         
         //.ForMember(d => d.IsCanadianResident, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_resideincanada)))
         _ = CreateMap<CreateControllingMemberCrcAppCmd, spd_application>()
          .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
          .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
          .IncludeBase<ControllingMemberCrcApplication, spd_application>();

        _ = CreateMap<spd_application, ControllingMemberCrcApplicationResp>()
          .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.spd_ApplicantId_contact.contactid))
          .ForMember(d => d.ControllingMemberCrcAppId, opt => opt.MapFrom(s => s.spd_applicationid))
          .IncludeBase<spd_application, ControllingMemberCrcApplication>();

        _ = CreateMap<AliasResp, spd_alias>()
          .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
          .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
          .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
          .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
          .ForMember(d => d.spd_source, opt => opt.MapFrom(s => AliasSourceTypeOptionSet.UserEntered))
          .ReverseMap();

    }
    private static ResidentialAddr? GetResidentialAddressData(contact c)
    {
        ResidentialAddr mailingAddress = new();
        mailingAddress.AddressLine1 = c.address2_line1;
        mailingAddress.AddressLine2 = c.address2_line2;
        mailingAddress.City = c.address2_city;
        mailingAddress.Province = c.address2_stateorprovince;
        mailingAddress.Country = c.address2_country;
        mailingAddress.PostalCode = c.address2_postalcode;
        return mailingAddress;
    }
}
