using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, Unit>,
        IRequestHandler<CheckApplicationInviteDuplicateQuery, IEnumerable<CheckApplicationInviteDuplicateResponse>>,
        IRequestHandler<ApplicationCreateCommand, Unit>,
        IRequestHandler<CheckApplicationDuplicateQuery, CheckApplicationDuplicateResponse>,
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

        public async Task<Unit> Handle(ApplicationCreateCommand request, CancellationToken cancellationToken)
        {
            var cmd = _mapper.Map<ApplicationCreateCmd>(request.ApplicationCreateRequest);
            await _applicationRepository.AddApplicationAsync(cmd, cancellationToken);
            return default;
        }

        public async Task<CheckApplicationDuplicateResponse> Handle(CheckApplicationDuplicateQuery request, CancellationToken cancellationToken)
        {
            CheckApplicationDuplicateResponse resp = new CheckApplicationDuplicateResponse();
            var searchApplicationQry = _mapper.Map<SearchApplicationQry>(request.ApplicationCreateRequest);

            //check if duplicate in application
            bool hasDuplicateApplication = await _applicationRepository.CheckApplicationDuplicateAsync(searchApplicationQry, cancellationToken);
            if (hasDuplicateApplication)
            {
                CheckApplicationDuplicateResponse dupResp = new CheckApplicationDuplicateResponse();
                resp.OrgId = request.ApplicationCreateRequest.OrgId;
                resp.GivenName = request.ApplicationCreateRequest.GivenName;
                resp.Surname = request.ApplicationCreateRequest.Surname;
                resp.EmailAddress = request.ApplicationCreateRequest.EmailAddress;
                resp.HasPotentialDuplicate = true;
            }

            return resp;
        }
    }
}