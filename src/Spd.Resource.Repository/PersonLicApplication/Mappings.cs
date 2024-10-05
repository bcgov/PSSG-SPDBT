using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Alias;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;
using System.Text.RegularExpressions;

namespace Spd.Resource.Repository.PersonLicApplication;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<LicenceApplication, contact>()
        .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName1)))
        .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName2)))
        .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
        .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.ContactEmailAddress))
        .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => SharedMappingFuncs.GetGender(s.GenderCode)))
        .ForMember(d => d.gendercode, opt => opt.Ignore())
        .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.ContactPhoneNumber))
        .ForMember(d => d.spd_bcdriverslicense, opt => opt.MapFrom(s => s.BcDriversLicenceNumber))
        .ForMember(d => d.spd_birthplace, opt => opt.Ignore())
        .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : StringHelper.SanitizeEmpty(GetMailingAddress(s).AddressLine1)))
        .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : StringHelper.SanitizeEmpty(GetMailingAddress(s).AddressLine2)))
        .ForMember(d => d.address1_city, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : StringHelper.SanitizeEmpty(GetMailingAddress(s).City)))
        .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : StringHelper.SanitizeEmpty(GetMailingAddress(s).PostalCode)))
        .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : StringHelper.SanitizeEmpty(GetMailingAddress(s).Province)))
        .ForMember(d => d.address1_country, opt => opt.MapFrom(s => GetMailingAddress(s) == null ? null : StringHelper.SanitizeEmpty(GetMailingAddress(s).Country)))
        .ForMember(d => d.address2_line1, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.AddressLine1)))
        .ForMember(d => d.address2_line2, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.AddressLine2)))
        .ForMember(d => d.address2_city, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.City)))
        .ForMember(d => d.address2_postalcode, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.PostalCode)))
        .ForMember(d => d.address2_stateorprovince, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.Province)))
        .ForMember(d => d.address2_country, opt => opt.MapFrom(s => s.ResidentialAddressData == null ? null : StringHelper.SanitizeEmpty(s.ResidentialAddressData.Country)))
        .ForMember(d => d.spd_selfdisclosure, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasCriminalHistory)))
        .ForMember(d => d.spd_selfdisclosuredetails, opt => opt.MapFrom(s => s.CriminalChargeDescription))
        .ForMember(d => d.spd_peaceofficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsPoliceOrPeaceOfficer)))
        .ForMember(d => d.spd_peaceofficerstatus, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleOptionSet(s.PoliceOfficerRoleCode)))
        .ForMember(d => d.spd_peaceofficerother, opt => opt.MapFrom(s => s.OtherOfficerRole))
        .ForMember(d => d.spd_mentalhealthcondition, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsTreatedForMHC)))
        .ReverseMap()
        .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
        .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetGenderEnum(s.spd_sex)))
        .ForMember(d => d.MailingAddressData, opt => opt.MapFrom(s => GetMailingAddressData(s)))
        .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => GetResidentialAddressData(s)))
        .ForMember(d => d.IsMailingTheSameAsResidential, opt => opt.MapFrom(s => IsMailingResidentialSame(s)))
        .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_selfdisclosure)))
        .ForMember(d => d.IsPoliceOrPeaceOfficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_peaceofficer)))
        .ForMember(d => d.PoliceOfficerRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleEnum(s.spd_peaceofficerstatus)))
        .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_mentalhealthcondition)))
        .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.firstname))
        .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.spd_middlename1))
        .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.spd_middlename2))
        .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.lastname))
        .ForMember(d => d.BcDriversLicenceNumber, opt => opt.Ignore());

        _ = CreateMap<contact, LicenceApplicationResp>()
        .IncludeBase<contact, LicenceApplication>();

        _ = CreateMap<CreateLicenceApplicationCmd, contact>()
        .IncludeBase<LicenceApplication, contact>()
        .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()));

        _ = CreateMap<LicenceApplication, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
         .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
         .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
         .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
         .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
         .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => (int)SharedMappingFuncs.GetOptionset<ApplicationOriginTypeCode, ApplicationOriginOptionSet>(s.ApplicationOriginTypeCode)))
         .ForMember(d => d.spd_payer, opt => opt.MapFrom(s => (int)PayerPreferenceOptionSet.Applicant))
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
         .ForMember(d => d.spd_policebackgroundrole, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleOptionSet(s.PoliceOfficerRoleCode)))
         .ForMember(d => d.spd_policebackgroundother, opt => opt.MapFrom(s => s.OtherOfficerRole))
         .ForMember(d => d.spd_mentalhealthcondition, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsTreatedForMHC)))
         .ForMember(d => d.spd_requestrestraints, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.CarryAndUseRestraints)))
         .ForMember(d => d.spd_canadiancitizen, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsCanadianCitizen)))
         .ForMember(d => d.spd_hasdriverslicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasBcDriversLicence)))
         .ForMember(d => d.spd_hasexpiredlicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasExpiredLicence)))
         .ForMember(d => d.spd_haspreviousnames, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasPreviousName)))
         .ForMember(d => d.spd_businesstype, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizType(s.BizTypeCode)))
         .ForMember(d => d.spd_requestdogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.UseDogs)))
         .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
         .ForMember(d => d.spd_requestdogsreasons, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonOptionSets(s.IsDogsPurposeDetectionDrugs,s.IsDogsPurposeProtection, s.IsDogsPurposeDetectionExplosives)))
         .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
         .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
         .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => GetDeclarationDate(s)))
         .ForMember(d => d.spd_legalnamechange, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.HasLegalNameChanged)))
         .ForMember(d => d.spd_employeraddress1, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null ? null : StringHelper.SanitizeEmpty(s.EmployerPrimaryAddress.AddressLine1)))
         .ForMember(d => d.spd_employeraddress2, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null ? null : StringHelper.SanitizeEmpty(s.EmployerPrimaryAddress.AddressLine2)))
         .ForMember(d => d.spd_employercity, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null ? null : StringHelper.SanitizeEmpty(s.EmployerPrimaryAddress.City)))
         .ForMember(d => d.spd_employercountry, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null ? null : StringHelper.SanitizeEmpty(s.EmployerPrimaryAddress.Country)))
         .ForMember(d => d.spd_employerpostalcode, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null ? null : StringHelper.SanitizeEmpty(s.EmployerPrimaryAddress.PostalCode)))
         .ForMember(d => d.spd_employerprovince, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null ? null : StringHelper.SanitizeEmpty(s.EmployerPrimaryAddress.Province)))
         .ForMember(d => d.spd_employeremail, opt => opt.MapFrom(s => StringHelper.SanitizeEmpty(s.SupervisorEmailAddress)))
         .ForMember(d => d.spd_employerphonenumber, opt => opt.MapFrom(s => StringHelper.SanitizeEmpty(s.SupervisorPhoneNumber)))
         .ForMember(d => d.spd_employercontactname, opt => opt.MapFrom(s => StringHelper.SanitizeEmpty(s.SupervisorName)))
         .ForMember(d => d.spd_employername, opt => opt.MapFrom(s => StringHelper.SanitizeEmpty(s.EmployerName)))
         .ForMember(d => d.spd_rationale, opt => opt.MapFrom(s => s.Rationale))
         .ForMember(d => d.spd_permitpurposeother, opt => opt.MapFrom(s => s.PermitOtherRequiredReason))
         .ForMember(d => d.spd_resideincanada, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsCanadianResident)))
         .ForMember(d => d.spd_permitpurpose, opt => opt.MapFrom(s => SharedMappingFuncs.GetPermitPurposeOptionSets(s.PermitPurposeEnums)))
         .ForMember(d => d.spd_uploadeddocuments, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentOptionSets(s.UploadedDocumentEnums)))
         .ForMember(d => d.spd_criminalchargesconvictionsdetails, opt => opt.MapFrom(s => s.CriminalChargeDescription))
         .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => SharedMappingFuncs.GetIdentityConfirmed(s.ApplicationOriginTypeCode, s.ApplicationTypeCode)))
         .ReverseMap()
         .ForMember(d => d.ContactEmailAddress, opt => opt.Ignore())
         .ForMember(d => d.DateOfBirth, opt => opt.Ignore())
         .ForMember(d => d.GenderCode, opt => opt.Ignore())
         .ForMember(d => d.GivenName, opt => opt.Ignore())
         .ForMember(d => d.Surname, opt => opt.Ignore())
         .ForMember(d => d.MiddleName1, opt => opt.Ignore())
         .ForMember(d => d.MiddleName2, opt => opt.Ignore())
         .ForMember(d => d.DateOfBirth, opt => opt.Ignore())
         .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
         .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
         .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetGenderEnum(s.spd_sex)))
         .ForMember(d => d.BizTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeEnum(s.spd_businesstype)))
         .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
         .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeCode>(s.spd_origin)))
         .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_criminalhistory)))
         .ForMember(d => d.HairColourCode, opt => opt.MapFrom(s => GetHairColorEnum(s.spd_applicanthaircolour)))
         .ForMember(d => d.EyeColourCode, opt => opt.MapFrom(s => GetEyeColorEnum(s.spd_applicanteyecolour)))
         .ForMember(d => d.MailingAddressData, opt => opt.Ignore())
         .ForMember(d => d.ResidentialAddressData, opt => opt.Ignore())
         .ForMember(d => d.IsMailingTheSameAsResidential, opt => opt.Ignore())
         .ForMember(d => d.Height, opt => opt.MapFrom(s => GetHeightNumber(s.spd_height)))
         .ForMember(d => d.HasLegalNameChanged, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_legalnamechange)))
         .ForMember(d => d.HeightUnitCode, opt => opt.MapFrom(s => GetHeightUnitCode(s.spd_height)))
         .ForMember(d => d.Weight, opt => opt.MapFrom(s => GetWeightNumber(s.spd_weight)))
         .ForMember(d => d.WeightUnitCode, opt => opt.MapFrom(s => GetWeightUnitCode(s.spd_weight)))
         .ForMember(d => d.IsPoliceOrPeaceOfficer, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_peaceofficer)))
         .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_mentalhealthcondition)))
         .ForMember(d => d.IsDogsPurposeProtection, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.Protection)))
         .ForMember(d => d.IsDogsPurposeDetectionDrugs, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionDrugs)))
         .ForMember(d => d.IsDogsPurposeDetectionExplosives, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionExplosives)))
         .ForMember(d => d.CarryAndUseRestraints, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestrestraints)))
         .ForMember(d => d.IsCanadianCitizen, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_canadiancitizen)))
         .ForMember(d => d.HasBcDriversLicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_hasdriverslicence)))
         .ForMember(d => d.HasExpiredLicence, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_hasexpiredlicence)))
         .ForMember(d => d.HasPreviousName, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_haspreviousnames)))
         .ForMember(d => d.UseDogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestdogs)))
         .ForMember(d => d.PoliceOfficerRoleCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetPoliceRoleEnum(s.spd_policebackgroundrole)))
         .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => SharedMappingFuncs.GetWorkerCategoryTypeEnums(s.spd_application_spd_licencecategory)))
         .ForMember(d => d.ExpiredLicenceId, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licenceid))
         .ForMember(d => d.EmployerPrimaryAddress, opt => opt.MapFrom(s => GetEmployerAddressData(s)))
         .ForMember(d => d.IsCanadianResident, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_resideincanada)))
         .ForMember(d => d.PermitPurposeEnums, opt => opt.MapFrom(s => SharedMappingFuncs.GetPermitPurposeEnums(s.spd_permitpurpose)))
         .ForMember(d => d.UploadedDocumentEnums, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentEnums(s.spd_uploadeddocuments)))
         .ForMember(d => d.SupervisorEmailAddress, opt => opt.MapFrom(s => s.spd_employeremail))
         .ForMember(d => d.SupervisorPhoneNumber, opt => opt.MapFrom(s => s.spd_employerphonenumber))
         .ForMember(d => d.SupervisorName, opt => opt.MapFrom(s => s.spd_employercontactname))
         .ForMember(d => d.EmployerName, opt => opt.MapFrom(s => s.spd_employername));

        _ = CreateMap<CreateLicenceApplicationCmd, spd_application>()
          .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
          .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
          .IncludeBase<LicenceApplication, spd_application>();

        _ = CreateMap<SaveLicenceApplicationCmd, spd_application>()
          .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
          .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => s.LicenceAppId ?? Guid.NewGuid()))
          .IncludeBase<LicenceApplication, spd_application>();

        _ = CreateMap<SaveLicenceApplicationCmd, contact>()
          .IncludeBase<LicenceApplication, contact>();

        _ = CreateMap<spd_application, LicenceApplicationResp>()
          .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.spd_ApplicantId_contact.contactid))
          .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_CurrentExpiredLicenceId.spd_expirydate)))
          .ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
          .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
          .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
          .ForMember(d => d.OriginalLicenceTermCode, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : SharedMappingFuncs.GetLicenceTermEnum(s.spd_CurrentExpiredLicenceId.spd_licenceterm)))
          .ForMember(d => d.ExpiredLicenceNumber, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licencenumber))
          .ForMember(d => d.SoleProprietorBizAppId, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetServiceTypeName(s._spd_servicetypeid_value) == ServiceTypeEnum.SecurityWorkerLicence.ToString() ? s._spd_businesslicenseid_value : null))
          .IncludeBase<spd_application, LicenceApplication>();

        _ = CreateMap<AliasResp, spd_alias>()
          .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
          .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.Surname))
          .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName1))
          .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.MiddleName2))
          .ForMember(d => d.spd_source, opt => opt.MapFrom(s => AliasSourceTypeOptionSet.UserEntered))
          .ReverseMap();
    }

    private static DateTimeOffset? GetDeclarationDate(LicenceApplication app)
    {
        return app.AgreeToCompleteAndAccurate != null && app.AgreeToCompleteAndAccurate == true ? DateTime.Now : null;
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

    private static MailingAddr? GetMailingAddressData(contact c)
    {
        MailingAddr mailingAddress = new();
        mailingAddress.AddressLine1 = c.address1_line1;
        mailingAddress.AddressLine2 = c.address1_line2;
        mailingAddress.City = c.address1_city;
        mailingAddress.Province = c.address1_stateorprovince;
        mailingAddress.Country = c.address1_country;
        mailingAddress.PostalCode = c.address1_postalcode;
        return mailingAddress;
    }

    private static Addr? GetEmployerAddressData(spd_application app)
    {
        Addr addr = new();
        addr.AddressLine1 = app.spd_employeraddress1;
        addr.AddressLine2 = app.spd_employeraddress2;
        addr.City = app.spd_employercity;
        addr.Province = app.spd_employerprovince;
        addr.Country = app.spd_employercountry;
        addr.PostalCode = app.spd_employerpostalcode;
        return addr;
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
    private static bool? IsMailingResidentialSame(contact c)
    {
        if (c.address1_line1 == null
            && c.address1_line2 == null
            && c.address1_city == null
            && c.address1_stateorprovince == null
            && c.address1_country == null
            && c.address1_postalcode == null
            && c.address2_line1 == null
            && c.address2_line2 == null
            && c.address2_city == null
            && c.address2_stateorprovince == null
            && c.address2_country == null
            && c.address2_postalcode == null)
            return null;
        return c.address1_line1 == c.address2_line1 &&
            c.address1_line2 == c.address2_line2 &&
            c.address1_city == c.address2_city &&
            c.address1_stateorprovince == c.address2_stateorprovince &&
            c.address1_country == c.address2_country &&
            c.address1_postalcode == c.address2_postalcode;
    }


  
}

