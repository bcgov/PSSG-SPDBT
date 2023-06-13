using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Org;

namespace Spd.Manager.Membership.Org
{
    internal class OrgManager :
        IRequestHandler<OrgUpdateCommand, OrgResponse>,
        IRequestHandler<OrgGetQuery, OrgResponse>,
        IOrgManager
    {
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        public OrgManager(IOrgRepository orgRepository, IMapper mapper)
        {
            _orgRepository = orgRepository;
            _mapper = mapper;
        }

        public async Task<OrgResponse> Handle(OrgUpdateCommand request, CancellationToken cancellationToken)
        {
            var updateOrg = _mapper.Map<Resource.Organizations.Org.Org>(request.OrgUpdateRequest);
            var result = await _orgRepository.ManageOrgAsync(new OrgUpdateCmd(updateOrg), cancellationToken);
            return _mapper.Map<OrgResponse>(result.Org);
        }

        public async Task<OrgResponse?> Handle(OrgGetQuery request, CancellationToken cancellationToken)
        {
            var result = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(request.OrgId, request.AccessCode), cancellationToken);
            if (result == null) return null;

            return _mapper.Map<OrgResponse>(result.OrgResult);
        }
    }
}
