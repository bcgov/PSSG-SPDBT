using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Org;

namespace Spd.Manager.Membership.Org
{
    internal class OrgManager :
        IRequestHandler<UpdateOrgCommand, OrgResponse>,
        IRequestHandler<GetOrgCommand, OrgResponse>,
        IOrgManager
    {
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        public OrgManager(IOrgRepository orgRepository, IMapper mapper)
        {
            _orgRepository = orgRepository;
            _mapper = mapper;
        }

        public async Task<OrgResponse> Handle(UpdateOrgCommand request, CancellationToken cancellationToken)
        {
            var updateOrg = _mapper.Map<OrgUpdateCommand>(request.UpdateOrgRequest);
            var response = await _orgRepository.UpdateOrgAsync(updateOrg, cancellationToken);
            return _mapper.Map<OrgResponse>(response);
        }

        public async Task<OrgResponse> Handle(GetOrgCommand request, CancellationToken cancellationToken)
        {
            var response = await _orgRepository.GetOrgAsync(request.OrgId, cancellationToken);
            return _mapper.Map<OrgResponse>(response);
        }
    }
}
