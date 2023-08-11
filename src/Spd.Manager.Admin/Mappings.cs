using AutoMapper;
using Spd.Resource.Applicants.Ministry;
using Spd.Utilities.Address;

namespace Spd.Manager.Admin
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<AddressAutocompleteFindResponse, AddressFindResponse>();
            CreateMap<AddressAutocompleteRetrieveResponse, AddressRetrieveResponse>();
            CreateMap<MinistryResp, MinistryResponse>();
        }
    }
}
