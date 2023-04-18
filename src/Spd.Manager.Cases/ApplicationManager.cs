using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, Unit>,
        IRequestHandler<CheckApplicationInviteDuplicateQuery, IEnumerable<CheckApplicationInviteDuplicateResponse>>,
        IRequestHandler<ApplicationCreateCommand, Unit>,
        IRequestHandler<CheckApplicationDuplicateQuery, CheckApplicationDuplicateResponse>,
        IRequestHandler<ApplicationListQuery, ApplicationListResponse>,
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
            var applicationCreateRequest = request.ApplicationCreateRequest;

            CheckApplicationDuplicateResponse resp = new CheckApplicationDuplicateResponse();
            resp.OrgId = applicationCreateRequest.OrgId;
            resp.GivenName = applicationCreateRequest.GivenName;
            resp.Surname = applicationCreateRequest.Surname;
            resp.EmailAddress = applicationCreateRequest.EmailAddress;

            var searchApplicationQry = _mapper.Map<SearchApplicationQry>(applicationCreateRequest);

            //check if duplicate in application
            bool hasDuplicateApplication = await _applicationRepository.CheckApplicationDuplicateAsync(searchApplicationQry, cancellationToken);
            if (hasDuplicateApplication)
            {
                resp.HasPotentialDuplicate = true;
            }

            return resp;
        }

        public async Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken cancellationToken)
        {
            if (request.Page < 1) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "incorrect page number.");
            if (request.PageSize < 1) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "incorrect page size.");
            var response = await _applicationRepository.GetApplicationListAsync(request.OrgId, request.Page, request.PageSize, cancellationToken);
            return _mapper.Map<ApplicationListResponse>(response);
        }
    }
}