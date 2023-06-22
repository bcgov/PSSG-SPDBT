using AutoMapper;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Utilities.Shared.ResourceContracts;

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
                SharableClearanceSearchRequest q => await SearchSharableClearanceAsync(q, ct),
                _ => throw new NotSupportedException($"{request.GetType().Name} is not supported")
            };
        }

        private async Task<SharableClearanceSearchResponse> SearchSharableClearanceAsync(SharableClearanceSearchRequest request, CancellationToken ct)
        {
            var org = (OrgQryResult)await _orgRepo.QueryOrgAsync(new OrgByIdentifierQry(request.OrgId), ct);
            var contact = (ApplicantIdentityQueryResult?)await _identityRepo.Query(new ApplicantIdentityQuery(request.BcscId), ct);
            if (contact == null) return new SharableClearanceSearchResponse();
            SharableClearanceQry qry = new SharableClearanceQry(
                ContactId: contact.ContactId,
                FromDate: DateTimeOffset.UtcNow.AddMonths(6),
                Sharable: true,
                WorkWith: org.OrgResult.WorkWith,
                ServiceType: Enum.Parse<ServiceTypeEnum>(request.ServiceType.ToString())
            );
            var results = await _appRepo.QueryAsync(qry, ct);
            return null;
        }
    }
}