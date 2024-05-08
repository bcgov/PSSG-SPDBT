using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.Address;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<spd_address, AddressResp>()
        .ForMember(d => d.AddressLine1, opt => opt.MapFrom(s => s.spd_address1))
        .ForMember(d => d.AddressLine2, opt => opt.MapFrom(s => s.spd_address2))
        .ForMember(d => d.City, opt => opt.MapFrom(s => s.spd_city))
        .ForMember(d => d.Province, opt => opt.MapFrom(s => s.spd_provincestate))
        .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.spd_postalcode))
        .ForMember(d => d.Country, opt => opt.MapFrom(s => s.spd_country))
        .ForMember(d => d.BranchId, opt => opt.MapFrom(s => s.spd_addressid))
        .ForMember(d => d.BranchPhoneNumber, opt => opt.MapFrom(s => s.spd_branchphone))
        .ForMember(d => d.BranchEmailAddr, opt => opt.MapFrom(s => s.spd_branchemail));
    }
}
