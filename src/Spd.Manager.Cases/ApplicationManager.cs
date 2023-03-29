using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager
        : IRequestHandler<ApplicationInviteCreateCommand, IEnumerable<ApplicationInviteCreateResponse>>,
        IRequestHandler<CheckApplicationInviteDuplicateQuery, IEnumerable<CheckApplicationInviteDuplicateResponse>>,
        IApplicationManager
    {
        private readonly IApplicationRepository _screeningRepository;
        private readonly IMapper _mapper;
        public ApplicationManager(IApplicationRepository screeningRepository, IMapper mapper)
        {
            _screeningRepository = screeningRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ApplicationInviteCreateResponse>> Handle(ApplicationInviteCreateCommand request, CancellationToken cancellationToken)
        {
            //todo: duplication check?

            var cmd = _mapper.Map<ApplicationInviteCreateCmd>(request);
            var resp = await _screeningRepository.AddApplicationInvitesAsync(cmd, cancellationToken);
            return _mapper.Map<IEnumerable<ApplicationInviteCreateResponse>>(resp);
        }

        public async Task<IEnumerable<CheckApplicationInviteDuplicateResponse>> Handle(CheckApplicationInviteDuplicateQuery request, CancellationToken cancellationToken)
        {
            //List<CheckApplicationInviteDuplicateResponse> resp = new List<CheckApplicationInviteDuplicateResponse>();

            List<CheckApplicationInviteDuplicateResponse> resp = new List<CheckApplicationInviteDuplicateResponse>();
            var i = 1;
            foreach (var item in request.ScreeningInviteCreateRequests)
            {
                CheckApplicationInviteDuplicateResponse dupResp = new CheckApplicationInviteDuplicateResponse();
                //bool hasDuplicate = await _screeningRepository.CheckInviteDuplicateAsync(item, cancellationToken);
                dupResp.HasPotentialDuplicate = (i == 1) ? true : false;
                dupResp.FirstName = item.FirstName;
                dupResp.LastName = item.LastName;
                dupResp.Email = item.Email;
                resp.Add(dupResp);
                i++;
            }

            /*
            //duplicated in organization
            var searchOrgQry = _mapper.Map<SearchOrgQry>(request.CreateOrgRegistrationRequest);
            bool hasDuplicateInOrg = await _orgRepository.CheckDuplicateAsync(searchOrgQry, cancellationToken);
            if (hasDuplicateInOrg)
            {
                resp.HasPotentialDuplicate = true;
                resp.DuplicateFoundIn = OrgProcess.ExistingOrganization;
                return resp;
            }

            //duplicated in org registration
            var searchQry = _mapper.Map<SearchRegistrationQry>(request.CreateOrgRegistrationRequest);
            bool hasDuplicateInOrgReg = await _orgRegRepository.CheckDuplicateAsync(searchQry, cancellationToken);
            if (hasDuplicateInOrgReg)
            {
                resp.HasPotentialDuplicate = true;
                resp.DuplicateFoundIn = OrgProcess.Registration;
            }
            */
            return resp;
        }
    }
}