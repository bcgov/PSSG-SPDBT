using AutoMapper;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Address;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.ControllingMemberInvite;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.DogTeam;
using Spd.Resource.Repository.DogTrainerApp;
using Spd.Resource.Repository.GDSDApp;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.PortalUser;
using System.Collections.Immutable;
using System.Text.Json;

namespace Spd.Manager.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceAppUpsertRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)))
            .ForMember(d => d.MailingAddressData, opt => opt.MapFrom(s => s.MailingAddress))
            .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => s.ResidentialAddress))
            .ForMember(d => d.ContactEmailAddress, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.ContactPhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber));

        CreateMap<WorkerLicenceAppSubmitRequest, CreateLicenceApplicationCmd>()
            .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => GetIsTreatedForMHC(s)))
            .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => GetHasCriminalHistory(s)))
            .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)))
            .ForMember(d => d.MailingAddressData, opt => opt.MapFrom(s => s.MailingAddress))
            .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => s.ResidentialAddress))
            .ForMember(d => d.ContactEmailAddress, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.ContactPhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.OriginalApplicationId, opt => opt.MapFrom(s => s.LatestApplicationId));

        CreateMap<WorkerLicenceAppUpsertRequest, UpdateContactCmd>()
            .ConvertUsing(src => CreateUpdateContactCmd(src));

        CreateMap<PermitAppSubmitRequest, CreateLicenceApplicationCmd>()
            .ForMember(d => d.IsTreatedForMHC, opt => opt.Ignore())
            .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => GetHasCriminalHistory(s)))
            .ForMember(d => d.CategoryCodes, opt => opt.Ignore())
            .ForMember(d => d.PermitPurposeEnums, opt => opt.MapFrom(s => GetPermitPurposeEnums(s)))
            .ForMember(d => d.MailingAddressData, opt => opt.MapFrom(s => s.MailingAddress))
            .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => s.ResidentialAddress))
            .ForMember(d => d.ContactEmailAddress, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.ContactPhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber));

        CreateMap<PermitAppUpsertRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.MailingAddressData, opt => opt.MapFrom(s => s.MailingAddress))
            .ForMember(d => d.ResidentialAddressData, opt => opt.MapFrom(s => s.ResidentialAddress))
            .ForMember(d => d.ContactEmailAddress, opt => opt.MapFrom(s => s.EmailAddress))
            .ForMember(d => d.ContactPhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.PermitPurposeEnums, opt => opt.MapFrom(s => GetPurposeEnums(s.BodyArmourPermitReasonCodes, s.ArmouredVehiclePermitReasonCodes)));

        CreateMap<PermitAppUpsertRequest, UpdateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode));

        CreateMap<ApplicantLoginCommand, Contact>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.BcscIdentityInfo.FirstName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.BcscIdentityInfo.LastName))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.BcscIdentityInfo.MiddleName1))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.BcscIdentityInfo.MiddleName2))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.BcscIdentityInfo.Email))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.BcscIdentityInfo.BirthDate))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => GetGenderEnumFromStr(s.BcscIdentityInfo.Gender)))
            .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => GetAddressFromStr(s.BcscIdentityInfo.Address)));

        CreateMap<ApplicantLoginCommand, CreateContactCmd>()
            .IncludeBase<ApplicantLoginCommand, Contact>()
            .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.BcscIdentityInfo.DisplayName));

        CreateMap<ApplicantLoginCommand, UpdateContactCmd>()
            .IncludeBase<ApplicantLoginCommand, Contact>()
            .ForMember(d => d.EmailAddress, opt => opt.Ignore())
            .ForMember(d => d.Gender, opt => opt.Ignore());

        CreateMap<WorkerLicenceAppSubmitRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));

        CreateMap<WorkerLicenceAppSubmitRequest, UpdateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode))
            .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => s.IsTreatedForMHC.HasValue && s.IsTreatedForMHC.Value ? true : (bool?)null));

        CreateMap<PermitAppSubmitRequest, UpdateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode));

        CreateMap<ApplicantUpdateRequest, UpdateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode))
            .ForPath(d => d.ResidentialAddress.AddressLine1, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine1))
            .ForPath(d => d.ResidentialAddress.AddressLine2, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine2))
            .ForPath(d => d.ResidentialAddress.Province, opt => opt.MapFrom(s => s.ResidentialAddress.Province))
            .ForPath(d => d.ResidentialAddress.City, opt => opt.MapFrom(s => s.ResidentialAddress.City))
            .ForPath(d => d.ResidentialAddress.PostalCode, opt => opt.MapFrom(s => s.ResidentialAddress.PostalCode))
            .ForPath(d => d.ResidentialAddress.Country, opt => opt.MapFrom(s => s.ResidentialAddress.Country))
            .ForPath(d => d.MailingAddress.AddressLine1, opt => opt.MapFrom(s => s.MailingAddress.AddressLine1))
            .ForPath(d => d.MailingAddress.AddressLine2, opt => opt.MapFrom(s => s.MailingAddress.AddressLine2))
            .ForPath(d => d.MailingAddress.City, opt => opt.MapFrom(s => s.MailingAddress.City))
            .ForPath(d => d.MailingAddress.Province, opt => opt.MapFrom(s => s.MailingAddress.Province))
            .ForPath(d => d.MailingAddress.PostalCode, opt => opt.MapFrom(s => s.MailingAddress.PostalCode))
            .ForPath(d => d.MailingAddress.Country, opt => opt.MapFrom(s => s.MailingAddress.Country));

        CreateMap<ControllingMemberCrcAppBase, UpdateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode))
            .ForPath(d => d.ResidentialAddress.AddressLine1, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine1))
            .ForPath(d => d.ResidentialAddress.AddressLine2, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine2))
            .ForPath(d => d.ResidentialAddress.Province, opt => opt.MapFrom(s => s.ResidentialAddress.Province))
            .ForPath(d => d.ResidentialAddress.City, opt => opt.MapFrom(s => s.ResidentialAddress.City))
            .ForPath(d => d.ResidentialAddress.PostalCode, opt => opt.MapFrom(s => s.ResidentialAddress.PostalCode))
            .ForPath(d => d.ResidentialAddress.Country, opt => opt.MapFrom(s => s.ResidentialAddress.Country));

        CreateMap<ControllingMemberCrcAppBase, CreateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode))
            .ForPath(d => d.ResidentialAddress.AddressLine1, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine1))
            .ForPath(d => d.ResidentialAddress.AddressLine2, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine2))
            .ForPath(d => d.ResidentialAddress.Province, opt => opt.MapFrom(s => s.ResidentialAddress.Province))
            .ForPath(d => d.ResidentialAddress.City, opt => opt.MapFrom(s => s.ResidentialAddress.City))
            .ForPath(d => d.ResidentialAddress.PostalCode, opt => opt.MapFrom(s => s.ResidentialAddress.PostalCode))
            .ForPath(d => d.ResidentialAddress.Country, opt => opt.MapFrom(s => s.ResidentialAddress.Country));

        CreateMap<ControllingMemberCrcAppSubmitRequest, UpdateContactCmd>()
            .IncludeBase<ControllingMemberCrcAppBase, UpdateContactCmd>();

        CreateMap<ControllingMemberCrcAppSubmitRequest, CreateContactCmd>()
            .IncludeBase<ControllingMemberCrcAppBase, CreateContactCmd>();

        CreateMap<ControllingMemberCrcAppUpsertRequest, UpdateContactCmd>()
            .IncludeBase<ControllingMemberCrcAppBase, UpdateContactCmd>();

        CreateMap<ControllingMemberCrcAppUpdateRequest, UpdateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.CriminalChargeDescription, opt => opt.MapFrom(s => s.HasCriminalHistory == true ? s.CriminalHistoryDetail : string.Empty))
            .ForPath(d => d.ResidentialAddress.AddressLine1, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine1))
            .ForPath(d => d.ResidentialAddress.AddressLine2, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine2))
            .ForPath(d => d.ResidentialAddress.Province, opt => opt.MapFrom(s => s.ResidentialAddress.Province))
            .ForPath(d => d.ResidentialAddress.City, opt => opt.MapFrom(s => s.ResidentialAddress.City))
            .ForPath(d => d.ResidentialAddress.PostalCode, opt => opt.MapFrom(s => s.ResidentialAddress.PostalCode))
            .ForPath(d => d.ResidentialAddress.Country, opt => opt.MapFrom(s => s.ResidentialAddress.Country));

        CreateMap<BizLicenceApp, BizLicApplication>()
            .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => s.ServiceTypeCode))
            .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.ContactId, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.ContactId))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.LicenceId, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.LicenceId))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.BizContactId, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.BizContactId))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.GivenName, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.GivenName))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.Surname, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.Surname))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.EmailAddress, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.EmailAddress))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.MiddleName1, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.MiddleName1))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.MiddleName2, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.MiddleName2))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.PhoneNumber, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.PhoneNumber));

        CreateMap<BizLicAppSubmitRequest, CreateBizLicApplicationCmd>()
            .IncludeBase<BizLicenceApp, BizLicApplication>()
            .ForMember(d => d.OriginalApplicationId, opt => opt.MapFrom(s => s.LatestApplicationId));

        CreateMap<BizLicAppUpsertRequest, SaveBizLicApplicationCmd>()
            .IncludeBase<BizLicenceApp, BizLicApplication>()
            .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.BizId))
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.ApplicantContactInfo.GivenName != null ? s.ApplicantContactInfo.GivenName : string.Empty))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.ApplicantContactInfo.Surname != null ? s.ApplicantContactInfo.Surname : string.Empty))
            .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.ApplicantContactInfo.MiddleName1 != null ? s.ApplicantContactInfo.MiddleName1 : string.Empty))
            .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.ApplicantContactInfo.MiddleName2 != null ? s.ApplicantContactInfo.MiddleName2 : string.Empty))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.ApplicantContactInfo.EmailAddress != null ? s.ApplicantContactInfo.EmailAddress : string.Empty))
            .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.ApplicantContactInfo.PhoneNumber != null ? s.ApplicantContactInfo.PhoneNumber : string.Empty));

        CreateMap<BizLicAppSubmitRequest, SaveBizLicApplicationCmd>()
            .IncludeBase<BizLicenceApp, BizLicApplication>()
            .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.LatestApplicationId))
            .ForMember(d => d.ApplicantId, opt => opt.Ignore())
            .ForMember(d => d.ExpiredLicenceId, opt => opt.Ignore())
            .ForMember(d => d.ExpiredLicenceNumber, opt => opt.Ignore())
            .ForMember(d => d.HasExpiredLicence, opt => opt.Ignore());

        CreateMap<Contact, Applicant>()
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => s.BirthDate))
            .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => s.Gender));

        CreateMap<ContactResp, ApplicantProfileResponse>()
            .IncludeBase<Contact, Applicant>()
            .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.Id));

        CreateMap<ContactResp, ApplicantListResponse>()
            .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.LicenceNumber, opt => opt.MapFrom(s => s.LicenceInfos.FirstOrDefault().LicenceNumber))
            .ForMember(d => d.LicenceExpiryDate, opt => opt.MapFrom(s => s.LicenceInfos.FirstOrDefault().ExpiryDate));

        CreateMap<ContactResp, ApplicantLoginResponse>()
            .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.IsFirstTimeLogin, opt => opt.MapFrom(s => s.LicensingTermAgreedDateTime == null));

        CreateMap<LicenceApplicationCmdResp, WorkerLicenceCommandResponse>();

        CreateMap<LicenceApplicationCmdResp, PermitAppCommandResponse>();

        CreateMap<BizLicApplicationCmdResp, BizLicAppCommandResponse>();

        CreateMap<LicenceApplicationResp, WorkerLicenceAppResponse>()
             .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.ContactEmailAddress))
             .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
             .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => s.ResidentialAddressData))
             .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => s.MailingAddressData));

        CreateMap<LicenceResp, LicenceBasicResponse>()
             .ForMember(d => d.LicenceHolderName, opt => opt.MapFrom(s => GetHolderName(s.LicenceHolderFirstName, s.LicenceHolderMiddleName1, s.LicenceHolderLastName)));

        CreateMap<LicenceResp, LicenceResponse>()
            .IncludeBase<LicenceResp, LicenceBasicResponse>()
            .ForMember(d => d.BodyArmourPermitReasonCodes, opt => opt.MapFrom(s => GetBodyArmourPermitReasonCodes((ServiceTypeEnum)s.ServiceTypeCode, (List<PermitPurposeEnum>?)s.PermitPurposeEnums)))
            .ForMember(d => d.ArmouredVehiclePermitReasonCodes, opt => opt.MapFrom(s => GetArmouredVehiclePermitReasonCodes((ServiceTypeEnum)s.ServiceTypeCode, (List<PermitPurposeEnum>?)s.PermitPurposeEnums)));

        CreateMap<LicenceFeeResp, LicenceFeeResponse>();

        CreateMap<DocumentResp, LicenceAppDocumentResponse>()
             .ForMember(d => d.DocumentExtension, opt => opt.MapFrom(s => s.FileExtension))
             .ForMember(d => d.DocumentName, opt => opt.MapFrom(s => s.FileName))
             .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.ApplicationId));

        CreateMap<DocumentResp, Document>()
             .IncludeBase<DocumentResp, LicenceAppDocumentResponse>()
             .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.ExpiryDate))
             .ForMember(d => d.LicenceDocumentTypeCode, opt => opt.MapFrom(s => GetLicenceDocumentTypeCode(s.DocumentType, s.DocumentType2)));

        CreateMap<Address, Addr>()
            .ReverseMap();

        CreateMap<ResidentialAddress, ResidentialAddr>()
            .IncludeBase<Address, Addr>()
            .ReverseMap();

        CreateMap<MailingAddress, MailingAddr>()
            .IncludeBase<Address, Addr>()
            .ReverseMap();

        CreateMap<Spd.Utilities.BCeIDWS.Address, Addr>();

        CreateMap<Alias, AliasResp>()
            .ReverseMap();

        CreateMap<UploadFileRequest, CreateDocumentCmd>()
            .ForMember(d => d.DocumentType, opt => opt.MapFrom(s => GetDocumentType1Enum(s.FileTypeCode)))
            .ForMember(d => d.DocumentType2, opt => opt.MapFrom(s => GetDocumentType2Enum(s.FileTypeCode)));

        CreateMap<LicAppFileInfo, CreateDocumentCmd>()
            .ForMember(d => d.DocumentType, opt => opt.MapFrom(s => GetDocumentType1Enum(s.LicenceDocumentTypeCode)))
            .ForMember(d => d.DocumentType2, opt => opt.MapFrom(s => GetDocumentType2Enum(s.LicenceDocumentTypeCode)));

        CreateMap<LicenceAppListResp, LicenceAppListResponse>()
            .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => s.ServiceTypeCode));

        CreateMap<UploadFileRequest, SpdTempFile>()
            .ForMember(d => d.TempFilePath, opt => opt.MapFrom(s => s.FilePath));

        CreateMap<LicAppFileInfo, SpdTempFile>();

        CreateMap<LicenceApplicationResp, PermitLicenceAppResponse>()
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.ContactEmailAddress))
            .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
            .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => s.ResidentialAddressData))
            .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => s.MailingAddressData))
            .ForPath(d => d.EmployerPrimaryAddress.AddressLine1, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.AddressLine1))
            .ForPath(d => d.EmployerPrimaryAddress.AddressLine2, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.AddressLine2))
            .ForPath(d => d.EmployerPrimaryAddress.Province, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.Province))
            .ForPath(d => d.EmployerPrimaryAddress.City, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.City))
            .ForPath(d => d.EmployerPrimaryAddress.Country, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.Country))
            .ForPath(d => d.EmployerPrimaryAddress.PostalCode, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.PostalCode))
            .ForMember(d => d.BodyArmourPermitReasonCodes, opt => opt.MapFrom(s => GetBodyArmourPermitReasonCodes(s.ServiceTypeCode, (List<PermitPurposeEnum>?)s.PermitPurposeEnums)))
            .ForMember(d => d.ArmouredVehiclePermitReasonCodes, opt => opt.MapFrom(s => GetArmouredVehiclePermitReasonCodes(s.ServiceTypeCode, (List<PermitPurposeEnum>?)s.PermitPurposeEnums)));

        CreateMap<BizLicApplicationResp, BizLicAppResponse>()
            .ForPath(d => d.PrivateInvestigatorSwlInfo.ContactId, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.ContactId))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.BizContactId, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.BizContactId))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.LicenceId, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.LicenceId))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.GivenName, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.GivenName))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.Surname, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.Surname))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.MiddleName1, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.MiddleName1))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.MiddleName2, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.MiddleName2))
            .ForPath(d => d.PrivateInvestigatorSwlInfo.EmailAddress, opt => opt.MapFrom(s => s.PrivateInvestigatorSwlInfo.EmailAddress))
            .ForMember(d => d.ApplicantContactInfo, opt => opt.MapFrom(s => GetApplicantInfo(s)));

        CreateMap<PortalUserResp, BizUserLoginResponse>()
            .ForMember(d => d.BizUserId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.BizId, opt => opt.MapFrom(s => s.OrganizationId))
            .ForMember(d => d.IsFirstTimeLogin, opt => opt.MapFrom(s => s.IsFirstTimeLogin));

        CreateMap<BizResult, BizListResponse>()
            .ForMember(d => d.BizId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.ServiceTypeCodes, opt => opt.MapFrom(s => GetServiceTypeCodes(s.ServiceTypes)));

        CreateMap<BizResult, BizProfileResponse>()
            .ForMember(d => d.BizId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.BizLegalName, opt => opt.MapFrom(s => s.BizLegalName))
            .ForMember(d => d.BizTradeName, opt => opt.MapFrom(s => s.BizName))
            .ForMember(d => d.BizTypeCode, opt => opt.MapFrom(s => s.BizType))
            .ForMember(d => d.ServiceTypeCodes, opt => opt.MapFrom(s => GetServiceTypeCodes(s.ServiceTypes)))
            .ForMember(d => d.BizMailingAddress, opt => opt.MapFrom(s => s.MailingAddress))
            .ForMember(d => d.BizAddress, opt => opt.MapFrom(s => s.BusinessAddress))
            .ForMember(d => d.BizBCAddress, opt => opt.MapFrom(s => s.BCBusinessAddress))
            .ForMember(d => d.Branches, opt => opt.MapFrom(s => GetBranchInfo(s.BranchAddresses)))
            .ForMember(d => d.SoleProprietorSwlPhoneNumber, opt => opt.MapFrom(s =>
               (s.BizType == BizTypeEnum.NonRegisteredSoleProprietor || s.BizType == BizTypeEnum.RegisteredSoleProprietor)
               ? s.PhoneNumber : null))
            .ForMember(d => d.SoleProprietorSwlEmailAddress, opt => opt.MapFrom(s =>
            (s.BizType == BizTypeEnum.NonRegisteredSoleProprietor || s.BizType == BizTypeEnum.RegisteredSoleProprietor)
               ? s.Email : null))
            .ForPath(d => d.SoleProprietorSwlContactInfo, opt => opt.MapFrom(s =>
            (s.BizType == BizTypeEnum.NonRegisteredSoleProprietor || s.BizType == BizTypeEnum.RegisteredSoleProprietor)
                ? new SwlContactInfo { LicenceId = s.SoleProprietorSwlContactInfo.LicenceId } : null))

            .ForPath(d => d.BizManagerContactInfo.GivenName, opt => opt.MapFrom(s => s.BizManagerContactInfo.GivenName))
            .ForPath(d => d.BizManagerContactInfo.Surname, opt => opt.MapFrom(s => s.BizManagerContactInfo.Surname))
            .ForPath(d => d.BizManagerContactInfo.PhoneNumber, opt => opt.MapFrom(s => s.BizManagerContactInfo.PhoneNumber))
            .ForPath(d => d.BizManagerContactInfo.EmailAddress, opt => opt.MapFrom(s => s.BizManagerContactInfo.EmailAddress))
            .ForPath(d => d.BizManagerContactInfo.MiddleName1, opt => opt.MapFrom(s => s.BizManagerContactInfo.MiddleName1))
            .ForPath(d => d.BizManagerContactInfo.MiddleName2, opt => opt.MapFrom(s => s.BizManagerContactInfo.MiddleName2));

        CreateMap<PermitAppSubmitRequest, PermitLicence>()
          .ForMember(d => d.PermitPurposeEnums, opt => opt.MapFrom(s => GetPurposeEnums(s.BodyArmourPermitReasonCodes, s.ArmouredVehiclePermitReasonCodes)))
          .ForMember(d => d.LicenceNumber, opt => opt.Ignore())
          .ForMember(d => d.ExpiryDate, opt => opt.Ignore())
          .ForMember(d => d.ServiceTypeCode, opt => opt.Ignore())
          .ForMember(d => d.LicenceTermCode, opt => opt.Ignore())
          .ForMember(d => d.LicenceHolderId, opt => opt.Ignore())
          .ForMember(d => d.LicenceHolderFirstName, opt => opt.Ignore())
          .ForMember(d => d.LicenceHolderLastName, opt => opt.Ignore())
          .ForMember(d => d.LicenceHolderMiddleName1, opt => opt.Ignore())
          .ForMember(d => d.LicenceStatusCode, opt => opt.Ignore())
          .ForMember(d => d.NameOnCard, opt => opt.Ignore())
          .ForMember(d => d.PermitOtherRequiredReason, opt => opt.MapFrom(s => s.PermitOtherRequiredReason ?? string.Empty))
          .ForMember(d => d.EmployerName, opt => opt.MapFrom(s => s.EmployerName ?? string.Empty))
          .ForMember(d => d.SupervisorName, opt => opt.MapFrom(s => s.SupervisorName ?? string.Empty))
          .ForMember(d => d.SupervisorEmailAddress, opt => opt.MapFrom(s => s.SupervisorEmailAddress ?? string.Empty))
          .ForMember(d => d.SupervisorPhoneNumber, opt => opt.MapFrom(s => s.SupervisorPhoneNumber ?? string.Empty))
          .ForMember(d => d.Rationale, opt => opt.MapFrom(s => s.Rationale ?? string.Empty));

        CreateMap<BizProfileUpdateRequest, UpdateBizCmd>()
           .ForMember(d => d.BizGuid, opt => opt.Ignore())
           .ForMember(d => d.BizLegalName, opt => opt.Ignore())
           .ForMember(d => d.MailingAddress, opt => opt.Ignore())
           .ForMember(d => d.ServiceTypes, opt => opt.Ignore())
           .ForMember(d => d.BizName, opt => opt.MapFrom(s => s.BizTradeName))
           .ForMember(d => d.BizType, opt => opt.MapFrom(s => s.BizTypeCode))
           .ForMember(d => d.BusinessAddress, opt => opt.MapFrom(s => s.BizAddress))
           .ForMember(d => d.BCBusinessAddress, opt => opt.MapFrom(s => s.BizBCAddress))
           .ForMember(d => d.BranchAddresses, opt => opt.MapFrom(s => GetBranchAddr(s.Branches)))
           .ForMember(d => d.Email, opt => opt.MapFrom(s => IsSoleProprietor(s.BizTypeCode) == true ? s.SoleProprietorSwlEmailAddress : null))
           .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => IsSoleProprietor(s.BizTypeCode) == true ? s.SoleProprietorSwlPhoneNumber : null))
           .ForPath(d => d.BizManagerContactInfo.PhoneNumber, opt => opt.MapFrom(s => s.BizManagerContactInfo.PhoneNumber))
           .ForPath(d => d.BizManagerContactInfo.EmailAddress, opt => opt.MapFrom(s => s.BizManagerContactInfo.EmailAddress))
           .ForPath(d => d.BizManagerContactInfo.GivenName, opt => opt.MapFrom(s => s.BizManagerContactInfo.GivenName))
           .ForPath(d => d.BizManagerContactInfo.MiddleName1, opt => opt.MapFrom(s => s.BizManagerContactInfo.MiddleName1))
           .ForPath(d => d.BizManagerContactInfo.MiddleName2, opt => opt.MapFrom(s => s.BizManagerContactInfo.MiddleName2))
           .ForPath(d => d.BizManagerContactInfo.Surname, opt => opt.MapFrom(s => s.BizManagerContactInfo.Surname))
           .ForPath(d => d.SoleProprietorSwlContactInfo.LicenceId, opt => opt.MapFrom(s => s.SoleProprietorLicenceId));

        CreateMap<AddressResp, BranchAddr>()
            .ReverseMap();

        CreateMap<BizContactResp, NonSwlContactInfo>()
            .ForMember(d => d.ControllingMemberAppStatusCode, opt => opt.MapFrom(s => s.LatestControllingMemberCrcAppPortalStatusEnum))
            .ForMember(d => d.InviteStatusCode, opt => opt.MapFrom(s => s.LatestControllingMemberInvitationStatusEnum))
            .ReverseMap()
            .ForMember(d => d.BizContactRoleCode, opt => opt.MapFrom(s => BizContactRoleEnum.ControllingMember));

        CreateMap<UpsertBizMembersCommand, BizContactUpsertCmd>();

        CreateMap<SwlContactInfo, BizContactResp>()
            .ForMember(d => d.BizContactRoleCode, opt => opt.MapFrom(s => BizContactRoleEnum.ControllingMember))
            .ReverseMap();

        CreateMap<ControllingMemberCrcAppSubmitRequest, SaveControllingMemberCrcAppCmd>()
            .IncludeBase<ControllingMemberCrcAppBase, SaveControllingMemberCrcAppCmd>();

        CreateMap<ControllingMemberCrcAppUpsertRequest, SaveControllingMemberCrcAppCmd>()
            .ForMember(d => d.ContactId, opt => opt.MapFrom(s => s.ApplicantId))
            .IncludeBase<ControllingMemberCrcAppBase, SaveControllingMemberCrcAppCmd>();

        CreateMap<ControllingMemberCrcAppBase, SaveControllingMemberCrcAppCmd>()
            .ForPath(d => d.ResidentialAddressData.AddressLine1, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine1))
            .ForPath(d => d.ResidentialAddressData.AddressLine2, opt => opt.MapFrom(s => s.ResidentialAddress.AddressLine2))
            .ForPath(d => d.ResidentialAddressData.Province, opt => opt.MapFrom(s => s.ResidentialAddress.Province))
            .ForPath(d => d.ResidentialAddressData.City, opt => opt.MapFrom(s => s.ResidentialAddress.City))
            .ForPath(d => d.ResidentialAddressData.PostalCode, opt => opt.MapFrom(s => s.ResidentialAddress.PostalCode))
            .ForPath(d => d.ResidentialAddressData.Country, opt => opt.MapFrom(s => s.ResidentialAddress.Country));

        CreateMap<ControllingMemberCrcApplicationCmdResp, ControllingMemberCrcAppCommandResponse>();

        CreateMap<ControllingMemberInviteVerifyResp, ControllingMemberAppInviteVerifyResponse>();

        CreateMap<BizContactResp, ControllingMemberInvite>();

        CreateMap<BizContactResp, ControllingMemberInviteCreateCmd>()
            .IncludeBase<BizContactResp, ControllingMemberInvite>()
            .ForMember(d => d.HostUrl, opt => opt.Ignore());

        //this mapping is used for create shell app for no-email bizContact
        CreateMap<BizContactResp, SaveControllingMemberCrcAppCmd>()
            .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => ServiceTypeEnum.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC))
            .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => ApplicationTypeEnum.New))
            .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(_ => (ApplicationOriginTypeEnum?)null))
            .ForMember(d => d.AgreeToCompleteAndAccurate, opt => opt.MapFrom(s => false));

        CreateMap<BizContactResp, ControllingMemberAppInviteVerifyResponse>()
            .ForMember(d => d.InviteId, opt => opt.Ignore())
            .ForMember(d => d.BizContactId, opt => opt.Ignore())
            .ForMember(d => d.BizLicAppId, opt => opt.Ignore())
            .ForMember(d => d.ControllingMemberCrcAppId, opt => opt.MapFrom(s => s.LatestControllingMemberCrcAppId))
            .ForMember(d => d.ControllingMemberCrcAppPortalStatusCode, opt => opt.MapFrom(s => GetControllingMemberCrcAppPortalStatusCode(s.LatestControllingMemberCrcAppPortalStatusEnum)));

        CreateMap<SwlContactInfo, BizContact>();

        CreateMap<NonSwlContactInfo, BizContact>();

        CreateMap<ControllingMemberCrcApplicationResp, ControllingMemberCrcAppResponse>()
            .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => s.ResidentialAddressData))
            .ForPath(d => d.ResidentialAddress.AddressLine1, opt => opt.MapFrom(s => s.ResidentialAddressData.AddressLine1))
            .ForPath(d => d.ResidentialAddress.AddressLine2, opt => opt.MapFrom(s => s.ResidentialAddressData.AddressLine2))
            .ForPath(d => d.ResidentialAddress.Province, opt => opt.MapFrom(s => s.ResidentialAddressData.Province))
            .ForPath(d => d.ResidentialAddress.City, opt => opt.MapFrom(s => s.ResidentialAddressData.City))
            .ForPath(d => d.ResidentialAddress.Country, opt => opt.MapFrom(s => s.ResidentialAddressData.Country))
            .ForPath(d => d.ResidentialAddress.PostalCode, opt => opt.MapFrom(s => s.ResidentialAddressData.PostalCode));

        CreateMap<GDSDTeamLicenceAppAnonymousSubmitRequest, CreateGDSDAppCmd>();
        CreateMap<GDSDTeamLicenceAppChangeRequest, CreateGDSDAppCmd>();
        CreateMap<GDSDTeamLicenceAppUpsertRequest, SaveGDSDAppCmd>();
        CreateMap<GDSDAppCmdResp, GDSDTeamAppCommandResponse>();
        CreateMap<GDSDAppResp, GDSDTeamLicenceAppResponse>();
        CreateMap<AccreditedSchoolQuestions, Spd.Resource.Repository.GDSDApp.AccreditedSchoolQuestions>()
         .ReverseMap();
        CreateMap<NonAccreditedSchoolQuestions, Spd.Resource.Repository.GDSDApp.NonAccreditedSchoolQuestions>()
         .ForMember(d => d.IsDogSterilized, opt => opt.MapFrom(s => true))
         .ReverseMap();
        CreateMap<GraduationInfo, Spd.Resource.Repository.GDSDApp.GraduationInfo>()
            .ReverseMap();
        CreateMap<DogInfo, Spd.Resource.Repository.GDSDApp.DogInfo>()
            .ReverseMap();
        CreateMap<TrainingInfo, Spd.Resource.Repository.GDSDApp.TrainingInfo>()
            .ReverseMap();
        CreateMap<TrainingSchoolInfo, Spd.Resource.Repository.GDSDApp.TrainingSchoolInfo>()
            .ReverseMap();
        CreateMap<OtherTraining, Spd.Resource.Repository.GDSDApp.OtherTraining>()
            .ReverseMap();
        CreateMap<DogTeamResp, DogInfo>();
        CreateMap<DogTrainerRequest, CreateDogTrainerAppCmd>();
        CreateMap<DogTrainerChangeRequest, CreateDogTrainerAppCmd>();
        CreateMap<WorkerLicenceAppSubmitRequest, SecureWorkerLicenceAppCompareEntity>()
           .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
           .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
           .ForMember(d => d.UseDogs, opt => opt.MapFrom(s => s.UseDogs ?? false))
           .ForMember(d => d.IsDogsPurposeProtection, opt => opt.MapFrom(s => s.IsDogsPurposeProtection ?? false))
           .ForMember(d => d.IsDogsPurposeDetectionDrugs, opt => opt.MapFrom(s => s.IsDogsPurposeDetectionDrugs ?? false))
           .ForMember(d => d.IsDogsPurposeDetectionExplosives, opt => opt.MapFrom(s => s.IsDogsPurposeDetectionExplosives ?? false))
           .ForMember(d => d.CarryAndUseRestraints, opt => opt.MapFrom(s => s.CarryAndUseRestraints ?? false));
        CreateMap<LicenceResp, SecureWorkerLicenceAppCompareEntity>()
           .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.LicenceHolderFirstName))
           .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LicenceHolderLastName))
           .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.LicenceHolderMiddleName1));
        CreateMap<ContactResp, SecureWorkerLicenceAppCompareEntity>()
            .ForMember(d => d.GenderCode, opt => opt.MapFrom(s => s.Gender))
            .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => s.BirthDate))
            .ForMember(d => d.FirstName, opt => opt.Ignore())
            .ForMember(d => d.LastName, opt => opt.Ignore())
            .ForMember(d => d.MiddleName1, opt => opt.Ignore());
        CreateMap<PermitAppSubmitRequest, PermitCompareEntity>()
           .ForMember(d => d.PermitPurposeEnums, opt => opt.MapFrom(s => GetPermitPurposeEnums(s)));
        CreateMap<LicenceResp, PermitCompareEntity>();
        CreateMap<BizLicAppSubmitRequest, BizLicenceAppCompareEntity>();
        CreateMap<LicenceResp, BizLicenceAppCompareEntity>();
        CreateMap<DogTrainerAppResp, DogTrainerAppResponse>();
    }

    private static WorkerCategoryTypeEnum[] GetCategories(IEnumerable<WorkerCategoryTypeCode> codes)
    {
        List<WorkerCategoryTypeEnum> categories = new() { };
        foreach (WorkerCategoryTypeCode code in codes)
        {
            categories.Add(Enum.Parse<WorkerCategoryTypeEnum>(code.ToString()));
        }
        return categories.ToArray();
    }

    internal static DocumentTypeEnum GetDocumentType2Enum(LicenceDocumentTypeCode licenceDocumentTypeCode)
    {
        var keyExisted = LicenceDocumentType2Dictionary.TryGetValue(licenceDocumentTypeCode, out DocumentTypeEnum docTypeEnum);
        if (!keyExisted)
        {
            throw new ArgumentException("Invalid licenceDocumentTypeCode");
        }
        return docTypeEnum;
    }

    internal static DocumentTypeEnum GetDocumentType1Enum(LicenceDocumentTypeCode licenceDocumentTypeCode)
    {
        var keyExisted = LicenceDocumentType1Dictionary.TryGetValue(licenceDocumentTypeCode, out DocumentTypeEnum docTypeEnum);
        if (!keyExisted)
        {
            throw new ArgumentException("Invalid licenceDocumentTypeCode");
        }
        return docTypeEnum;
    }

    internal static LicenceDocumentTypeCode? GetLicenceDocumentTypeCode(DocumentTypeEnum? documentType1, DocumentTypeEnum? documentType2)
    {
        if (documentType1 == null) return null;
        var keys = LicenceDocumentType1Dictionary.Where(d => d.Value == (DocumentTypeEnum)documentType1).Select(z => z.Key).ToList();
        if (keys.Count == 0) return null;
        if (keys.Count == 1) return keys[0];
        foreach (LicenceDocumentTypeCode code in keys)
        {
            if (LicenceDocumentType2Dictionary[code] == documentType2) return code;
        }
        return null;
    }

    private ResidentialAddr? GetAddressFromStr(string? jsonStr)
    {
        if (jsonStr == null) return null;
        try
        {
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            var result = JsonSerializer.Deserialize<BcscAddress>(jsonStr, serializeOptions);
            return new ResidentialAddr()
            {
                AddressLine1 = result?.Street_address,
                City = result.Locality,
                Country = result.Country,
                PostalCode = result.Postal_code,
                Province = result.Region,
            };
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    private static GenderEnum? GetGenderEnumFromStr(string? genderStr)
    {
        return genderStr switch
        {
            "female" => GenderEnum.F,
            "male" => GenderEnum.M,
            "diverse" => GenderEnum.U,
            _ => null,
        };
    }
    private static bool? GetIsTreatedForMHC(WorkerLicenceAppBase request)
    {
        return request.IsTreatedForMHC;
    }

    private static bool? GetHasCriminalHistory(PersonalLicenceAppBase request)
    {
        if (request.ApplicationTypeCode == Shared.ApplicationTypeCode.Renewal || request.ApplicationTypeCode == Shared.ApplicationTypeCode.Update)
        {
            return request.HasCriminalHistory;
        }
        return request.HasCriminalHistory;
    }

    private static IEnumerable<PermitPurposeEnum>? GetPermitPurposeEnums(PermitAppSubmitRequest request)
    {
        if (request.BodyArmourPermitReasonCodes != null && request.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit)
        {
            return request.BodyArmourPermitReasonCodes.Select(c => Enum.Parse<PermitPurposeEnum>(c.ToString())).ToArray();
        }
        if (request.ArmouredVehiclePermitReasonCodes != null && request.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit)
        {
            return request.ArmouredVehiclePermitReasonCodes.Select(c => Enum.Parse<PermitPurposeEnum>(c.ToString())).ToArray();
        }
        return null;
    }

    public static List<BodyArmourPermitReasonCode> GetBodyArmourPermitReasonCodes(ServiceTypeEnum serviceType, List<PermitPurposeEnum>? permitPurposes)
    {
        List<BodyArmourPermitReasonCode> bodyArmourPermitReasonCodes = [];

        if (serviceType != ServiceTypeEnum.BodyArmourPermit || permitPurposes == null) return bodyArmourPermitReasonCodes;

        foreach (PermitPurposeEnum permitPurpose in permitPurposes)
        {
            BodyArmourPermitReasonCode bodyArmourPermitReasonCode;

            if (Enum.TryParse(permitPurpose.ToString(), out bodyArmourPermitReasonCode))
                bodyArmourPermitReasonCodes.Add(bodyArmourPermitReasonCode);
        }

        return bodyArmourPermitReasonCodes;
    }

    public static List<ArmouredVehiclePermitReasonCode> GetArmouredVehiclePermitReasonCodes(ServiceTypeEnum serviceType, List<PermitPurposeEnum>? permitPurposes)
    {
        List<ArmouredVehiclePermitReasonCode> armouredVehiclePermitReasonCodes = [];

        if (serviceType != ServiceTypeEnum.ArmouredVehiclePermit || permitPurposes == null) return armouredVehiclePermitReasonCodes;

        foreach (PermitPurposeEnum permitPurpose in permitPurposes)
        {
            ArmouredVehiclePermitReasonCode armouredVehiclePermitReasonCode;

            if (Enum.TryParse(permitPurpose.ToString(), out armouredVehiclePermitReasonCode))
                armouredVehiclePermitReasonCodes.Add(armouredVehiclePermitReasonCode);
        }

        return armouredVehiclePermitReasonCodes;
    }

    private static List<PermitPurposeEnum> GetPurposeEnums(IEnumerable<BodyArmourPermitReasonCode> bodyArmourPermitReasonCodes, IEnumerable<ArmouredVehiclePermitReasonCode> ArmouredVehiclePermitReasonCodes)
    {
        List<PermitPurposeEnum> permitPurposes = new();

        foreach (var bodyArmourPermitReasonCode in bodyArmourPermitReasonCodes)
        {
            var permitPurpose = Enum.Parse<PermitPurposeEnum>(bodyArmourPermitReasonCode.ToString());
            permitPurposes.Add(permitPurpose);
        }

        foreach (var armouredVehiclePermitReasonCode in ArmouredVehiclePermitReasonCodes)
        {
            var permitPurpose = Enum.Parse<PermitPurposeEnum>(armouredVehiclePermitReasonCode.ToString());
            permitPurposes.Add(permitPurpose);
        }

        return permitPurposes;
    }

    private static List<ServiceTypeCode> GetServiceTypeCodes(IEnumerable<ServiceTypeEnum> serviceTypes)
    {
        List<ServiceTypeCode> serviceTypeCodes = new();

        foreach (ServiceTypeEnum serviceType in serviceTypes)
        {
            var serviceTypeCode = Enum.Parse<ServiceTypeCode>(serviceType.ToString());
            serviceTypeCodes.Add(serviceTypeCode);
        }

        return serviceTypeCodes;
    }

    private static List<BranchInfo> GetBranchInfo(IEnumerable<BranchAddr> branchAddrs)
    {
        List<BranchInfo> branchInfos = new();

        foreach (BranchAddr branchAddr in branchAddrs)
        {
            BranchInfo branchInfo = new() { BranchAddress = new() };
            branchInfo.BranchId = branchAddr.BranchId;
            branchInfo.BranchManager = branchAddr.BranchManager;
            branchInfo.BranchPhoneNumber = branchAddr.BranchPhoneNumber;
            branchInfo.BranchEmailAddr = branchAddr.BranchEmailAddr;
            branchInfo.BranchAddress.AddressLine1 = branchAddr.AddressLine1;
            branchInfo.BranchAddress.AddressLine2 = branchAddr.AddressLine2;
            branchInfo.BranchAddress.City = branchAddr.City;
            branchInfo.BranchAddress.Country = branchAddr.Country;
            branchInfo.BranchAddress.PostalCode = branchAddr.PostalCode;
            branchInfo.BranchAddress.Province = branchAddr.Province;
            branchInfos.Add(branchInfo);
        }

        return branchInfos;
    }

    private static List<BranchAddr> GetBranchAddr(IEnumerable<BranchInfo> branchInfos)
    {
        List<BranchAddr> branchAddrs = new();

        foreach (BranchInfo branchInfo in branchInfos)
        {
            BranchAddr branchAddr = new();
            branchAddr.BranchId = branchInfo.BranchId;
            branchAddr.BranchManager = branchInfo.BranchManager;
            branchAddr.BranchPhoneNumber = branchInfo.BranchPhoneNumber;
            branchAddr.BranchEmailAddr = branchInfo.BranchEmailAddr;
            branchAddr.AddressLine1 = branchInfo.BranchAddress.AddressLine1;
            branchAddr.AddressLine2 = branchInfo.BranchAddress.AddressLine2;
            branchAddr.City = branchInfo.BranchAddress.City;
            branchAddr.Country = branchInfo.BranchAddress.Country;
            branchAddr.PostalCode = branchInfo.BranchAddress.PostalCode;
            branchAddr.Province = branchInfo.BranchAddress.Province;
            branchAddrs.Add(branchAddr);
        }

        return branchAddrs;
    }

    private static readonly ImmutableDictionary<LicenceDocumentTypeCode, DocumentTypeEnum> LicenceDocumentType1Dictionary = new Dictionary<LicenceDocumentTypeCode, DocumentTypeEnum>()
    {
        {LicenceDocumentTypeCode.BcServicesCard, DocumentTypeEnum.BCServicesCard},
        {LicenceDocumentTypeCode.BirthCertificate, DocumentTypeEnum.BirthCertificate},
        {LicenceDocumentTypeCode.CanadianCitizenship, DocumentTypeEnum.CanadianCitizenship},
        {LicenceDocumentTypeCode.CanadianFirearmsLicence, DocumentTypeEnum.CanadianFirearmsLicence},
        {LicenceDocumentTypeCode.CanadianPassport, DocumentTypeEnum.Passport},
        {LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate, DocumentTypeEnum.AuthorizationToCarryCertificate},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_CourseCertificate, DocumentTypeEnum.CourseCertificate},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_VerificationLetter, DocumentTypeEnum.VerificationLetter},
        {LicenceDocumentTypeCode.CategoryLocksmith_CertificateOfQualification, DocumentTypeEnum.CertificateOfQualification},
        {LicenceDocumentTypeCode.CategoryLocksmith_ExperienceAndApprenticeship, DocumentTypeEnum.ExperienceAndApprenticeship},
        {LicenceDocumentTypeCode.CategoryLocksmith_ApprovedLocksmithCourse, DocumentTypeEnum.ApprovedLocksmithCourse},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_ExperienceAndCourses, DocumentTypeEnum.ExperienceAndCourses},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining, DocumentTypeEnum.TenYearsPoliceExperienceAndTraining},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_KnowledgeAndExperience, DocumentTypeEnum.KnowledgeAndExperience},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingRecognizedCourse, DocumentTypeEnum.TrainingRecognizedCourse},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge, DocumentTypeEnum.TrainingOtherCoursesOrKnowledge},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion, DocumentTypeEnum.PrivateSecurityTrainingNetworkCompletion},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion, DocumentTypeEnum.OtherCourseCompletion},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_TradesQualificationCertificate, DocumentTypeEnum.TradesQualificationCertificate},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent, DocumentTypeEnum.ExperienceOrTrainingEquivalent},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_ExperienceLetters, DocumentTypeEnum.ExperienceLetters},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_RecommendationLetters, DocumentTypeEnum.RecommendationLetters},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_Resume, DocumentTypeEnum.Resume},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCertificate, DocumentTypeEnum.BasicSecurityTrainingCertificate},
        {LicenceDocumentTypeCode.CategorySecurityGuard_PoliceExperienceOrTraining, DocumentTypeEnum.PoliceExperienceOrTraining},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent, DocumentTypeEnum.BasicSecurityTrainingCourseEquivalent},
        {LicenceDocumentTypeCode.CategorySecurityGuard_DogCertificate, DocumentTypeEnum.DogCertificate},
        {LicenceDocumentTypeCode.CategorySecurityGuard_ASTCertificate, DocumentTypeEnum.ASTCertificate},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetter, DocumentTypeEnum.UseForceEmployerLetter},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetterASTEquivalent, DocumentTypeEnum.UseForceEmployerLetterASTEquivalent},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.ConfirmationOfPermanentResidenceDocument},
        {LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.LegalWorkStatus },
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.DriverLicense},
        {LicenceDocumentTypeCode.DriversLicenceAdditional, DocumentTypeEnum.DriverLicense},
        {LicenceDocumentTypeCode.GovernmentIssuedPhotoId, DocumentTypeEnum.GovtIssuedPhotoID},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthConditionForm},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.PermanentResidenceCard},
        {LicenceDocumentTypeCode.PermanentResidentCardAdditional, DocumentTypeEnum.PermanentResidenceCard},
        {LicenceDocumentTypeCode.PhotoOfYourself, DocumentTypeEnum.Photograph},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.LetterOfNoConflict},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.ConfirmationOfFingerprints},
        {LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.RecordOfLandingDocument},
        {LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.WorkPermit},
        {LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.StudyPermit},
        {LicenceDocumentTypeCode.LegalNameChange, DocumentTypeEnum.LegalNameChange},
        {LicenceDocumentTypeCode.NonCanadianPassport, DocumentTypeEnum.NonCanadianPassport},
        {LicenceDocumentTypeCode.BCID, DocumentTypeEnum.BCID},
        {LicenceDocumentTypeCode.ArmouredVehicleRationale, DocumentTypeEnum.ArmouredVehicleRationale},
        {LicenceDocumentTypeCode.BodyArmourRationale, DocumentTypeEnum.BodyArmourRationale},
        {LicenceDocumentTypeCode.PassportAdditional, DocumentTypeEnum.Passport},
        {LicenceDocumentTypeCode.BizBranding, DocumentTypeEnum.CompanyBranding },
        {LicenceDocumentTypeCode.BizInsurance, DocumentTypeEnum.BusinessInsurance },
        {LicenceDocumentTypeCode.ArmourCarGuardRegistrar, DocumentTypeEnum.ArmouredCarGuard },
        {LicenceDocumentTypeCode.BizSecurityDogCertificate, DocumentTypeEnum.DogCertificate },
        {LicenceDocumentTypeCode.BizBCReport, DocumentTypeEnum.CorporateSummary },
        {LicenceDocumentTypeCode.CorporateRegistryDocument, DocumentTypeEnum.CorporateRegistryDocument },
        {LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool, DocumentTypeEnum.IdCardIssuedByAccreditedDogTrainingSchool },
        {LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog, DocumentTypeEnum.MedicalFormConfirmingNeedDog },
        {LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog, DocumentTypeEnum.VeterinarianConfirmationForSpayedNeuteredDog },
        {LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument, DocumentTypeEnum.DogTrainingCurriculumCertificateSupportingDocument },
        {LicenceDocumentTypeCode.GDSDPracticeHoursLog, DocumentTypeEnum.GDSDPracticeHoursLog }
    }.ToImmutableDictionary();

    private static readonly ImmutableDictionary<LicenceDocumentTypeCode, DocumentTypeEnum> LicenceDocumentType2Dictionary = new Dictionary<LicenceDocumentTypeCode, DocumentTypeEnum>()
    {
        {LicenceDocumentTypeCode.BcServicesCard, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.BirthCertificate, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.CanadianCitizenship, DocumentTypeEnum.CanadianCitizenship},
        {LicenceDocumentTypeCode.CanadianFirearmsLicence, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.CanadianPassport, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate, DocumentTypeEnum.ArmouredCarGuard},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_CourseCertificate, DocumentTypeEnum.FireInvestigator},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_VerificationLetter, DocumentTypeEnum.FireInvestigator},
        {LicenceDocumentTypeCode.CategoryLocksmith_CertificateOfQualification, DocumentTypeEnum.Locksmith},
        {LicenceDocumentTypeCode.CategoryLocksmith_ExperienceAndApprenticeship, DocumentTypeEnum.Locksmith},
        {LicenceDocumentTypeCode.CategoryLocksmith_ApprovedLocksmithCourse, DocumentTypeEnum.Locksmith},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_ExperienceAndCourses, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_KnowledgeAndExperience, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingRecognizedCourse, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion, DocumentTypeEnum.PrivateInvestigatorUnderSupervision},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion, DocumentTypeEnum.PrivateInvestigatorUnderSupervision},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_TradesQualificationCertificate, DocumentTypeEnum.SecurityAlarmInstaller},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent, DocumentTypeEnum.SecurityAlarmInstaller},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_ExperienceLetters, DocumentTypeEnum.SecurityConsultant},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_RecommendationLetters, DocumentTypeEnum.SecurityConsultant},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_Resume, DocumentTypeEnum.SecurityConsultant},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCertificate, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_PoliceExperienceOrTraining, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_DogCertificate, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_ASTCertificate, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetter, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetterASTEquivalent, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.CitizenshipDocument },
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.DriversLicenceAdditional, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.GovernmentIssuedPhotoId, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthDocument},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.PermanentResidentCardAdditional, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.PhotoOfYourself, DocumentTypeEnum.IdPhotoDocument},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.PoliceOfficerDocument},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.FingerprintProofDocument},
        {LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.LegalNameChange, DocumentTypeEnum.LegalNameChange},
        {LicenceDocumentTypeCode.NonCanadianPassport, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.PassportAdditional, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.BCID, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.ArmouredVehicleRationale, DocumentTypeEnum.ArmouredVehicleRationale},
        {LicenceDocumentTypeCode.BodyArmourRationale, DocumentTypeEnum.BodyArmourRationale},
        {LicenceDocumentTypeCode.BizBranding, DocumentTypeEnum.CompanyBranding },
        {LicenceDocumentTypeCode.BizInsurance, DocumentTypeEnum.BusinessInsurance },
        {LicenceDocumentTypeCode.ArmourCarGuardRegistrar, DocumentTypeEnum.ArmouredCarGuard },
        {LicenceDocumentTypeCode.BizSecurityDogCertificate, DocumentTypeEnum.DogCertificate },
        {LicenceDocumentTypeCode.BizBCReport, DocumentTypeEnum.CorporateSummary },
        {LicenceDocumentTypeCode.CorporateRegistryDocument, DocumentTypeEnum.CorporateRegistryDocument },
        {LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool, DocumentTypeEnum.IdCardIssuedByAccreditedDogTrainingSchool },
        {LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog, DocumentTypeEnum.MedicalFormConfirmingNeedDog },
        {LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog, DocumentTypeEnum.VeterinarianConfirmationForSpayedNeuteredDog },
        {LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument, DocumentTypeEnum.DogTrainingCurriculumCertificateSupportingDocument },
        {LicenceDocumentTypeCode.GDSDPracticeHoursLog, DocumentTypeEnum.GDSDPracticeHoursLog }
    }.ToImmutableDictionary();

    private string GetHolderName(string firstName, string middleName, string lastName)
    {
        string fn = firstName == null ? string.Empty : firstName.Trim();
        string mn = middleName == null ? string.Empty : middleName.Trim();
        string ln = lastName == null ? string.Empty : lastName.Trim();
        return ($"{fn} {mn}".Trim() + " " + ln).Trim();
    }

    private ContactInfo? GetApplicantInfo(BizLicApplicationResp bizLicApplicationResp)
    {
        return new ContactInfo()
        {
            GivenName = bizLicApplicationResp.GivenName,
            Surname = bizLicApplicationResp.Surname,
            PhoneNumber = bizLicApplicationResp.PhoneNumber,
            EmailAddress = bizLicApplicationResp.EmailAddress,
            MiddleName1 = bizLicApplicationResp.MiddleName1,
            MiddleName2 = bizLicApplicationResp.MiddleName2
        };
    }

    private static bool IsSoleProprietor(BizTypeCode? bizType)
    {
        if (bizType == null) return false;
        if (bizType == BizTypeCode.NonRegisteredSoleProprietor || bizType == BizTypeCode.RegisteredSoleProprietor)
            return true;

        return false;
    }

    private static ApplicationPortalStatusCode? GetControllingMemberCrcAppPortalStatusCode(ApplicationPortalStatusEnum? status)
    {
        if (status == null) return null;
        else return Enum.Parse<ApplicationPortalStatusCode>(status.Value.ToString());
    }

    private static UpdateContactCmd CreateUpdateContactCmd(WorkerLicenceAppUpsertRequest src)
    {
        return new UpdateContactCmd()
        {
            FirstName = src.GivenName,
            LastName = src.Surname,
            MiddleName1 = src.MiddleName1,
            MiddleName2 = src.MiddleName2,
            Gender = src.GenderCode.HasValue ? Enum.Parse<GenderEnum>(src.GenderCode.ToString()) : null,
            BirthDate = src.DateOfBirth.HasValue ? src.DateOfBirth.Value : new DateOnly(1800, 1, 1),
            IsPoliceOrPeaceOfficer = src.IsPoliceOrPeaceOfficer,
            PoliceOfficerRoleCode = src.PoliceOfficerRoleCode.HasValue ? Enum.Parse<PoliceOfficerRoleEnum>(src.PoliceOfficerRoleCode.ToString()) : null,
            OtherOfficerRole = src.OtherOfficerRole,
            IsTreatedForMHC = (src.IsTreatedForMHC.HasValue && src.IsTreatedForMHC.Value) ? true : null,
            HasCriminalHistory = src.HasCriminalHistory, //(src.HasCriminalHistory.HasValue && src.HasCriminalHistory.Value) ? true : null,
            CriminalChargeDescription = src.CriminalChargeDescription
        };
    }
}

internal class BcscAddress
{
    public string? Street_address { get; set; }
    public string? Country { get; set; }
    public string? Locality { get; set; } //city
    public string? Postal_code { get; set; }
    public string? Region { get; set; } //province
}
