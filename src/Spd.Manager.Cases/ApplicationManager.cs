using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, Unit>,
        IRequestHandler<CheckApplicationInviteDuplicateQuery, IEnumerable<CheckApplicationInviteDuplicateResponse>>,
        IRequestHandler<ApplicationSubmissionCreateCommand, Unit>,
        IRequestHandler<CheckApplicationSubmissionDuplicateQuery, CheckApplicationSubmissionDuplicateResponse>,
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

                //duplicated in portal invitation
                bool hasDuplicateInvitation = await _applicationRepository.CheckInviteInvitationDuplicateAsync(searchInvitationQry, cancellationToken);
                if (hasDuplicateInvitation)
                {
                    CheckApplicationInviteDuplicateResponse dupResp = new CheckApplicationInviteDuplicateResponse();
                    dupResp.HasPotentialDuplicate = true;
                    dupResp.OrgId = request.OrgId;
                    dupResp.FirstName = item.FirstName;
                    dupResp.LastName = item.LastName;
                    dupResp.Email = item.Email;
                    resp.Add(dupResp);
                }

                if (!hasDuplicateInvitation)
                {
                    //duplicated in application
                    bool hasDuplicateApplication = await _applicationRepository.CheckInviteApplicationDuplicateAsync(searchInvitationQry, cancellationToken);
                    if (hasDuplicateApplication)
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
            }

            return resp;
        }

        public async Task<Unit> Handle(ApplicationSubmissionCreateCommand request, CancellationToken cancellationToken)
        {
            var cmd = _mapper.Map<ApplicationSubmissionCreateCmd>(request.ApplicationSubmissionCreateRequest);
            await _applicationRepository.AddApplicationSubmissionAsync(cmd, cancellationToken);
            return default;
        }

        public async Task<CheckApplicationSubmissionDuplicateResponse> Handle(CheckApplicationSubmissionDuplicateQuery request, CancellationToken cancellationToken)
        {
            CheckApplicationSubmissionDuplicateResponse resp = new CheckApplicationSubmissionDuplicateResponse();

            //duplicated in organization
            //var searchOrgQry = _mapper.Map<SearchOrgQry>(request.CreateOrgRegistrationRequest);
            //bool hasDuplicate = await _applicationRepository.CheckApplicationSubmissionDuplicateAsync(searchOrgQry, cancellationToken);
            //if (hasDuplicate)
            //{
            //    resp.HasPotentialDuplicate = true;
            //    return resp;
            //}

            resp.OrgSpdId = request.ApplicationSubmissionCreateRequest.OrganizationId;
            resp.GivenName = request.ApplicationSubmissionCreateRequest.GivenName;
            resp.Surname = request.ApplicationSubmissionCreateRequest.Surname;
            resp.EmailAddress = request.ApplicationSubmissionCreateRequest.EmailAddress;
            resp.HasPotentialDuplicate = true;

            return resp;
        }
    }
}