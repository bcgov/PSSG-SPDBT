﻿using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Config;
using Spd.Resource.Organizations.Org;
using Spd.Utilities.Address;
using Spd.Utilities.Shared;

namespace Spd.Manager.Admin
{
    internal class AdminManager :
        IRequestHandler<FindAddressQuery, IEnumerable<AddressFindResponse>>,
        IRequestHandler<RetrieveAddressByIdQuery, IEnumerable<AddressRetrieveResponse>>,
        IRequestHandler<GetBannerMsgQuery, string>,
        IRequestHandler<GetMinistryQuery, IEnumerable<MinistryResponse>>,
        IAdminManager
    {
        private readonly IAddressAutocompleteClient _addressClient;
        private readonly IConfigRepository _configRepo;
        private readonly IOrgRepository _orgRepo;
        private readonly IMapper _mapper;
        public AdminManager(IAddressAutocompleteClient addressClient, IMapper mapper, IConfigRepository configRepo, IOrgRepository orgRepo)
        {
            _addressClient = addressClient;
            _mapper = mapper;
            _configRepo = configRepo;
            _orgRepo = orgRepo;
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

        public async Task<IEnumerable<MinistryResponse>> Handle(GetMinistryQuery request, CancellationToken cancellationToken)
        {
            var result = (OrgsQryResult)await _orgRepo.QueryOrgAsync(new OrgsQry(null, ParentOrgId: SpdConstants.BC_GOV_ORG_ID, IncludeInactive: true), cancellationToken);
            return _mapper.Map<IEnumerable<MinistryResponse>>(result.OrgResults);
        }
    }
}
