using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository.Incident;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.Application
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
            .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
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
            .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.GenderCode)))
            .ForMember(d => d.spd_employeeid, opt => opt.MapFrom(s => s.EmployeeId))
            .ForMember(d => d.spd_uploadid, opt => opt.MapFrom(s => s.UploadId))
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
            .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.GenderCode)))
            .ForMember(d => d.gendercode, opt => opt.Ignore())
            .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
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
            .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.spd_dateofbirth)))
            .ForMember(d => d.CreatedOn, opt => opt.MapFrom(s => s.createdon))
            .ForMember(d => d.HaveVerifiedIdentity, opt => opt.MapFrom(s => s.spd_identityconfirmed))
            .ForMember(d => d.CaseStatus, opt => opt.MapFrom(s => Enum.Parse<CaseStatusEnum>(s.spd_casestatus)))
            .ForMember(d => d.CaseSubStatus, opt => opt.MapFrom(s => GetSubStatusEnum(s.spd_casesubstatus))) //dynamics put number there as string, for example 100000029
            .ForMember(d => d.OrgName, opt => opt.MapFrom(s => s.spd_OrganizationId.name))
            .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => GetServiceType(s._spd_servicetypeid_value)))
            .ForMember(d => d.PaidOn, opt => opt.MapFrom(s => s.spd_paidon))
            .ForMember(d => d.ScreeningType, opt => opt.MapFrom(s => GetScreenType(s.spd_screeningrequesttype)))
            .ForMember(d => d.NumberOfAttempts, opt => opt.MapFrom(s => s.spd_numberofattempts))
            .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s._spd_applicantid_value));

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
            .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetServiceTypeName(s._spd_servicetype_value)))
            .ForMember(d => d.ClearanceId, opt => opt.MapFrom(s => s.spd_clearanceid));
        }

        private static string? GetPayeeType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(PayerPreferenceOptionSet), code);
        }

        private static ServiceTypeEnum? GetServiceType(Guid? serviceTypeGuid)
        {
            if (serviceTypeGuid == null) return null;
            return Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.GetServiceTypeName(serviceTypeGuid));
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

    }
}
