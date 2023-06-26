using AutoMapper;
using MediatR;
using Spd.Engine.Search;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Utilities.Shared.ResourceContracts;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, ApplicationInvitesCreateResponse>,
        IRequestHandler<ApplicantApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationInviteVerifyCommand, AppOrgResponse>,
        IRequestHandler<ApplicationInviteListQuery, ApplicationInviteListResponse>,
        IRequestHandler<ApplicationInviteDeleteCommand, Unit>,
        IRequestHandler<ApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationListQuery, ApplicationListResponse>,
        IRequestHandler<ApplicationStatisticsQuery, ApplicationStatisticsResponse>,
        IRequestHandler<IdentityCommand, Unit>,
        IRequestHandler<GetBulkUploadHistoryQuery, BulkHistoryListResponse>,
        IRequestHandler<BulkUploadCreateCommand, BulkUploadCreateResponse>,
        IRequestHandler<ClearanceListQuery, ClearanceListResponse>,
        IRequestHandler<ClearanceAccessDeleteCommand, Unit>,
        IRequestHandler<ClearanceLetterQuery, ClearanceLetterResponse>,
        IRequestHandler<ShareableClearanceQuery, ShareableClearanceResponse>,
        IRequestHandler<ApplicantApplicationListQuery, ApplicantApplicationListResponse>,
        IRequestHandler<ApplicantApplicationQuery, ApplicantApplicationResponse>,
        IApplicationManager
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationInviteRepository _applicationInviteRepository;
        private readonly IMapper _mapper;
        private readonly ITempFileStorageService _tempFile;
        private readonly IDuplicateCheckEngine _duplicateCheckEngine;
        private readonly ISearchEngine _searchEngine;

        public ApplicationManager(IApplicationRepository applicationRepository,
            IApplicationInviteRepository applicationInviteRepository,
            IMapper mapper,
            ITempFileStorageService tempFile,
            IDuplicateCheckEngine duplicateCheckEngine,
            ISearchEngine searchEngine)
        {
            _applicationRepository = applicationRepository;
            _applicationInviteRepository = applicationInviteRepository;
            _tempFile = tempFile;
            _mapper = mapper;
            _duplicateCheckEngine = duplicateCheckEngine;
            _searchEngine = searchEngine;
        }

        #region application-invite
        public async Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand createCmd, CancellationToken ct)
        {
            ApplicationInvitesCreateResponse resp = new(createCmd.OrgId);
            if (createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck)
            {
                var checks = _mapper.Map<IEnumerable<AppInviteDuplicateCheck>>(createCmd.ApplicationInvitesCreateRequest.ApplicationInviteCreateRequests);
                var duplicateResp = (AppInviteDuplicateCheckResponse)await _duplicateCheckEngine.DuplicateCheckAsync(
                    new AppInviteDuplicateCheckRequest(checks, createCmd.OrgId),
                    ct
                    );
                resp.IsDuplicateCheckRequired = createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck;
                resp.DuplicateResponses = _mapper.Map<IEnumerable<ApplicationInviteDuplicateResponse>>(duplicateResp.AppInviteCheckResults);
                if (duplicateResp.AppInviteCheckResults.Any(r => r.HasPotentialDuplicate))
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
        public async Task<AppOrgResponse> Handle(ApplicationInviteVerifyCommand request, CancellationToken ct)
        {
            var result = await _applicationInviteRepository.VerifyApplicationInvitesAsync(
                 new ApplicationInviteVerifyCmd(request.AppInvitesVerifyRequest.InviteEncryptedCode),
                 ct);
            return _mapper.Map<AppOrgResponse>(result);
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

        public async Task<ApplicationCreateResponse> Handle(ApplicantApplicationCreateCommand request, CancellationToken ct)
        {
            var result = new ApplicationCreateResponse();
            var cmd = _mapper.Map<ApplicationCreateCmd>(request.ApplicationCreateRequest);
            cmd.OrgId = request.ApplicationCreateRequest.OrgId;
            cmd.ConsentFormTempFile = null;
            cmd.CreatedByApplicantSub = request.ApplicantSub;
            Guid? applicationId = await _applicationRepository.AddApplicationAsync(cmd, ct);
            if (applicationId.HasValue)
            {
                result.ApplicationId = applicationId.Value;
                result.CreateSuccess = true;
            }

            if (request.ApplicationCreateRequest.AppInviteId != null)
            {
                await _applicationInviteRepository.DeleteApplicationInvitesAsync(
                    new ApplicationInviteDeleteCmd()
                    {
                        ApplicationInviteId = (Guid)request.ApplicationCreateRequest.AppInviteId,
                        OrgId = request.ApplicationCreateRequest.OrgId,
                    }, ct);
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

        public async Task<Unit> Handle(IdentityCommand request, CancellationToken ct)
        {
            var cmd = _mapper.Map<IdentityCmd>(request);
            await _applicationRepository.IdentityAsync(cmd, ct);
            return default;
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

        public async Task<ClearanceLetterResponse> Handle(ClearanceLetterQuery query, CancellationToken ct)
        {
            ClearanceLetterResp letter = await _applicationRepository.QueryLetterAsync(new ClearanceLetterQry(query.ClearanceId), ct);
            return _mapper.Map<ClearanceLetterResponse>(letter);
        }

        public async Task<ShareableClearanceResponse> Handle(ShareableClearanceQuery query, CancellationToken ct)
        {
            ShareableClearanceResponse response = new ShareableClearanceResponse();
            ShareableClearanceSearchResponse searchResponse = (ShareableClearanceSearchResponse)await _searchEngine.SearchAsync(new ShareableClearanceSearchRequest(query.OrgId, query.BcscId, query.ServiceType), ct);

            if (searchResponse.Items.Any())
            {
                response.Items = new List<ShareableClearanceItem>()
                {
                    _mapper.Map<ShareableClearanceItem>(searchResponse.Items.OrderByDescending(c => c.GrantedDate).FirstOrDefault())
                };
            }

            return response;
        }
        #endregion

        #region applicant-applications

        public async Task<ApplicantApplicationListResponse> Handle(ApplicantApplicationListQuery request, CancellationToken cancellationToken)
        {
            var query = new ApplicantApplicationListQry();
            query.ApplicantId = request.ApplicantId;
            var response = await _applicationRepository.QueryApplicantApplicationListAsync(query, cancellationToken);
            return _mapper.Map<ApplicantApplicationListResponse>(response);
        }

        public async Task<ApplicantApplicationResponse> Handle(ApplicantApplicationQuery request, CancellationToken cancellationToken)
        {
            var query = new ApplicantApplicationQry();
            query.ApplicantId = request.ApplicantId;
            query.ApplicationId = request.ApplicationId;
            var response = await _applicationRepository.QueryApplicantApplicationAsync(query, cancellationToken);
            return _mapper.Map<ApplicantApplicationResponse>(response);
        }

        #endregion
    }
}