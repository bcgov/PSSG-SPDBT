using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, ApplicationInvitesCreateResponse>,
        IRequestHandler<ApplicationCreateCommand, ApplicationCreateResponse>,
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

        public async Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand createCmd, CancellationToken cancellationToken)
        {
            ApplicationInvitesCreateResponse resp = new(createCmd.OrgId);
            if (createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck)
            {
                var duplicateResp = await CheckDuplicates(createCmd.ApplicationInvitesCreateRequest, createCmd.OrgId, cancellationToken);
                resp.IsDuplicateCheckRequired = createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck;
                resp.DuplicateResponses = duplicateResp;
                if (duplicateResp.Any())
                {
                    resp.CreateSuccess = false;
                    return resp;
                }
            }
            var cmd = _mapper.Map<ApplicationInviteCreateCmd>(createCmd.ApplicationInvitesCreateRequest);
            cmd.OrgId = createCmd.OrgId;
            //todo: after logon seq is done, we need to add userId here.
            await _applicationRepository.AddApplicationInvitesAsync(cmd, cancellationToken);
            resp.CreateSuccess = true;
            return resp;
        }

        public async Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken ct)
        {
            ApplicationCreateResponse result = new();
            if(request.ApplicationCreateRequest.RequireDuplicateCheck)
            {
                result = await CheckDuplicate(request.ApplicationCreateRequest, ct);
                result.IsDuplicateCheckRequired = true;
                if (result.HasPotentialDuplicate)
                {
                    return result;
                }
            }

            var cmd = _mapper.Map<ApplicationCreateCmd>(request.ApplicationCreateRequest);
            Guid? applicationId = await _applicationRepository.AddApplicationAsync(cmd, ct);
            if(applicationId.HasValue)
            {
                result.applicationId = applicationId.Value;
                result.CreateSuccess= true;
            }
            return result;
        }

        public async Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken ct)
        {
            if (request.Page < 1) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "incorrect page number.");
            if (request.PageSize < 1) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "incorrect page size.");

            var response = await _applicationRepository.QueryAsync(
                new ApplicationQuery
                {
                    FilterBy = new FilterBy(request.OrgId, null),
                    SortBy = new SortBy(true, null),
                    Paging = new Paging(request.Page, request.PageSize)
                },
                ct);
            return _mapper.Map<ApplicationListResponse>(response);
        }

        private async Task<IEnumerable<ApplicationInviteDuplicateResponse>> CheckDuplicates(ApplicationInvitesCreateRequest request, Guid orgId, CancellationToken cancellationToken)
        {
            List<ApplicationInviteDuplicateResponse> resp = new List<ApplicationInviteDuplicateResponse>();
            foreach (var item in request.ApplicationInviteCreateRequests)
            {
                var searchInvitationQry = _mapper.Map<SearchInvitationQry>(item);
                searchInvitationQry.OrgId = orgId;

                //duplicated in portal invitation
                bool hasDuplicateInvitation = await _applicationRepository.CheckInviteInvitationDuplicateAsync(searchInvitationQry, cancellationToken);
                if (hasDuplicateInvitation)
                {
                    ApplicationInviteDuplicateResponse dupResp = new ApplicationInviteDuplicateResponse();
                    dupResp.HasPotentialDuplicate = true;
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
                        ApplicationInviteDuplicateResponse dupResp = new ApplicationInviteDuplicateResponse();
                        dupResp.HasPotentialDuplicate = true;
                        dupResp.FirstName = item.FirstName;
                        dupResp.LastName = item.LastName;
                        dupResp.Email = item.Email;
                        resp.Add(dupResp);
                    }
                }
            }

            return resp;
        }

        private async Task<ApplicationCreateResponse> CheckDuplicate(ApplicationCreateRequest request, CancellationToken ct)
        {
            ApplicationCreateResponse resp = new ApplicationCreateResponse();

            var searchApplicationQry = _mapper.Map<SearchApplicationQry>(request);

            //check if duplicate in application
            bool hasDuplicateApplication = await _applicationRepository.CheckApplicationDuplicateAsync(searchApplicationQry, ct);
            if (hasDuplicateApplication)
            {
                resp.HasPotentialDuplicate = true;
                resp.CreateSuccess = false;
            }

            return resp;
        }


    }
}