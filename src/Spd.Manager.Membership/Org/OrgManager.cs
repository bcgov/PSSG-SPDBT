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
            var updateOrg = _mapper.Map<OrgUpdateCmd>(request.OrgUpdateRequest);
            var response = await _orgRepository.OrgUpdateAsync(updateOrg, cancellationToken);
            return _mapper.Map<OrgResponse>(response);
        }

        public async Task<OrgResponse> Handle(OrgGetQuery request, CancellationToken cancellationToken)
        {
            var response = await _orgRepository.OrgGetAsync(request.OrgId, cancellationToken);
            return _mapper.Map<OrgResponse>(response);
        }
    }
}
