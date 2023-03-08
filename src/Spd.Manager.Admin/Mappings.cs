using AutoMapper;
using Spd.Utilities.Address;

namespace Spd.Manager.Admin
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<AddressAutocompleteFindResponse, AddressFindResponse>();
        }
    }
}
