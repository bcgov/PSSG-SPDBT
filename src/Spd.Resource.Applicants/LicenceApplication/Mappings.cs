using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.ResourceContracts;
using Spd.Utilities.Shared.Tools;
using System.Text.RegularExpressions;

namespace Spd.Resource.Applicants.LicenceApplication;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<LicenceApplication, contact>()
        .ForMember(d => d.contactid, opt => opt.Ignore())
        .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName1)))
        .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName2)))
        .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
        .ForMember(d => d.emailaddress1, opt => opt.Ignore())
        .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.GenderCode)))
        .ForMember(d => d.gendercode, opt => opt.Ignore())
        .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.ContactPhoneNumber))
        .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.BcDriversLicenceNumber))
        .ForMember(d => d.spd_birthplace, opt => opt.Ignore())
        .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).AddressLine1))
        .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).AddressLine2))
        .ForMember(d => d.address1_city, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).City))
        .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).PostalCode))
        .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).Province))
        .ForMember(d => d.address1_country, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).Country));

        _ = CreateMap<LicenceApplication, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
         .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
         .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
         .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
         .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
         .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
         .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.GenderCode)))
         .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => GetLicenceTerm(s.LicenceTermCode)))
         .ForMember(d => d.spd_criminalhistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasCriminalHistory)))
         .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.BcDriversLicenceNumber))
         .ForMember(d => d.spd_applicanthaircolour, opt => opt.MapFrom(s => GetHairColor(s.HairColourCode)))
         .ForMember(d => d.spd_applicanteyecolour, opt => opt.MapFrom(s => GetEyeColor(s.EyeColourCode)))
         .ForMember(d => d.spd_height, opt => opt.MapFrom(s => GetHeightStr(s)))
         .ForMember(d => d.spd_weight, opt => opt.MapFrom(s => GetWeightStr(s)))
         .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.ContactEmailAddress))
         .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
         .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).AddressLine1))
         .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).AddressLine2))
         .ForMember(d => d.spd_city, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).City))
         .ForMember(d => d.spd_province, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).Province))
         .ForMember(d => d.spd_country, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).Country))
         .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : GetMailingAddress(s).PostalCode))
         .ForMember(d => d.spd_residentialaddress1, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.AddressLine1))
         .ForMember(d => d.spd_residentialaddress2, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.AddressLine2))
         .ForMember(d => d.spd_residentialcity, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.City))
         .ForMember(d => d.spd_residentialcountry, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.Country))
         .ForMember(d => d.spd_residentialprovince, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.Province))
         .ForMember(d => d.spd_residentialpostalcode, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : s.ResidentialAddressData.PostalCode))
         .ForMember(d => d.spd_peaceofficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsPoliceOrPeaceOfficer)))
         .ForMember(d => d.spd_policebackgroundrole, opt => opt.MapFrom(s => GetPoliceRoleOptionSet(s.PoliceOfficerRoleCode)))
         .ForMember(d => d.spd_policebackgroundother, opt => opt.MapFrom(s => s.OtherOfficerRole))
         .ForMember(d => d.spd_mentalhealthcondition, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsTreatedForMHC)))
         .ForMember(d => d.spd_usephotofrombcsc, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.UseBcServicesCardPhoto)))
         .ForMember(d => d.spd_requestrestraints, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.CarryAndUseRestraints)))
         .ForMember(d => d.spd_canadiancitizen, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsCanadianCitizen)))
         .ForMember(d => d.spd_hasdriverslicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasBcDriversLicence)))
         .ForMember(d => d.spd_hasexpiredlicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasExpiredLicence)))
         .ForMember(d => d.spd_haspreviousnames, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasPreviousName)))
         .ForMember(d => d.spd_requestdogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.UseDogs)))
         .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
         .ForMember(d => d.statuscode, opt => opt.MapFrom(s => ApplicationStatusOptionSet.Incomplete))
         .ForMember(d => d.spd_requestdogsreasons, opt => opt.MapFrom(s => GetDogReasonOptionSets(s)))
         .ReverseMap()
         .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.spd_dateofbirth)))
         .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => GetServiceType(s._spd_servicetypeid_value)))
         .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
         .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
         .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetGenderEnum(s.spd_sex)))
         .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
         .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_criminalhistory)))
         .ForMember(d => d.HairColourCode, opt => opt.MapFrom(s => GetHairColorEnum(s.spd_applicanthaircolour)))
         .ForMember(d => d.EyeColourCode, opt => opt.MapFrom(s => GetEyeColorEnum(s.spd_applicanteyecolour)))
         .ForMember(d => d.MailingAddressData, opt => opt.MapFrom(s => GetMailingAddressData(s)))
         .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => GetResidentialAddressData(s)))
         .ForMember(d => d.IsMailingTheSameAsResidential, opt => opt.MapFrom(s => IsMailingResidentialSame(s)))
         .ForMember(d => d.Height, opt => opt.MapFrom(s => GetHeightNumber(s.spd_height)))
         .ForMember(d => d.HeightUnitCode, opt => opt.MapFrom(s => GetHeightUnitCode(s.spd_height)))
         .ForMember(d => d.Weight, opt => opt.MapFrom(s => GetWeightNumber(s.spd_weight)))
         .ForMember(d => d.WeightUnitCode, opt => opt.MapFrom(s => GetWeightUnitCode(s.spd_weight)))
         .ForMember(d => d.IsPoliceOrPeaceOfficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_peaceofficer)))
         .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_mentalhealthcondition)))
         .ForMember(d => d.UseBcServicesCardPhoto, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_usephotofrombcsc)))
         .ForMember(d => d.IsDogsPurposeProtection, opt => opt.MapFrom(s => GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.Protection)))
         .ForMember(d => d.IsDogsPurposeDetectionDrugs, opt => opt.MapFrom(s => GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionDrugs)))
         .ForMember(d => d.IsDogsPurposeDetectionExplosives, opt => opt.MapFrom(s => GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionExplosives)))
         .ForMember(d => d.CarryAndUseRestraints, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestrestraints)))
         .ForMember(d => d.IsCanadianCitizen, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_canadiancitizen)))
         .ForMember(d => d.HasBcDriversLicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_hasdriverslicence)))
         .ForMember(d => d.HasExpiredLicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_hasexpiredlicence)))
         .ForMember(d => d.HasPreviousName, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_haspreviousnames)))
         .ForMember(d => d.UseDogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestdogs)))
         .ForMember(d => d.PoliceOfficerRoleCode, opt => opt.MapFrom(s => GetPoliceRoleEnum(s.spd_policebackgroundrole)))
         .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => s.spd_application_spd_licencecategory))
         .ForMember(d => d.ExpiredLicenceId, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licenceid))
         .ForMember(d => d.ExpiredLicenceNumber, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licencenumber))
         ;

        _ = CreateMap<spd_licencecategory, WorkerLicenceAppCategory>()
          .ForMember(d => d.WorkerCategoryTypeCode,
          opt => opt.MapFrom(s => Enum.Parse<WorkerCategoryTypeEnum>(DynamicsContextLookupHelpers.LookupLicenceCategoryKey(s.spd_licencecategoryid))));

        _ = CreateMap<SaveLicenceApplicationCmd, spd_application>()
          .IncludeBase<LicenceApplication, spd_application>();

        _ = CreateMap<spd_application, LicenceApplicationResp>()
          .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.spd_ApplicantId_contact.contactid))
          .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_CurrentExpiredLicenceId.spd_expirydate)))
          .ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
          .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
          .IncludeBase<spd_application, LicenceApplication>();

        _ = CreateMap<spd_application, LicenceAppListResp>()
          .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
          .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => GetServiceType(s._spd_servicetypeid_value)))
          .ForMember(d => d.CreatedOn, opt => opt.MapFrom(s => s.createdon))
          .ForMember(d => d.SubmittedOn, opt => opt.MapFrom(s => s.spd_submittedon))
          .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
          .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
          .ForMember(d => d.ApplicationPortalStatusCode, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()));

        _ = CreateMap<Alias, spd_alias>()
          .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
          .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
          .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
          .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
          .ForMember(d => d.spd_source, opt => opt.MapFrom(s => AliasSourceTypeOptionSet.UserEntered))
          .ReverseMap();
    }

    private static ServiceTypeEnum? GetServiceType(Guid? serviceTypeGuid)
    {
        if (serviceTypeGuid == null) return null;
        return Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(serviceTypeGuid));
    }

    private static int? GetLicenceTerm(LicenceTermEnum? code)
    {
        if (code == null) return null;
        return (int)Enum.Parse<LicenceTermOptionSet>(code.ToString());
    }

    private static int? GetHairColor(HairColourEnum? code)
    {
        if (code == null) return null;
        return (int)Enum.Parse<HairColorOptionSet>(code.ToString());
    }

    private static HairColourEnum? GetHairColorEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<HairColourEnum>(Enum.GetName(typeof(HairColorOptionSet), optionset));
    }

    private static int? GetEyeColor(EyeColourEnum? code)
    {
        if (code == null) return null;
        return (int)Enum.Parse<EyeColorOptionSet>(code.ToString());
    }

    private static EyeColourEnum? GetEyeColorEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<EyeColourEnum>(Enum.GetName(typeof(EyeColorOptionSet), optionset));
    }

    private static Addr GetMailingAddress(LicenceApplication app)
    {
        //if residential address is the same as mailing address, fe will send an empty mailing address
        if (app.IsMailingTheSameAsResidential == null || !(bool)app.IsMailingTheSameAsResidential)
            return app.MailingAddressData;
        if ((bool)app.IsMailingTheSameAsResidential) return app.ResidentialAddressData;
        return app.MailingAddressData;
    }

    private static string? GetWeightStr(LicenceApplication app)
    {
        if (app.WeightUnitCode != null)
        {
            return app.WeightUnitCode switch
            {
                WeightUnitEnum.Kilograms => app.Weight + "kg",
                WeightUnitEnum.Pounds => app.Weight + "lb",
            };
        }
        else
        {
            return app.Weight.ToString();
        }
    }

    //str should be like 130lb or 65kg or lb or kg or 130
    private static int? GetWeightNumber(string? str)
    {
        if (str == null) return null;
        try
        {
            string temp = str.Replace("lb", string.Empty).Replace("kg", string.Empty);
            return int.Parse(temp);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    //str should be like 130lb or 65kg or lb or kg or 130
    private static WeightUnitEnum? GetWeightUnitCode(string? str)
    {
        if (str == null) return null;
        try
        {
            string temp = Regex.Replace(str, @"\d", string.Empty);
            if (temp == "kg") return WeightUnitEnum.Kilograms;
            if (temp == "lb") return WeightUnitEnum.Pounds;
            else
                return null;
        }
        catch (Exception e)
        {
            return null;
        }
    }

    private static string GetHeightStr(LicenceApplication app)
    {
        //if residential address is the same as mailing address, fe will send an empty mailing address
        if (app.HeightUnitCode != null)
        {
            return app.HeightUnitCode switch
            {
                HeightUnitEnum.Centimeters => app.Height + "cm",
                HeightUnitEnum.Inches => app.Height + "in", //todo: when ui decide what to use.
            };
        }
        else
        {
            return app.Height.ToString();
        }
    }

    //str should be like 130lb or 65kg or lb or kg or 130
    private static int? GetHeightNumber(string? str)
    {
        if (str == null) return null;
        try
        {
            string temp = str.Replace("cm", string.Empty).Replace("in", string.Empty);
            return int.Parse(temp);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    //str should be like 130lb or 65kg or lb or kg or 130
    private static HeightUnitEnum? GetHeightUnitCode(string? str)
    {
        if (str == null) return null;
        try
        {
            string temp = Regex.Replace(str, @"\d", string.Empty);
            if (temp == "in") return HeightUnitEnum.Inches;
            if (temp == "cm") return HeightUnitEnum.Centimeters;
            else
                return null;
        }
        catch (Exception e)
        {
            return null;
        }
    }
    private static MailingAddr? GetMailingAddressData(spd_application app)
    {
        MailingAddr mailingAddress = new MailingAddr();
        mailingAddress.AddressLine1 = app.spd_addressline1;
        mailingAddress.AddressLine2 = app.spd_addressline2;
        mailingAddress.City = app.spd_city;
        mailingAddress.Province = app.spd_province;
        mailingAddress.Country = app.spd_country;
        mailingAddress.PostalCode = app.spd_postalcode;
        return mailingAddress;
    }

    private static ResidentialAddr? GetResidentialAddressData(spd_application app)
    {
        ResidentialAddr residentialAddress = new ResidentialAddr();
        residentialAddress.AddressLine1 = app.spd_residentialaddress1;
        residentialAddress.AddressLine2 = app.spd_residentialaddress2;
        residentialAddress.City = app.spd_residentialcity;
        residentialAddress.Province = app.spd_residentialprovince;
        residentialAddress.Country = app.spd_residentialcountry;
        residentialAddress.PostalCode = app.spd_residentialpostalcode;
        return residentialAddress;
    }

    private static bool? IsMailingResidentialSame(spd_application app)
    {
        if (app.spd_residentialaddress1 == null
            && app.spd_residentialaddress2 == null
            && app.spd_residentialcity == null
            && app.spd_residentialprovince == null
            && app.spd_residentialcountry == null
            && app.spd_residentialpostalcode == null
            && app.spd_addressline1 == null
            && app.spd_addressline2 == null
            && app.spd_city == null
            && app.spd_country == null
            && app.spd_province == null
            && app.spd_postalcode == null)
            return null;
        return app.spd_residentialaddress1 == app.spd_addressline1 &&
            app.spd_residentialaddress2 == app.spd_addressline2 &&
            app.spd_residentialcity == app.spd_city &&
            app.spd_residentialprovince == app.spd_province &&
            app.spd_residentialcountry == app.spd_country &&
            app.spd_residentialpostalcode == app.spd_postalcode;
    }

    private static int? GetPoliceRoleOptionSet(PoliceOfficerRoleEnum? policeRole)
    {
        if (policeRole == null)
            return null;
        return (int)Enum.Parse<PoliceOfficerRoleOptionSet>(policeRole.ToString());
    }

    private static PoliceOfficerRoleEnum? GetPoliceRoleEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<PoliceOfficerRoleEnum>(Enum.GetName(typeof(PoliceOfficerRoleOptionSet), optionset));
    }

    private static string? GetDogReasonOptionSets(LicenceApplication app)
    {
        List<string> reasons = new List<string>();

        if (app.IsDogsPurposeDetectionDrugs != null && app.IsDogsPurposeDetectionDrugs == true)
            reasons.Add(((int)RequestDogPurposeOptionSet.DetectionDrugs).ToString());
        if (app.IsDogsPurposeDetectionExplosives != null && app.IsDogsPurposeDetectionExplosives == true)
            reasons.Add(((int)RequestDogPurposeOptionSet.DetectionExplosives).ToString());
        if (app.IsDogsPurposeProtection != null && app.IsDogsPurposeProtection == true)
            reasons.Add(((int)RequestDogPurposeOptionSet.Protection).ToString());
        var result = String.Join(',', reasons.ToArray());

        return string.IsNullOrWhiteSpace(result) ? null : result;
    }

    private static bool? GetDogReasonFlag(string dogreasonsStr, RequestDogPurposeOptionSet type)
    {
        if (dogreasonsStr == null) return null;
        string[] reasons = dogreasonsStr.Split(',');
        string str = ((int)type).ToString();
        if (reasons.Any(s => s == str)) return true;

        return false;
    }
}

