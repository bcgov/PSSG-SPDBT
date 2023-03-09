using AutoMapper;
using MediatR;
using Spd.Utilities.Address;

namespace Spd.Manager.Admin
{
    public class AdminManager :
        IRequestHandler<FindAddressQuery, IEnumerable<AddressFindResponse>>,
        IRequestHandler<RetrieveAddressByIdQuery, IEnumerable<AddressRetrieveResponse>>,
        IAdminManager
    {
        private readonly IAddressAutocompleteClient _addressClient;
        private readonly IMapper _mapper;
        public AdminManager(IAddressAutocompleteClient addressClient, IMapper mapper)
        {
            _addressClient = addressClient;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AddressFindResponse>> Handle(FindAddressQuery query, CancellationToken cancellationToken)
        {
            IEnumerable<AddressAutocompleteFindResponse> result =
                (IEnumerable<AddressAutocompleteFindResponse>)await this._addressClient.Query(new AddressSearchQuery { SearchTerm = query.SearchTerm, Country = query.Country }, cancellationToken);
            return _mapper.Map<IEnumerable<AddressFindResponse>>(result);
        }

        public async Task<IEnumerable<AddressRetrieveResponse>> Handle(RetrieveAddressByIdQuery query, CancellationToken cancellationToken)
        {
            IEnumerable<AddressAutocompleteRetrieveResponse> result =
                (IEnumerable<AddressAutocompleteRetrieveResponse>)await this._addressClient.Query(new AddressRetrieveQuery { Id = query.Id }, cancellationToken);
            return _mapper.Map<IEnumerable<AddressRetrieveResponse>>(result);
        }
    }
}
