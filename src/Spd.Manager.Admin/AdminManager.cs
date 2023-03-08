using AutoMapper;
using MediatR;
using Spd.Utilities.Address;
using System.Collections.Generic;

namespace Spd.Manager.Admin
{
    public class AdminManager
        : IRequestHandler<FindAddressQuery, IEnumerable<AddressFindResponse>>,
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
            IEnumerable<AddressAutocompleteFindResponse> result = await this._addressClient.Find(query.SearchTerm, cancellationToken);
            return _mapper.Map<IEnumerable<AddressFindResponse>>(result);
        }
    }
}
