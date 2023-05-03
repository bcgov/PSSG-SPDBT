using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, ApplicationInvitesCreateResponse>,
        IRequestHandler<ApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationListQuery, ApplicationListResponse>,
        IRequestHandler<ApplicationInviteListQuery, ApplicationInviteListResponse>,
        IRequestHandler<ApplicationInviteDeleteCommand, Unit>,
        IRequestHandler<ApplicationStatisticsQuery, ApplicationStatisticsResponse>,
        IApplicationManager
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationInviteRepository _applicationInviteRepository;
        private readonly IMapper _mapper;
        private readonly ITempFileStorageService _tempFile;

        public ApplicationManager(IApplicationRepository applicationRepository, IApplicationInviteRepository applicationInviteRepository, IMapper mapper, ITempFileStorageService tempFile)
        {
            _applicationRepository = applicationRepository;
            _applicationInviteRepository = applicationInviteRepository;
            _tempFile = tempFile;
            _mapper = mapper;
        }

        //application-invites
        public async Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand createCmd, CancellationToken ct)
        {
            ApplicationInvitesCreateResponse resp = new(createCmd.OrgId);
            if (createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck)
            {
                var duplicateResp = await CheckDuplicateAppInvite(createCmd.ApplicationInvitesCreateRequest, createCmd.OrgId, ct);
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
            cmd.CreatedByUserId = createCmd.UserId;
            await _applicationInviteRepository.AddApplicationInvitesAsync(cmd, ct);
            resp.CreateSuccess = true;
            return resp;
        }
        public async Task<ApplicationInviteListResponse> Handle(ApplicationInviteListQuery request, CancellationToken ct)
        {
            ApplicationInviteQuery query = _mapper.Map<ApplicationInviteQuery>(request);
            var response = await _applicationInviteRepository.QueryAsync(
                query,
                ct);
            return _mapper.Map<ApplicationInviteListResponse>(response);
        }
        public async Task<Unit> Handle(ApplicationInviteDeleteCommand request, CancellationToken ct)
        {
            var cmd = _mapper.Map<ApplicationInviteDeleteCmd>(request);
            await _applicationInviteRepository.DeleteApplicationInvitesAsync(cmd, ct);
            return default;
        }
        private async Task<IEnumerable<ApplicationInviteDuplicateResponse>> CheckDuplicateAppInvite(ApplicationInvitesCreateRequest request, Guid orgId, CancellationToken cancellationToken)
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

        //application
        public async Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken ct)
        {
            ApplicationCreateResponse result = new();
            request.ApplicationCreateRequest.OrgId = request.OrgId;
            if (request.ApplicationCreateRequest.RequireDuplicateCheck)
            {
                result = await CheckDuplicateApp(request.ApplicationCreateRequest, ct);
                result.IsDuplicateCheckRequired = true;
                if (result.HasPotentialDuplicate)
                {
                    return result;
                }
            }

            string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(request.ApplicationCreateRequest.ConsentFormFile), ct);
            var cmd = _mapper.Map<ApplicationCreateCmd>(request.ApplicationCreateRequest);
            cmd.OrgId = request.OrgId;
            cmd.CreatedByUserId = request.UserId;
            cmd.ConsentFormTempFileKey = fileKey;
            Guid? applicationId = await _applicationRepository.AddApplicationAsync(cmd, ct);
            if (applicationId.HasValue)
            {
                result.ApplicationId = applicationId.Value;
                result.CreateSuccess = true;
            }
            return result;
        }
        public async Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken ct)
        {
            AppFilterBy filterBy = _mapper.Map<AppFilterBy>(request.FilterBy);
            AppSortBy sortBy = _mapper.Map<AppSortBy>(request.SortBy);
            Paging paging = _mapper.Map<Paging>(request.Paging);

            var response = await _applicationRepository.QueryAsync(
                new ApplicationListQry
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = paging
                },
                ct);

            return _mapper.Map<ApplicationListResponse>(response);
        }

        public async Task<ApplicationStatisticsResponse> Handle(ApplicationStatisticsQuery request, CancellationToken ct)
        {
            var qry = _mapper.Map<ApplicationStatisticsQry>(request);
            var response = await _applicationRepository.QueryApplicationStatisticsAsync(qry, ct);

            return _mapper.Map<ApplicationStatisticsResponse>(response);
        }

        private async Task<ApplicationCreateResponse> CheckDuplicateApp(ApplicationCreateRequest request, CancellationToken ct)
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