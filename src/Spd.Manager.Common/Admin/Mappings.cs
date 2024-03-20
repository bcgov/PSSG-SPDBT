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
        }
    }
}
