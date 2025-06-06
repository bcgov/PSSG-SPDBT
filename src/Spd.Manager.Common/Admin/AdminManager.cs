﻿using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Resource.Repository.Config;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Address;
using Spd.Utilities.Shared;

namespace Spd.Manager.Common.Admin;

internal class AdminManager(
        IAddressAutocompleteClient _addressClient,
        IMapper _mapper,
        IConfigRepository _configRepo,
        IOrgRepository _orgRepo,
        IDistributedCache _cache)
        : IRequestHandler<FindAddressQuery, IEnumerable<AddressFindResponse>>,
        IRequestHandler<RetrieveAddressByIdQuery, IEnumerable<AddressRetrieveResponse>>,
        IRequestHandler<GetBannerMsgQuery, string?>,
        IRequestHandler<GetReplacementProcessingTimeQuery, string?>,
        IRequestHandler<GetMinistryQuery, IEnumerable<MinistryResponse>>,
        IRequestHandler<GetAccreditedDogTrainingSchoolListQuery, IEnumerable<DogSchoolResponse>>,
        IAdminManager
{
    public async Task<IEnumerable<AddressFindResponse>> Handle(FindAddressQuery query, CancellationToken cancellationToken)
    {
        IEnumerable<AddressAutocompleteFindResponse> result =
            (IEnumerable<AddressAutocompleteFindResponse>)await _addressClient.Query(
                new AddressSearchQuery { SearchTerm = query.SearchTerm, Country = query.Country, LastId = query.LastId },
                cancellationToken);
        return _mapper.Map<IEnumerable<AddressFindResponse>>(result);
    }

    public async Task<IEnumerable<AddressRetrieveResponse>> Handle(RetrieveAddressByIdQuery query, CancellationToken cancellationToken)
    {
        IEnumerable<AddressAutocompleteRetrieveResponse> result =
            (IEnumerable<AddressAutocompleteRetrieveResponse>)await _addressClient.Query(new AddressRetrieveQuery { Id = query.Id }, cancellationToken);
        return _mapper.Map<IEnumerable<AddressRetrieveResponse>>(result);
    }

    public async Task<string?> Handle(GetBannerMsgQuery query, CancellationToken cancellationToken)
    {
        var result = await _cache.GetAsync(
            IConfigRepository.BANNER_MSG_CONFIG_KEY,
            async ct => (await _configRepo.Query(new ConfigQuery(IConfigRepository.BANNER_MSG_CONFIG_KEY), cancellationToken)).ConfigItems.ToList(),
            TimeSpan.FromMinutes(15),
            cancellationToken);

        return result?.FirstOrDefault()?.Value;
    }

    public async Task<string?> Handle(GetReplacementProcessingTimeQuery query, CancellationToken cancellationToken)
    {
        var result = await _cache.GetAsync(
            IConfigRepository.LICENSING_REPLACEMENTPROCESSINGTIME_KEY,
            async ct => (await _configRepo.Query(new ConfigQuery(IConfigRepository.LICENSING_REPLACEMENTPROCESSINGTIME_KEY), cancellationToken)).ConfigItems.ToList(),
            TimeSpan.FromMinutes(15),
            cancellationToken);

        return result?.FirstOrDefault()?.Value;
    }

    public async Task<IEnumerable<MinistryResponse>> Handle(GetMinistryQuery request, CancellationToken cancellationToken)
    {
        var result = await _cache.GetAsync(
            "ministries_list",
            async ct => ((OrgsQryResult)await _orgRepo.QueryOrgAsync(new OrgsQry(null, ParentOrgId: SpdConstants.BcGovOrgId, IncludeInactive: true), ct)).OrgResults.ToList(),
            TimeSpan.FromMinutes(240),
            cancellationToken);
        return _mapper.Map<IEnumerable<MinistryResponse>>(result);
    }

    public async Task<IEnumerable<DogSchoolResponse>> Handle(GetAccreditedDogTrainingSchoolListQuery query, CancellationToken ct)
    {
        var result = await _cache.GetAsync(
           "accredited_dog_training_school_list",
           async ct => ((OrgsQryResult)await _orgRepo.QueryOrgAsync(new OrgsQry
           {
               IsAccreditSchool = true,
           },
           ct)).OrgResults.ToList(),
           TimeSpan.FromMinutes(240),
           ct);
        return _mapper.Map<IEnumerable<DogSchoolResponse>>(result);
    }
}