using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.MDRARegistration;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<CreateMDRARegistrationCmd, spd_orgregistration>()
        .ForMember(d => d.spd_orgregistrationid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.spd_applicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
        .ForMember(d => d.spd_authorizedcontactgivenname, opt => opt.MapFrom(s => $"{s.BizOwnerFirstName.Trim()} {s.BizOwnerMiddleName.Trim()}"))
        .ForMember(d => d.spd_authorizedcontactsurname, opt => opt.MapFrom(s => s.BizOwnerLastName))
        .ForMember(d => d.spd_organizationlegalname, opt => opt.MapFrom(s => s.BizLegalName))
        .ForMember(d => d.spd_organizationname, opt => opt.MapFrom(s => s.BizTradeName))
        .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.BizEmailAddress))
        .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.BizPhoneNumber))
        .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => true))
        .ForMember(d => d.spd_street1, opt => opt.MapFrom(s => s.BizMailingAddress == null ? null : s.BizMailingAddress.AddressLine1))
        .ForMember(d => d.spd_street2, opt => opt.MapFrom(s => s.BizMailingAddress == null ? null : s.BizMailingAddress.AddressLine2))
        .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.BizMailingAddress == null ? null : s.BizMailingAddress.City))
        .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.BizMailingAddress == null ? null : s.BizMailingAddress.Province))
        .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.BizMailingAddress == null ? null : s.BizMailingAddress.PostalCode))
        .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.BizMailingAddress == null ? null : s.BizMailingAddress.Country))
        .ReverseMap()
        .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_applicationtype)))
        .ForMember(d => d.BizOwnerFirstName, opt => opt.MapFrom(s => s.spd_authorizedcontactgivenname)) //tbd
        .ForMember(d => d.BizOwnerMiddleName, opt => opt.MapFrom(s => s.spd_authorizedcontactgivenname)) //tbd
        ;

        CreateMap<CreateMDRARegistrationCmd, List<spd_address>>()
        .ConvertUsing((src, dest, context) =>
        {
            var result = new List<spd_address>();

            // Main Office
            if (src.BizAddress != null)
            {
                result.Add(new spd_address
                {
                    spd_addressid = Guid.NewGuid(),
                    spd_type = (int)AddressTypeOptionSet.MainOffice,
                    spd_branchmanagername = $"{src.BizManagerFirstName} {src.BizManagerMiddleName} {src.BizManagerLastName}".Trim(),
                    spd_branchphone = src.BizPhoneNumber,
                    spd_branchemail = src.BizEmailAddress,
                    spd_address1 = src.BizAddress.AddressLine1,
                    spd_address2 = src.BizAddress.AddressLine2,
                    spd_city = src.BizAddress.City,
                    spd_provincestate = src.BizAddress.Province,
                    spd_postalcode = src.BizAddress.PostalCode,
                    spd_country = src.BizAddress.Country
                });
            }

            // Mailing Address
            if (src.BizMailingAddress != null)
            {
                result.Add(new spd_address
                {
                    spd_addressid = Guid.NewGuid(),
                    spd_type = (int)AddressTypeOptionSet.Mailing,
                    spd_address1 = src.BizMailingAddress.AddressLine1,
                    spd_address2 = src.BizMailingAddress.AddressLine2,
                    spd_city = src.BizMailingAddress.City,
                    spd_provincestate = src.BizMailingAddress.Province,
                    spd_postalcode = src.BizMailingAddress.PostalCode,
                    spd_country = src.BizMailingAddress.Country
                });
            }

            // Branches
            if (src.Branches != null)
            {
                foreach (var branch in src.Branches)
                {
                    result.Add(new spd_address
                    {
                        spd_addressid = Guid.NewGuid(),
                        spd_type = (int)AddressTypeOptionSet.Branch,
                        spd_branchmanagername = branch.BranchManager,
                        spd_branchphone = branch.BranchPhoneNumber,
                        spd_branchemail = branch.BranchEmailAddr,
                        spd_address1 = branch.AddressLine1,
                        spd_address2 = branch.AddressLine2,
                        spd_city = branch.City,
                        spd_provincestate = branch.Province,
                        spd_postalcode = branch.PostalCode,
                        spd_country = branch.Country
                    });
                }
            }

            return result;
        });


    }
}
