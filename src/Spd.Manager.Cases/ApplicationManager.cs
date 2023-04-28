using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, ApplicationInvitesCreateResponse>,
        IRequestHandler<ApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationListQuery, ApplicationListResponse>,
        IRequestHandler<ApplicationInviteListQuery, ApplicationInviteListResponse>,
        IApplicationManager
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationInviteRepository _applicationInviteRepository;
        private readonly IMapper _mapper;

        public ApplicationManager(IApplicationRepository applicationRepository, IApplicationInviteRepository applicationInviteRepository, IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _applicationInviteRepository = applicationInviteRepository;
            _mapper = mapper;
        }

        //application-invites
        public async Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand createCmd, CancellationToken ct)
        {
            ApplicationInvitesCreateResponse resp = new(createCmd.OrgId);
            if (createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck)
            {
                var duplicateResp = await CheckDuplicates(createCmd.ApplicationInvitesCreateRequest, createCmd.OrgId, ct);
                resp.IsDuplicateCheckRequired = createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck;
                resp.DuplicateResponses = duplicateResp;
                if (duplicateResp.Any())
                {
                    resp.CreateSuccess = false;
                    return resp;
                }
            }
            var cmd = _mapper.Map<ApplicationInvitesCreateCmd>(createCmd.ApplicationInvitesCreateRequest);
            cmd.OrgId = createCmd.OrgId;
            //todo: after logon seq is done, we need to add userId here.
            await _applicationInviteRepository.AddApplicationInvitesAsync(cmd, ct);
            resp.CreateSuccess = true;
            return resp;
        }
        public async Task<ApplicationInviteListResponse> Handle(ApplicationInviteListQuery request, CancellationToken ct)
        {
            if (request.Page < 0) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Incorrect page number");
            if (request.PageSize < 1) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Incorrect page size");

            var response = await _applicationInviteRepository.QueryAsync(
                new ApplicationInviteQuery
                {
                    FilterBy = new AppInviteFilterBy(request.OrgId, EmailOrNameContains: request.SearchContains),
                    SortBy = new AppInviteSortBy(SubmittedDateDesc : true),
                    Paging = new Paging(request.Page, request.PageSize)
                },
                ct);
            return _mapper.Map<ApplicationInviteListResponse>(response);
        }

        //application
        public async Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken ct)
        {
            ApplicationCreateResponse result = new();
            if (request.ApplicationCreateRequest.RequireDuplicateCheck)
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
            if (applicationId.HasValue)
            {
                result.applicationId = applicationId.Value;
                result.CreateSuccess = true;
            }
            return result;
        }

        public async Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken ct)
        {
            if (request.Page < 0) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Incorrect page number");
            if (request.PageSize < 1) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Incorrect page size");

            var response = await _applicationRepository.QueryAsync(
                new ApplicationQuery
                {
                    FilterBy = new AppFilterBy(request.OrgId, null),
                    SortBy = new AppSortBy(true, null),
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
                bool hasDuplicateInvitation = await _applicationInviteRepository.CheckInviteInvitationDuplicateAsync(searchInvitationQry, cancellationToken);
                if (hasDuplicateInvitation)
                {
                    ApplicationInviteDuplicateResponse dupResp = _mapper.Map<ApplicationInviteDuplicateResponse>(item);
                    dupResp.HasPotentialDuplicate = true;
                    resp.Add(dupResp);
                }

                if (!hasDuplicateInvitation)
                {
                    //duplicated in application
                    bool hasDuplicateApplication = await _applicationInviteRepository.CheckInviteApplicationDuplicateAsync(searchInvitationQry, cancellationToken);
                    if (hasDuplicateApplication)
                    {
                        ApplicationInviteDuplicateResponse dupResp = _mapper.Map<ApplicationInviteDuplicateResponse>(item);
                        dupResp.HasPotentialDuplicate = true;
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