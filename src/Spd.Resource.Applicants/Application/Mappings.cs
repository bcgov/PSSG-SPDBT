using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Resource.Applicants.Incident;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.ResourceContracts;
using Spd.Utilities.Shared.Tools;
using System.Text.RegularExpressions;

namespace Spd.Resource.Applicants.Application
{
    internal partial class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationCreateCmd, spd_application>()
            .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => (int)Enum.Parse<ApplicationOriginOptionSet>(s.OriginTypeCode.ToString())))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName1)))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName2)))
            .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
            .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => GetDate(s.DateOfBirth)))
            .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.DriversLicense))
            .ForMember(d => d.spd_birthplace, opt => opt.MapFrom(s => s.BirthPlace))
            .ForMember(d => d.spd_contractedcompanyname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.ContractedCompanyName)))
            .ForMember(d => d.spd_applicantsposition, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.JobTitle)))
            .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.City)))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.spd_province, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Province)))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Country)))
            .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
            .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
            .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToConsent))
            .ForMember(d => d.spd_payer, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayeeType.ToString())))
            .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => DateTime.Now))
            .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => s.HaveVerifiedIdentity))
            .ForMember(d => d.spd_screeningrequesttype, opt => opt.MapFrom(s => (int)Enum.Parse<ScreenTypeOptionSet>(s.ScreeningType.ToString())))
            .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => GetGender(s.GenderCode)))
            .ForMember(d => d.spd_employeeid, opt => opt.MapFrom(s => s.EmployeeId))
            .ForMember(d => d.statuscode, opt => opt.MapFrom(s => s.HaveVerifiedIdentity == true ? ApplicationStatusOptionSet.PaymentPending : ApplicationStatusOptionSet.ApplicantVerification));

            _ = CreateMap<AliasCreateCmd, spd_alias>()
            .ForMember(d => d.spd_aliasid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_aliastype, opt => opt.MapFrom(s => AliasTypeOptionSet.FormerName))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName1)))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName2)))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)));

            _ = CreateMap<ApplicationCreateCmd, contact>()
            .ForMember(d => d.contactid, opt => opt.Ignore())
            .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
            .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName1)))
            .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName2)))
            .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.jobtitle, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.JobTitle)))
            .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => GetGender(s.GenderCode)))
            .ForMember(d => d.gendercode, opt => opt.Ignore())
            .ForMember(d => d.birthdate, opt => opt.MapFrom(s => new Microsoft.OData.Edm.Date(s.DateOfBirth.Value.Year, s.DateOfBirth.Value.Month, s.DateOfBirth.Value.Day)))
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.DriversLicense))
            .ForMember(d => d.spd_birthplace, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.BirthPlace)))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.City)))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Province)))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Country)));

            _ = CreateMap<spd_application, ApplicationResult>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_applicationid))
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.ApplicationNumber, opt => opt.MapFrom(s => s.spd_name))
            .ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.spd_lastname))
            .ForMember(d => d.JobTitle, opt => opt.MapFrom(s => s.spd_applicantsposition))
            .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => GetPayeeType(s.spd_payer)))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.spd_emailaddress1))
            .ForMember(d => d.ContractedCompanyName, opt => opt.MapFrom(s => s.spd_contractedcompanyname))
            .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => GetDateTimeOffset(s.spd_dateofbirth)))
            .ForMember(d => d.CreatedOn, opt => opt.MapFrom(s => s.createdon))
            .ForMember(d => d.HaveVerifiedIdentity, opt => opt.MapFrom(s => s.spd_identityconfirmed))
            .ForMember(d => d.CaseStatus, opt => opt.MapFrom(s => Enum.Parse<CaseStatusEnum>(s.spd_casestatus)))
            .ForMember(d => d.CaseSubStatus, opt => opt.MapFrom(s => GetSubStatusEnum(s.spd_casesubstatus))) //dynamics put number there as string, for example 100000029
            .ForMember(d => d.OrgName, opt => opt.MapFrom(s => s.spd_OrganizationId.name))
            .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => GetServiceType(s._spd_servicetypeid_value)))
            .ForMember(d => d.PaidOn, opt => opt.MapFrom(s => s.spd_paidon))
            .ForMember(d => d.ScreeningType, opt => opt.MapFrom(s => GetScreenType(s.spd_screeningrequesttype)))
            .ForMember(d => d.NumberOfAttempts, opt => opt.MapFrom(s => s.spd_numberofattempts));

            _ = CreateMap<spd_clearanceaccess, ClearanceAccessResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_clearanceaccessid))
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.spd_applicantfirstname))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.spd_applicantlastname))
            .ForMember(d => d.Facility, opt => opt.MapFrom(s => s.spd_contractedcompanyname))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.spd_emailaddress1))
            .ForMember(d => d.ExpiresOn, opt => opt.MapFrom(s => s.spd_expirydate))
            .ForMember(d => d.ClearanceId, opt => opt.MapFrom(s => s._spd_clearanceid_value))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => ((ClearanceAccessStatusOptionSet)(s.statuscode)).ToString()));

            _ = CreateMap<spd_genericupload, BulkHistoryResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_genericuploadid))
            .ForMember(d => d.BatchNumber, opt => opt.MapFrom(s => s.spd_batchnumber))
            .ForMember(d => d.FileName, opt => opt.MapFrom(s => s.spd_filename))
            .ForMember(d => d.UploadedDateTime, opt => opt.MapFrom(s => s.spd_datetimeuploaded))
            .ForMember(d => d.UploadedByUserFullName, opt => opt.MapFrom(s => s.spd_UploadedBy.spd_fullname));

            _ = CreateMap<spd_clearance, ClearanceResp>()
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.spd_CaseID._spd_organizationid_value))
            .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s.spd_CaseID._spd_applicationid_value))
            .ForMember(d => d.GrantedDate, opt => opt.MapFrom(s => s.spd_dategranted))
            .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.spd_expirydate))
            .ForMember(d => d.WorkWith, opt => opt.MapFrom(s => s.spd_workswith))
            .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.LookupServiceTypeKey(s._spd_servicetype_value)))
            .ForMember(d => d.ClearanceId, opt => opt.MapFrom(s => s.spd_clearanceid));

            _ = CreateMap<LicenceApplication, spd_application>()
             .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
             .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
             .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
             .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
             .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
             .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
             .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => GetDate(s.DateOfBirth)))
             .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => GetGender(s.GenderCode)))
             .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => GetLicenceTerm(s.LicenceTermCode)))
             .ForMember(d => d.spd_criminalhistory, opt => opt.MapFrom(s => GetYesNo(s.HasCriminalHistory)))
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
             .ForMember(d => d.spd_peaceofficer, opt => opt.MapFrom(s => GetYesNo(s.IsPoliceOrPeaceOfficer)))
             .ForMember(d => d.spd_policebackgroundrole, opt => opt.MapFrom(s => GetPoliceRoleOptionSet(s.PoliceOfficerRoleCode)))
             .ForMember(d => d.spd_policebackgroundother, opt => opt.MapFrom(s => s.OtherOfficerRole))
             .ForMember(d => d.spd_mentalhealthcondition, opt => opt.MapFrom(s => GetYesNo(s.IsTreatedForMHC)))
             .ForMember(d => d.spd_usephotofrombcsc, opt => opt.MapFrom(s => GetYesNo(s.UseBcServicesCardPhoto)))
             .ForMember(d => d.spd_requestrestraints, opt => opt.MapFrom(s => GetYesNo(s.CarryAndUseRetraints)))
             .ForMember(d => d.spd_applicantbornincanada, opt => opt.MapFrom(s => GetYesNo(s.IsBornInCanada)))
             .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
             .ForMember(d => d.statuscode, opt => opt.MapFrom(s => ApplicationStatusOptionSet.Draft))
             .ReverseMap()
             .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => GetDateTimeOffset(s.spd_dateofbirth)))
             .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => GetServiceType(s._spd_servicetypeid_value)))
             .ForMember(d => d.LicenceApplicationId, opt => opt.MapFrom(s => s.spd_applicationid))
             .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
             .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => GetGenderEnum(s.spd_sex)))
             .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => GetLicenceTermEnum(s.spd_licenceterm)))
             .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => GetBool(s.spd_criminalhistory)))
             .ForMember(d => d.HairColourCode, opt => opt.MapFrom(s => GetHairColorEnum(s.spd_applicanthaircolour)))
             .ForMember(d => d.EyeColourCode, opt => opt.MapFrom(s => GetEyeColorEnum(s.spd_applicanteyecolour)))
             .ForMember(d => d.MailingAddressData, opt => opt.MapFrom(s => GetMailingAddressData(s)))
             .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => GetResidentialAddressData(s)))
             .ForMember(d => d.IsMailingTheSameAsResidential, opt => opt.MapFrom(s => IsMailingResidentialSame(s)))
             .ForMember(d => d.Height, opt => opt.MapFrom(s => GetHeightNumber(s.spd_height)))
             .ForMember(d => d.HeightUnitCode, opt => opt.MapFrom(s => GetHeightUnitCode(s.spd_height)))
             .ForMember(d => d.Weight, opt => opt.MapFrom(s => GetWeightNumber(s.spd_weight)))
             .ForMember(d => d.WeightUnitCode, opt => opt.MapFrom(s => GetWeightUnitCode(s.spd_weight)))
             .ForMember(d => d.IsPoliceOrPeaceOfficer, opt => opt.MapFrom(s => GetBool(s.spd_peaceofficer)))
             .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => GetBool(s.spd_mentalhealthcondition)))
             .ForMember(d => d.UseBcServicesCardPhoto, opt => opt.MapFrom(s => GetBool(s.spd_usephotofrombcsc)))
             .ForMember(d => d.CarryAndUseRetraints, opt => opt.MapFrom(s => GetBool(s.spd_requestrestraints)))
             .ForMember(d => d.IsBornInCanada, opt => opt.MapFrom(s => GetBool(s.spd_applicantbornincanada)))
             .ForMember(d => d.PoliceOfficerRoleCode, opt => opt.MapFrom(s => GetPoliceRoleEnum(s.spd_policebackgroundrole)))
             ;

            _ = CreateMap<SaveLicenceApplicationCmd, spd_application>()
              .IncludeBase<LicenceApplication, spd_application>();

            _ = CreateMap<spd_application, LicenceApplicationResp>()
              .IncludeBase<spd_application, LicenceApplication>();
        }

        private static DateTimeOffset? GetDateTimeOffset(Date? date)
        {
            if( date == null) return null;
            return new DateTimeOffset(date.Value.Year, date.Value.Month, date.Value.Day, 0, 0, 0, TimeSpan.Zero);
        }

        private static Date? GetDate(DateTimeOffset? datetime)
        {
            if (datetime == null) return null;
            return new Microsoft.OData.Edm.Date(datetime.Value.Year, datetime.Value.Month, datetime.Value.Day);
        }

        private static string? GetPayeeType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(PayerPreferenceOptionSet), code);
        }

        private static int? GetGender(GenderEnum? code)
        {
            if (code == null) return (int)GenderOptionSet.U;
            return (int)Enum.Parse<GenderOptionSet>(code.ToString());
        }

        private static GenderEnum? GetGenderEnum(int? optionset)
        {
            if (optionset == null) return null;
            return Enum.Parse<GenderEnum>(Enum.GetName(typeof(GenderOptionSet), optionset));
        }

        private static ServiceTypeEnum? GetServiceType(Guid? serviceTypeGuid)
        {
            if (serviceTypeGuid == null) return null;
            return Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(serviceTypeGuid));
        }

        private static CaseSubStatusEnum? GetSubStatusEnum(string str)
        {
            try
            {
                return Enum.Parse<CaseSubStatusEnum>(str, true); //ignore case
            }
            catch
            {
                return null;
            }
        }

        private static ScreenTypeEnum GetScreenType(int? code)
        {
            if (code == null) return ScreenTypeEnum.Staff;
            return Enum.Parse<ScreenTypeEnum>(Enum.GetName(typeof(ScreenTypeOptionSet), code));
        }

        private static int? GetLicenceApplicationTypeOptionSet(ApplicationTypeEnum? applicationType)
        {
            if (applicationType == null)
                return null;
            return applicationType switch
            {
                ApplicationTypeEnum.Update => (int)LicenceApplicationTypeOptionSet.Update,
                ApplicationTypeEnum.Replacement => (int)LicenceApplicationTypeOptionSet.Replacement,
                ApplicationTypeEnum.New => (int)LicenceApplicationTypeOptionSet.New_Expired,
                ApplicationTypeEnum.Renewal => (int)LicenceApplicationTypeOptionSet.Renewal,
                _ => throw new ArgumentException("invalid application type code")
            };
        }

        private static ApplicationTypeEnum? GetLicenceApplicationTypeEnum(int? applicationTypeOptionSet)
        {
            if (applicationTypeOptionSet == null)
                return null;
            return applicationTypeOptionSet switch
            {
                (int)LicenceApplicationTypeOptionSet.Update => ApplicationTypeEnum.Update,
                (int)LicenceApplicationTypeOptionSet.Replacement => ApplicationTypeEnum.Replacement,
                (int)LicenceApplicationTypeOptionSet.New_Expired => ApplicationTypeEnum.New,
                (int)LicenceApplicationTypeOptionSet.Renewal => ApplicationTypeEnum.Renewal,
                _ => throw new ArgumentException("invalid int application type option set")
            };
        }
        private static int? GetLicenceTerm(LicenceTermEnum? code)
        {
            if (code == null) return null;
            return (int)Enum.Parse<LicenceTermOptionSet>(code.ToString());
        }

        private static LicenceTermEnum? GetLicenceTermEnum(int? optionset)
        {
            if (optionset == null) return null;
            return Enum.Parse<LicenceTermEnum>(Enum.GetName(typeof(LicenceTermOptionSet), optionset));
        }

        private static int? GetYesNo(bool? value)
        {
            if (value == null) return null;
            return value.Value ? (int)YesNoOptionSet.Yes : (int)YesNoOptionSet.No;
        }

        private static bool? GetBool(int? value)
        {
            if (value == null) return null;
            if (value == (int)YesNoOptionSet.Yes) return true;
            return false;
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
    }
}
