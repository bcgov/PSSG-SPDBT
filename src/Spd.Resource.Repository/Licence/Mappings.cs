using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Licence
{
    internal class Mappings : Profile
    {
        private static List<ServiceTypeEnum> OrgServiceTypes = new List<ServiceTypeEnum> { ServiceTypeEnum.MDRA, ServiceTypeEnum.SecurityBusinessLicence };
        public Mappings()
        {

            _ = CreateMap<spd_licence, LicenceResp>()
             .ForMember(d => d.LicenceId, opt => opt.MapFrom(s => s.spd_licenceid))
             .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_CaseId == null ? null : s.spd_CaseId._spd_applicationid_value))
             .ForMember(d => d.LicenceHolderId, opt => opt.MapFrom(s => GetLicenceHolderId(s)))
             .ForMember(d => d.LicenceNumber, opt => opt.MapFrom(s => s.spd_licencenumber))
             .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_expirydate)))
             .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_licencetype_value)))
             .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
             .ForMember(d => d.BizLegalName, opt => opt.MapFrom(s => GetBizLegalName(s)))
             .ForMember(d => d.LicenceHolderDateOfBirth, opt => opt.MapFrom(s => OrgServiceTypes.Contains(SharedMappingFuncs.GetServiceType(s._spd_licencetype_value).Value) ? null : s.spd_LicenceHolder_contact.birthdate))
             .ForMember(d => d.LicenceHolderFirstName, opt => opt.MapFrom(s => OrgServiceTypes.Contains(SharedMappingFuncs.GetServiceType(s._spd_licencetype_value).Value) ? s.spd_LicenceHolder_account.name : s.spd_LicenceHolder_contact.firstname))
             .ForMember(d => d.LicenceStatusCode, opt => opt.MapFrom(s => GetLicenceStatusEnum(s.statuscode)))
             .ForMember(d => d.LicenceHolderLastName, opt => opt.MapFrom(s => OrgServiceTypes.Contains(SharedMappingFuncs.GetServiceType(s._spd_licencetype_value).Value) ? null : s.spd_LicenceHolder_contact.lastname))
             .ForMember(d => d.LicenceHolderMiddleName1, opt => opt.MapFrom(s => OrgServiceTypes.Contains(SharedMappingFuncs.GetServiceType(s._spd_licencetype_value).Value) ? null : s.spd_LicenceHolder_contact.spd_middlename1))
             .ForMember(d => d.NameOnCard, opt => opt.MapFrom(s => s.spd_nameonlicence))
             .ForMember(d => d.CreatedOn, opt => opt.MapFrom(s => s.createdon))
             .ForMember(d => d.PermitOtherRequiredReason, opt => opt.MapFrom(s => s.spd_permitpurposeother))
             .ForMember(d => d.EmployerName, opt => opt.MapFrom(s => s.spd_employername))
             .ForMember(d => d.SupervisorName, opt => opt.MapFrom(s => s.spd_employercontactname))
             .ForMember(d => d.SupervisorEmailAddress, opt => opt.MapFrom(s => s.spd_employeremail))
             .ForMember(d => d.SupervisorPhoneNumber, opt => opt.MapFrom(s => s.spd_employerphonenumber))
             .ForMember(d => d.EmployerPrimaryAddress, opt => opt.MapFrom(s => s))
             .ForMember(d => d.Rationale, opt => opt.MapFrom(s => s.spd_rationale))
             .ForMember(d => d.PhotoDocumentUrlId, opt => opt.MapFrom(s => s._spd_photographid_value))
             .ForMember(d => d.PrintingPreviewJobId, opt => opt.MapFrom(s => s.spd_bcmpjobid))
             .ForMember(d => d.IsTemporary, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_temporarylicence)))//
             .ForMember(d => d.PermitPurposeEnums, opt => opt.MapFrom(s => SharedMappingFuncs.GetPermitPurposeEnums(s.spd_permitpurpose)))
             .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategoryCodes(s.spd_spd_licence_spd_caselicencecategory_licenceid.ToList())))
             .ForMember(d => d.BizTypeCode, opt => opt.MapFrom(s => GetBizType(s)))
             .ForMember(d => d.IssuedDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_issuedate)))
             .ForMember(d => d.SoleProprietorOrgId, opt => opt.MapFrom(s => s._spd_soleproprietorid_value))
             .ForMember(d => d.IsDogsPurposeProtection, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.Protection)))
             .ForMember(d => d.IsDogsPurposeDetectionDrugs, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionDrugs)))
             .ForMember(d => d.IsDogsPurposeDetectionExplosives, opt => opt.MapFrom(s => SharedMappingFuncs.GetDogReasonFlag(s.spd_requestdogsreasons, RequestDogPurposeOptionSet.DetectionExplosives)))
             .ForMember(d => d.CarryAndUseRestraints, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestrestraints)))
             .ForMember(d => d.UseDogs, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_requestdogs)))
             .ForMember(d => d.Conditions, opt => opt.MapFrom(s => s.spd_spd_licence_spd_licencecondition))
             .ForMember(d => d.GDSDTeamId, opt => opt.MapFrom(s => s.spd_licence_spd_dogteam_LicenceId.FirstOrDefault() == null ? null : s.spd_licence_spd_dogteam_LicenceId.FirstOrDefault().spd_dogteamid))
             .ForMember(d => d.IsDogAssessor, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_outd)))
             ;

            _ = CreateMap<spd_licence, LicenceBasicResp>()
               .ForMember(d => d.LicenceId, opt => opt.MapFrom(s => s.spd_licenceid))
               .ForMember(d => d.PrintingPreviewJobId, opt => opt.MapFrom(s => s.spd_bcmpjobid));

            _ = CreateMap<spd_licencecondition, Condition>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_licenceconditionid))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.spd_conditionname));

            _ = CreateMap<spd_licence, Addr>()
             .ForMember(d => d.AddressLine1, opt => opt.MapFrom(s => s.spd_employeraddress1))
             .ForMember(d => d.AddressLine2, opt => opt.MapFrom(s => s.spd_employeraddress2))
             .ForMember(d => d.City, opt => opt.MapFrom(s => s.spd_employercity))
             .ForMember(d => d.Province, opt => opt.MapFrom(s => s.spd_employerprovince))
             .ForMember(d => d.Country, opt => opt.MapFrom(s => s.spd_employercountry))
             .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.spd_employerpostalcode))
             .ReverseMap();

            _ = CreateMap<PermitLicence, spd_licence>()
             .ForMember(d => d.spd_expirydate, opt => opt.Ignore())
             .ForMember(d => d.statuscode, opt => opt.Ignore())
             .ForMember(d => d.spd_permitpurposeother, opt => opt.MapFrom(s => s.PermitOtherRequiredReason))
             .ForMember(d => d.spd_employername, opt => opt.MapFrom(s => s.EmployerName))
             .ForMember(d => d.spd_employercontactname, opt => opt.MapFrom(s => s.SupervisorName))
             .ForMember(d => d.spd_employeremail, opt => opt.MapFrom(s => s.SupervisorEmailAddress))
             .ForMember(d => d.spd_employerphonenumber, opt => opt.MapFrom(s => s.SupervisorPhoneNumber))
             .ForMember(d => d.spd_employeraddress1, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null || s.EmployerPrimaryAddress.AddressLine1 == null ? string.Empty : s.EmployerPrimaryAddress.AddressLine1))
             .ForMember(d => d.spd_employeraddress2, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null || s.EmployerPrimaryAddress.AddressLine2 == null ? string.Empty : s.EmployerPrimaryAddress.AddressLine2))
             .ForMember(d => d.spd_employercity, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null || s.EmployerPrimaryAddress.City == null ? string.Empty : s.EmployerPrimaryAddress.City))
             .ForMember(d => d.spd_employerprovince, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null || s.EmployerPrimaryAddress.Province == null ? string.Empty : s.EmployerPrimaryAddress.Province))
             .ForMember(d => d.spd_employercountry, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null || s.EmployerPrimaryAddress.Country == null ? string.Empty : s.EmployerPrimaryAddress.Country))
             .ForMember(d => d.spd_employerpostalcode, opt => opt.MapFrom(s => s.EmployerPrimaryAddress == null || s.EmployerPrimaryAddress.PostalCode == null ? string.Empty : s.EmployerPrimaryAddress.PostalCode))
             .ForMember(d => d.spd_rationale, opt => opt.MapFrom(s => s.Rationale))
             .ForMember(d => d.spd_permitpurpose, opt => opt.MapFrom(s => SharedMappingFuncs.GetPermitPurposeOptionSets(s.PermitPurposeEnums)));
        }

        internal static LicenceStatusEnum? GetLicenceStatusEnum(int? optionset)
        {
            if (optionset == null) return null;
            return Enum.Parse<LicenceStatusEnum>(Enum.GetName(typeof(LicenceStatusOptionSet), optionset));
        }

        internal static IEnumerable<WorkerCategoryTypeEnum> GetCategoryCodes(List<spd_caselicencecategory> categories)
        {
            return categories
                .Where(c => c.spd_accepted == (int)YesNoOptionSet.Yes && c.statecode == DynamicsConstants.StateCode_Active)
                .Select(c => Enum.Parse<WorkerCategoryTypeEnum>(DynamicsContextLookupHelpers.LookupLicenceCategoryKey(c._spd_licencecategoryid_value)));
        }

        internal static BizTypeEnum GetBizType(spd_licence s)
        {
            int? bizTypeInt = SharedMappingFuncs.GetServiceType(s._spd_licencetype_value) == ServiceTypeEnum.SecurityBusinessLicence ?
                s.spd_LicenceHolder_account.spd_licensingbusinesstype : null;
            if (bizTypeInt == null) return BizTypeEnum.None;
            else
                return SharedMappingFuncs.GetBizTypeEnum(bizTypeInt).Value;
        }

        internal Guid? GetLicenceHolderId(spd_licence lic)
        {
            ServiceTypeEnum? servicetype = SharedMappingFuncs.GetServiceType(lic._spd_licencetype_value);
            if (servicetype == ServiceTypeEnum.SecurityBusinessLicence || servicetype == ServiceTypeEnum.MDRA)
                return lic.spd_LicenceHolder_account.accountid;
            else
                return lic.spd_LicenceHolder_contact.contactid;
        }

        internal string? GetBizLegalName(spd_licence lic)
        {
            ServiceTypeEnum? servicetype = SharedMappingFuncs.GetServiceType(lic._spd_licencetype_value);
            if (servicetype == ServiceTypeEnum.SecurityBusinessLicence || servicetype == ServiceTypeEnum.MDRA)
                return lic.spd_LicenceHolder_account.spd_organizationlegalname;
            else
                return null;
        }
    }
}
