using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Cache;

namespace Spd.Manager.Screening
{
    internal class OrgManager :
        IRequestHandler<OrgUpdateCommand, OrgResponse>,
        IRequestHandler<OrgGetQuery, OrgResponse>,
        IOrgManager
    {
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;

        public OrgManager(IOrgRepository orgRepository, IMapper mapper, IDistributedCache cache)
        {
            _orgRepository = orgRepository;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<OrgResponse> Handle(OrgUpdateCommand request, CancellationToken cancellationToken)
        {
            var updateOrg = _mapper.Map<Resource.Repository.Org.Org>(request.OrgUpdateRequest);
            var result = await _orgRepository.ManageOrgAsync(new OrgUpdateCmd(updateOrg), cancellationToken);
            return _mapper.Map<OrgResponse>(result.Org);
        }

        public async Task<OrgResponse?> Handle(OrgGetQuery request, CancellationToken cancellationToken)
        {
            OrgResponse response;
            if(request.AccessCode != null)
            {
                response = await _cache.Get<OrgResponse>($"org-response-{request.AccessCode}");
                if (response != null) return response;
            }
            var result = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(request.OrgId, request.AccessCode), cancellationToken);
            if (result == null) return null;

            response = _mapper.Map<OrgResponse>(result.OrgResult);
            await _cache.Set<OrgResponse>($"org-response-{response.AccessCode}", response, new TimeSpan(0, 30, 0));
            return response;
        }
    }
}
