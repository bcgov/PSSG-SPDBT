using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Config;
using Spd.Utilities.Address;

namespace Spd.Manager.Admin
{
    internal class AdminManager :
        IRequestHandler<FindAddressQuery, IEnumerable<AddressFindResponse>>,
        IRequestHandler<RetrieveAddressByIdQuery, IEnumerable<AddressRetrieveResponse>>,
        IRequestHandler<GetBannerMsgQuery, string>,
        IAdminManager
    {
        private readonly IAddressAutocompleteClient _addressClient;
        private readonly IConfigRepository _configRepo;
        private readonly IMapper _mapper;
        public AdminManager(IAddressAutocompleteClient addressClient, IMapper mapper, IConfigRepository configRepo)
        {
            _addressClient = addressClient;
            _mapper = mapper;
            _configRepo = configRepo;
        }

        public async Task<IEnumerable<AddressFindResponse>> Handle(FindAddressQuery query, CancellationToken cancellationToken)
        {
            IEnumerable<AddressAutocompleteFindResponse> result =
                (IEnumerable<AddressAutocompleteFindResponse>)await this._addressClient.Query(
                    new AddressSearchQuery { SearchTerm = query.SearchTerm, Country = query.Country, LastId = query.LastId },
                    cancellationToken);
            return _mapper.Map<IEnumerable<AddressFindResponse>>(result);
        }

        public async Task<IEnumerable<AddressRetrieveResponse>> Handle(RetrieveAddressByIdQuery query, CancellationToken cancellationToken)
        {
            IEnumerable<AddressAutocompleteRetrieveResponse> result =
                (IEnumerable<AddressAutocompleteRetrieveResponse>)await this._addressClient.Query(new AddressRetrieveQuery { Id = query.Id }, cancellationToken);
            return _mapper.Map<IEnumerable<AddressRetrieveResponse>>(result);
        }

        public async Task<string> Handle(GetBannerMsgQuery query, CancellationToken cancellationToken)
        {
            return (await _configRepo.Query(new ConfigQuery(IConfigRepository.BANNER_MSG_CONFIG_KEY), cancellationToken))
                .ConfigItems
                .First()
                .Value;
        }
    }
}
