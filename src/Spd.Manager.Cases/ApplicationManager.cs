using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, Unit>,
        IRequestHandler<CheckApplicationInviteDuplicateQuery, IEnumerable<CheckApplicationInviteDuplicateResponse>>,
        IRequestHandler<ApplicationManualSubmissionCreateCommand, Unit>,
        IRequestHandler<CheckManualSubmissionDuplicateQuery, CheckManualSubmissionDuplicateResponse>,
        IApplicationManager
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;

        public ApplicationManager(IApplicationRepository applicationRepository, IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(ApplicationInviteCreateCommand request, CancellationToken cancellationToken)
        {
            var cmd = _mapper.Map<ApplicationInviteCreateCmd>(request);
            //todo: after logon seq is done, we need to add userId here.
            await _applicationRepository.AddApplicationInvitesAsync(cmd, cancellationToken);
            return default;
        }

        public async Task<IEnumerable<CheckApplicationInviteDuplicateResponse>> Handle(CheckApplicationInviteDuplicateQuery request, CancellationToken cancellationToken)
        {
            List<CheckApplicationInviteDuplicateResponse> resp = new List<CheckApplicationInviteDuplicateResponse>();
            foreach (var item in request.ApplicationInviteCreateRequests)
            {
                var searchInvitationQry = _mapper.Map<SearchInvitationQry>(item);
                searchInvitationQry.OrgId = request.OrgId;

                bool hasDuplicate = await _applicationRepository.CheckInviteDuplicateAsync(searchInvitationQry, cancellationToken);
                if (hasDuplicate)
                {
                    CheckApplicationInviteDuplicateResponse dupResp = new CheckApplicationInviteDuplicateResponse();
                    dupResp.HasPotentialDuplicate = true;
                    dupResp.OrgId = request.OrgId;
                    dupResp.FirstName = item.FirstName;
                    dupResp.LastName = item.LastName;
                    dupResp.Email = item.Email;
                    resp.Add(dupResp);
                }
            }

            return resp;
        }

        public async Task<Unit> Handle(ApplicationManualSubmissionCreateCommand request, CancellationToken cancellationToken)
        {
            var cmd = _mapper.Map<ApplicationManualSubmissionCreateCmd>(request.ApplicationManualSubmissionCreateRequest);
            await _applicationRepository.AddApplicationManualSubmissionAsync(cmd, cancellationToken);
            return default;
        }

        public async Task<CheckManualSubmissionDuplicateResponse> Handle(CheckManualSubmissionDuplicateQuery request, CancellationToken cancellationToken)
        {
            CheckManualSubmissionDuplicateResponse resp = new CheckManualSubmissionDuplicateResponse();

            //duplicated in organization
            //var searchOrgQry = _mapper.Map<SearchOrgQry>(request.CreateOrgRegistrationRequest);
            //bool hasDuplicate = await _applicationRepository.CheckManualSubmissionDuplicateAsync(searchOrgQry, cancellationToken);
            //if (hasDuplicate)
            //{
            //    resp.HasPotentialDuplicate = true;
            //    return resp;
            //}

            resp.OrgSpdId = request.ApplicationManualSubmissionCreateRequest.OrganizationId;
            resp.GivenName = request.ApplicationManualSubmissionCreateRequest.GivenName;
            resp.Surname = request.ApplicationManualSubmissionCreateRequest.Surname;
            resp.EmailAddress = request.ApplicationManualSubmissionCreateRequest.EmailAddress;
            resp.HasPotentialDuplicate = true;

            return resp;
        }
    }
}