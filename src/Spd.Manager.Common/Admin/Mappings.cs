using AutoMapper;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Address;

namespace Spd.Manager.Common.Admin
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<AddressAutocompleteFindResponse, AddressFindResponse>();
            CreateMap<AddressAutocompleteRetrieveResponse, AddressRetrieveResponse>();
            CreateMap<OrgResult, MinistryResponse>()
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.OrganizationName))
                .ForMember(d => d.ServiceTypeCodes, opt => opt.MapFrom(s => s.ServiceTypes));
            CreateMap<OrgResult, DogSchoolResponse>()
             .ForMember(d => d.SchoolLegalName, opt => opt.MapFrom(s => s.OrganizationLegalName))
             .ForMember(d => d.SchoolName, opt => opt.MapFrom(s => s.OrganizationName))
             .ForMember(d => d.ContactPhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
             .ForMember(d => d.ContactEmailAddress, opt => opt.MapFrom(s => s.Email))
             .ForMember(d => d.City, opt => opt.MapFrom(s => s.AddressCity))
             .ForMember(d => d.Country, opt => opt.MapFrom(s => s.AddressCountry))
             .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.AddressPostalCode))
             .ForMember(d => d.Province, opt => opt.MapFrom(s => s.AddressProvince));
        }
    }
}
