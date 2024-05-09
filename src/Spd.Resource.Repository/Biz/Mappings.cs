using AutoMapper;
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
            .ForPath(d => d.address1_city, opt => opt.MapFrom(s => s.MailingAddress.City))
            .ForPath(d => d.address1_country, opt => opt.MapFrom(s => s.MailingAddress.Country))
            .ForPath(d => d.address1_postalcode, opt => opt.MapFrom(s => s.MailingAddress.PostalCode))
            .ForPath(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.MailingAddress.Province))
            .ForPath(d => d.address1_line1, opt => opt.MapFrom(s => s.MailingAddress.AddressLine1))
            .ForPath(d => d.address1_line2, opt => opt.MapFrom(s => s.MailingAddress.AddressLine2))
            .ForPath(d => d.address2_city, opt => opt.MapFrom(s => s.BusinessAddress.City))
            .ForPath(d => d.address2_country, opt => opt.MapFrom(s => s.BusinessAddress.Country))
            .ForPath(d => d.address2_postalcode, opt => opt.MapFrom(s => s.BusinessAddress.PostalCode))
            .ForPath(d => d.address2_stateorprovince, opt => opt.MapFrom(s => s.BusinessAddress.Province))
            .ForPath(d => d.address2_line1, opt => opt.MapFrom(s => s.BusinessAddress.AddressLine1))
            .ForPath(d => d.address2_line2, opt => opt.MapFrom(s => s.BusinessAddress.AddressLine2))
            .ForPath(d => d.spd_bcbusinessaddresscity, opt => opt.MapFrom(s => s.BCBusinessAddress.City))
            .ForPath(d => d.spd_bcbusinessaddresscountry, opt => opt.MapFrom(s => s.BCBusinessAddress.Country))
            .ForPath(d => d.spd_bcbusinessaddresspostalcode, opt => opt.MapFrom(s => s.BCBusinessAddress.PostalCode))
            .ForPath(d => d.spd_bcbusinessaddressprovince, opt => opt.MapFrom(s => s.BCBusinessAddress.Province))
            .ForPath(d => d.spd_bcbusinessaddressline1, opt => opt.MapFrom(s => s.BCBusinessAddress.AddressLine1))
            .ForPath(d => d.spd_bcbusinessaddressline2, opt => opt.MapFrom(s => s.BCBusinessAddress.AddressLine2))
            .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.spd_orgguid, opt => opt.MapFrom(s => s.BizGuid))
            .ForMember(d => d.name, opt => opt.MapFrom(s => s.BizName))
            .ForMember(d => d.spd_organizationlegalname, opt => opt.MapFrom(s => s.BizLegalName))
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
            .ForMember(d => d.BranchAddresses, opt => opt.MapFrom(s => s.spd_Organization_Addresses.Where(a => a.spd_type == (int)AddressTypeOptionSet.Branch)));

            CreateMap<BizUpdateCmd, account>()
            .IncludeBase<Biz, account>()
            .ForMember(d => d.spd_licensingbusinesstype, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeOptionSet(s.BizType)));

            CreateMap<BizCreateCmd, account>()
            .IncludeBase<Biz, account>()
            .ForMember(d => d.spd_licensingbusinesstype, opt => opt.MapFrom(s => SharedMappingFuncs.GetBizTypeOptionSet(s.BizType)));

            CreateMap<BranchAddr, spd_address>()
            .ForMember(d => d.spd_address1, opt => opt.MapFrom(s => s.AddressLine1))
            .ForMember(d => d.spd_address2, opt => opt.MapFrom(s => s.AddressLine2))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.City))
            .ForMember(d => d.spd_provincestate, opt => opt.MapFrom(s => s.Province))
            .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.PostalCode))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.Country))
            .ForMember(d => d.spd_addressid, opt => opt.MapFrom(s => s.BranchId))
            .ForMember(d => d.spd_branchmanagername, opt => opt.MapFrom(s => s.BranchManager))
            .ForMember(d => d.spd_branchphone, opt => opt.MapFrom(s => s.BranchPhoneNumber))
            .ForMember(d => d.spd_branchemail, opt => opt.MapFrom(s => s.BranchEmailAddr))
            .ReverseMap();
        }

        private static IEnumerable<ServiceTypeEnum>? GetServiceTypeEnums(IEnumerable<spd_servicetype> serviceTypes)
        {
            return serviceTypes.Select(s => Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(s.spd_servicetypeid))).ToArray();
        }
    }
}
