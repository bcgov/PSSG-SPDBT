using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.Registration;
using Spd.Utilities.Shared;

namespace Spd.Engine.Search
{
    internal class SearchEngine : ISearchEngine
    {
        private readonly IMapper _mapper;
        private readonly IApplicationRepository _appRepo;
        private readonly IOrgRepository _orgRepo;
        private readonly IIdentityRepository _identityRepo;

        public SearchEngine(IApplicationRepository appRepo, IOrgRepository orgRepo, IIdentityRepository identityRepo, IMapper mapper)
        {
            _appRepo = appRepo;
            _orgRepo = orgRepo;
            _identityRepo = identityRepo;
            _mapper = mapper;
        }

        public async Task<SearchResponse?> SearchAsync(SearchRequest request, CancellationToken ct)
        {
            return request switch
            {
                ShareableClearanceSearchRequest q => await SearchShareableClearanceAsync(q, ct),
                _ => throw new NotSupportedException($"{request.GetType().Name} is not supported")
            };
        }

        private async Task<ShareableClearanceSearchResponse> SearchShareableClearanceAsync(ShareableClearanceSearchRequest request, CancellationToken ct)
        {
            ShareableClearanceSearchResponse response = new();
            var org = (OrgQryResult)await _orgRepo.QueryOrgAsync(new OrgByIdentifierQry(request.OrgId), ct);
            var contacts = await _identityRepo.Query(new IdentityQry(request.BcscId, null, IdentityProviderTypeEnum.BcServicesCard), ct);
            var contact = contacts.Items.FirstOrDefault();
            if (contact == null) return response;

            ClearanceQry qry = new(
                ContactId: contact.ContactId,
                FromDate: DateTimeOffset.UtcNow.AddMonths(SpdConstants.ShareableClearanceExpiredDateBufferInMonths),
                Shareable: true,
                IncludeWorkWith: org.OrgResult.EmployeeInteractionType,
                IncludeServiceTypeEnum: Enum.Parse<ServiceTypeEnum>(request.ServiceType.ToString())
            );
            var results = await _appRepo.QueryAsync(qry, ct);
            response.Items = _mapper.Map<IEnumerable<ShareableClearance>>(results.Clearances);
            return response;
        }
    }
}