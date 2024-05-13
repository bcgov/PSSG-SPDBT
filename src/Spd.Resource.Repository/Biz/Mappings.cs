﻿using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Biz
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<Biz, account>()
            .ForMember(d => d.accountid, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.name, opt => opt.MapFrom(s => s.BizName))
            .ForMember(d => d.spd_orgguid, opt => opt.MapFrom(s => s.BizGuid))
            .ForMember(d => d.spd_organizationlegalname, opt => opt.MapFrom(s => s.BizLegalName))
            .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.MailingAddress.City))
            .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.MailingAddress.Country))
            .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.MailingAddress.PostalCode))
            .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.MailingAddress.Province))
            .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.MailingAddress.AddressLine1))
            .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.MailingAddress.AddressLine2))
            .ForMember(d => d.spd_bcbusinessaddresscity, opt => opt.MapFrom(s => s.BCBusinessAddress.City))
            .ForMember(d => d.spd_bcbusinessaddresscountry, opt => opt.MapFrom(s => s.BCBusinessAddress.Country))
            .ForMember(d => d.spd_bcbusinessaddresspostalcode, opt => opt.MapFrom(s => s.BCBusinessAddress.PostalCode))
            .ForMember(d => d.spd_bcbusinessaddressprovince, opt => opt.MapFrom(s => s.BCBusinessAddress.Province))
            .ForMember(d => d.spd_bcbusinessaddressline1, opt => opt.MapFrom(s => s.BCBusinessAddress.AddressLine1))
            .ForMember(d => d.spd_bcbusinessaddressline2, opt => opt.MapFrom(s => s.BCBusinessAddress.AddressLine2))
            .ForMember(d => d.address2_city, opt => opt.MapFrom(s => s.BusinessAddress.City))
            .ForMember(d => d.address2_country, opt => opt.MapFrom(s => s.BusinessAddress.Country))
            .ForMember(d => d.address2_postalcode, opt => opt.MapFrom(s => s.BusinessAddress.PostalCode))
            .ForMember(d => d.address2_stateorprovince, opt => opt.MapFrom(s => s.BusinessAddress.Province))
            .ForMember(d => d.address2_line1, opt => opt.MapFrom(s => s.BusinessAddress.AddressLine1))
            .ForMember(d => d.address2_line2, opt => opt.MapFrom(s => s.BusinessAddress.AddressLine2))
            .ReverseMap();

            _ = CreateMap<account, BizResult>()
            .IncludeBase<account, Biz>()
            .ForMember(d => d.BizName, opt => opt.MapFrom(s => s.name))
            .ForMember(d => d.BizLegalName, opt => opt.MapFrom(s => s.spd_organizationlegalname))
            .ForMember(d => d.MaxContacts, opt => opt.MapFrom(s => s.spd_maximumnumberofcontacts))
            .ForMember(d => d.ParentBizId, opt => opt.MapFrom(s => s._parentaccountid_value))
            .ForMember(d => d.MaxPrimaryContacts, opt => opt.MapFrom(s => s.spd_noofprimaryauthorizedcontacts))
            .ForMember(d => d.ServiceTypes, opt => opt.MapFrom(s => GetServiceTypeEnums(s.spd_account_spd_servicetype)))
            .ForMember(d => d.AccessCode, opt => opt.MapFrom(s => s.spd_accesscode))
            .ForMember(d => d.BizType, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeEnum(s.spd_licensingbusinesstype)))
            .ForMember(d => d.SoleProprietorSwlContactInfo, opt => opt.MapFrom(s => GetSoleProprietorContactInfo(s.spd_organization_spd_licence_soleproprietor)))
            .ForMember(d => d.SoleProprietorSwlPhoneNumber, opt => opt.MapFrom(s => GetSoleProprietorContactPhoneNumber(s.spd_organization_spd_licence_soleproprietor)))
            .ForMember(d => d.SoleProprietorSwlEmailAddress, opt => opt.MapFrom(s => GetSoleProprietorContactEmail(s.spd_organization_spd_licence_soleproprietor)))
            .ForMember(d => d.BranchAddresses, opt => opt.MapFrom(s => s.spd_Organization_Addresses.Where(a => a.spd_type == (int)AddressTypeOptionSet.Branch)));

            CreateMap<UpdateBizCmd, account>()
            .IncludeBase<Biz, account>()
            .ForMember(d => d.spd_licensingbusinesstype, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeOptionSet(s.BizType)))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<CreateBizCmd, account>()
            .IncludeBase<Biz, account>()
            .ForMember(d => d.spd_licensingbusinesstype, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeOptionSet(s.BizType)));

            CreateMap<BranchAddr, spd_address>()
            .ForMember(d => d.spd_address1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.spd_address2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.City))
            .ForMember(d => d.spd_provincestate, opt => opt.MapFrom(s => s.Province))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.Country))
            .ForMember(d => d.spd_addressid, opt => opt.MapFrom(s => s.BranchId != null ? s.BranchId : Guid.NewGuid()))
            .ForMember(d => d.spd_branchmanagername, opt => opt.MapFrom(s => s.BranchManager))
            .ForMember(d => d.spd_branchphone, opt => opt.MapFrom(s => s.BranchPhoneNumber))
            .ForMember(d => d.spd_branchemail, opt => opt.MapFrom(s => s.BranchEmailAddr))
            .ForMember(d => d.spd_type, opt => opt.MapFrom(s => (int)AddressTypeOptionSet.Branch));

            CreateMap<spd_address, BranchAddr>()
            .ForMember(d => d.AddressLine1, opt => opt.MapFrom(s => s.spd_address1))
            .ForMember(d => d.AddressLine2, opt => opt.MapFrom(s => s.spd_address2))
            .ForMember(d => d.City, opt => opt.MapFrom(s => s.spd_city))
            .ForMember(d => d.Province, opt => opt.MapFrom(s => s.spd_provincestate))
            .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.spd_postalcode))
            .ForMember(d => d.Country, opt => opt.MapFrom(s => s.spd_country))
            .ForMember(d => d.BranchId, opt => opt.MapFrom(s => s.spd_addressid))
            .ForMember(d => d.BranchManager, opt => opt.MapFrom(s => s.spd_branchmanagername))
            .ForMember(d => d.BranchPhoneNumber, opt => opt.MapFrom(s => s.spd_branchphone))
            .ForMember(d => d.BranchEmailAddr, opt => opt.MapFrom(s => s.spd_branchemail));
        }

        private static IEnumerable<ServiceTypeEnum>? GetServiceTypeEnums(IEnumerable<spd_servicetype> serviceTypes)
        {
            return serviceTypes.Select(s => Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(s.spd_servicetypeid))).ToArray();
        }

        private static string SetAddressField(string src, string dest)
        {
            if (string.IsNullOrEmpty(src)) return dest;

            return src;
        }

        private static SwlContactInfo GetSoleProprietorContactInfo(IEnumerable<spd_licence> licences)
        {
            spd_licence? solePropietorInfo = licences.FirstOrDefault(l => l.statuscode == DynamicsConstants.StatusCode_Active);
            
            return new SwlContactInfo()
            {
                BizContactId = solePropietorInfo?.spd_LicenceHolder_contact?.spd_contact_spd_businesscontact.FirstOrDefault()?.spd_businesscontactid,
                ContactId = solePropietorInfo?.spd_LicenceHolder_contact?.contactid,
                LicenceId = solePropietorInfo?.spd_licenceid
            };
        }

        private static string? GetSoleProprietorContactPhoneNumber(IEnumerable<spd_licence> licences)
        {
            spd_licence? solePropietorInfo = licences.FirstOrDefault(l => l.statuscode == DynamicsConstants.StatusCode_Active);
            return solePropietorInfo?.spd_LicenceHolder_contact?.telephone1;
        }

        private static string? GetSoleProprietorContactEmail(IEnumerable<spd_licence> licences)
        {
            spd_licence? solePropietorInfo = licences.FirstOrDefault(l => l.statuscode == DynamicsConstants.StatusCode_Active);
            return solePropietorInfo?.spd_LicenceHolder_contact?.emailaddress1;
        }
    }
}
