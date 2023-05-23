using AutoMapper;
using MediatR;
using Spd.Engine.Validation;
using Spd.Resource.Applicants;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, ApplicationInvitesCreateResponse>,
        IRequestHandler<ApplicationInviteListQuery, ApplicationInviteListResponse>,
        IRequestHandler<ApplicationInviteDeleteCommand, Unit>,
        IRequestHandler<ApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationListQuery, ApplicationListResponse>,
        IRequestHandler<ApplicationStatisticsQuery, ApplicationStatisticsResponse>,
        IRequestHandler<IdentityCommand, bool>,
        IRequestHandler<GetBulkUploadHistoryQuery, BulkHistoryListResponse>,
        IRequestHandler<BulkUploadCreateCommand, BulkUploadCreateResponse>,
        IRequestHandler<ClearanceListQuery, ClearanceListResponse>,
        IRequestHandler<ClearanceAccessDeleteCommand, Unit>,
        IApplicationManager
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationInviteRepository _applicationInviteRepository;
        private readonly IMapper _mapper;
        private readonly ITempFileStorageService _tempFile;
        private readonly IDuplicateCheckEngine _duplicateCheckEngine;

        public ApplicationManager(IApplicationRepository applicationRepository,
            IApplicationInviteRepository applicationInviteRepository,
            IMapper mapper,
            ITempFileStorageService tempFile,
            IDuplicateCheckEngine duplicateCheckEngine)
        {
            _applicationRepository = applicationRepository;
            _applicationInviteRepository = applicationInviteRepository;
            _tempFile = tempFile;
            _mapper = mapper;
            _duplicateCheckEngine = duplicateCheckEngine;
        }

        #region application-invite
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
        #endregion

        #region application
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

            string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(request.ConsentFormFile), ct);
            SpdTempFile spdTempFile = new()
            {
                TempFileKey = fileKey,
                ContentType = request.ConsentFormFile.ContentType,
                FileName = request.ConsentFormFile.FileName,
                FileSize = request.ConsentFormFile.Length,
            };
            var cmd = _mapper.Map<ApplicationCreateCmd>(request.ApplicationCreateRequest);
            cmd.OrgId = request.OrgId;
            cmd.CreatedByUserId = request.UserId;
            cmd.ConsentFormTempFile = spdTempFile;
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

        public async Task<bool> Handle(IdentityCommand request, CancellationToken ct)
        {
            var cmd = _mapper.Map<IdentityCmd>(request);
            return await _applicationRepository.IdentityAsync(cmd, ct);
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

        #endregion

        #region bulk upload
        public async Task<BulkHistoryListResponse> Handle(GetBulkUploadHistoryQuery request, CancellationToken ct)
        {
            Paging paging = _mapper.Map<Paging>(request.Paging);
            var result = await _applicationRepository.QueryBulkHistoryAsync(
                new BulkHistoryListQry()
                {
                    OrgId = request.OrgId,
                    SortBy = new BulkHistorySortBy(request.SortBy == null || request.SortBy.Equals("-submittedOn", StringComparison.InvariantCultureIgnoreCase)),
                    Paging = paging
                },
                ct);
            return _mapper.Map<BulkHistoryListResponse>(result);
        }

        public async Task<BulkUploadCreateResponse> Handle(BulkUploadCreateCommand cmd, CancellationToken ct)
        {
            BulkUploadCreateResponse response = new BulkUploadCreateResponse();
            if (cmd.BulkUploadCreateRequest.RequireDuplicateCheck)
            {
                var checks = _mapper.Map<IEnumerable<AppBulkDuplicateCheck>>(cmd.BulkUploadCreateRequest.ApplicationCreateRequests);
                var dupResults = (BulkUploadAppDuplicateCheckResponse)await _duplicateCheckEngine.DuplicateCheckAsync(new BulkUploadAppDuplicateCheckRequest(checks), ct);
                response.DuplicateCheckResponses = _mapper.Map<IEnumerable<DuplicateCheckResult>>(dupResults.BulkDuplicateChecks);
            }

            //if no duplicate found or no need to check
            bool hasDuplicates = response.DuplicateCheckResponses.Any(r => r.HasPotentialDuplicate);
            if (!hasDuplicates || !cmd.BulkUploadCreateRequest.RequireDuplicateCheck)
            {
                var cmds = _mapper.Map<IEnumerable<ApplicationCreateCmd>>(cmd.BulkUploadCreateRequest.ApplicationCreateRequests);
                var createResp = await _applicationRepository.AddBulkAppsAsync(
                    new BulkAppsCreateCmd
                    {
                        CreateApps = cmds,
                        FileName = cmd.BulkUploadCreateRequest.FileName,
                        FileSize = cmd.BulkUploadCreateRequest.FileSize,
                        UserId = cmd.UserId,
                        OrgId = cmd.OrgId
                    }, ct);
                response.CreateResponse = _mapper.Map<BulkAppsCreateResponse>(createResp);
            }
            return response;
        }
        #endregion

        #region clearances
        public async Task<ClearanceListResponse> Handle(ClearanceListQuery request, CancellationToken ct)
        {
            ClearanceFilterBy filterBy = _mapper.Map<ClearanceFilterBy>(request.FilterBy);
            ClearanceSortBy sortBy = _mapper.Map<ClearanceSortBy>(request.SortBy);
            Paging paging = _mapper.Map<Paging>(request.Paging);

            var response = await _applicationRepository.QueryAsync(
                new ClearanceListQry
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = paging
                },
                ct);

            return _mapper.Map<ClearanceListResponse>(response);

        }

        public async Task<Unit> Handle(ClearanceAccessDeleteCommand request, CancellationToken ct)
        {
            var cmd = _mapper.Map<ClearanceAccessDeleteCmd>(request);
            await _applicationRepository.DeleteClearanceAccessAsync(cmd, ct);
            return default;
        }
        #endregion
    }
}