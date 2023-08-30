using AutoMapper;
using MediatR;
using Spd.Engine.Search;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Resource.Applicants.Delegates;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Incident;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ManagerContract;
using Spd.Utilities.Shared.ResourceContracts;
using Spd.Utilities.TempFileStorage;
using System.Net;

namespace Spd.Manager.Cases.Application
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, ApplicationInvitesCreateResponse>,
        IRequestHandler<ApplicantApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationInviteVerifyCommand, AppOrgResponse>,
        IRequestHandler<ApplicationInviteListQuery, ApplicationInviteListResponse>,
        IRequestHandler<ApplicationInviteDeleteCommand, Unit>,
        IRequestHandler<ApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationListQuery, ApplicationListResponse>,
        IRequestHandler<ApplicationPaymentListQuery, ApplicationPaymentListResponse>,
        IRequestHandler<ApplicationStatisticsQuery, ApplicationStatisticsResponse>,
        IRequestHandler<VerifyIdentityCommand, Unit>,
        IRequestHandler<GetBulkUploadHistoryQuery, BulkHistoryListResponse>,
        IRequestHandler<BulkUploadCreateCommand, BulkUploadCreateResponse>,
        IRequestHandler<ClearanceAccessListQuery, ClearanceAccessListResponse>,
        IRequestHandler<ClearanceAccessDeleteCommand, Unit>,
        IRequestHandler<ClearanceLetterQuery, FileResponse>,
        IRequestHandler<ShareableClearanceQuery, ShareableClearanceResponse>,
        IRequestHandler<ApplicantApplicationListQuery, ApplicantApplicationListResponse>,
        IRequestHandler<ApplicantApplicationQuery, ApplicantApplicationResponse>,
        IRequestHandler<ApplicantApplicationFileQuery, ApplicantApplicationFileListResponse>,
        IRequestHandler<CreateApplicantAppFileCommand, IEnumerable<ApplicantAppFileCreateResponse>>,
        IRequestHandler<PrepopulateFileTemplateQuery, FileResponse>,
        IRequestHandler<GetApplicationInvitePrepopulateDataQuery, ApplicationInvitePrepopulateDataResponse>,
        IApplicationManager
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationInviteRepository _applicationInviteRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        private readonly ITempFileStorageService _tempFile;
        private readonly IDuplicateCheckEngine _duplicateCheckEngine;
        private readonly IIdentityRepository _identityRepository;
        private readonly IDocumentRepository _documentRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IIncidentRepository _incidentRepository;
        private readonly IDelegateRepository _delegateRepository;
        private readonly ISearchEngine _searchEngine;

        public ApplicationManager(IApplicationRepository applicationRepository,
            IApplicationInviteRepository applicationInviteRepository,
            IOrgRepository orgRepository,
            IMapper mapper,
            ITempFileStorageService tempFile,
            IDuplicateCheckEngine duplicateCheckEngine,
            ISearchEngine searchEngine,
            IIdentityRepository identityRepository,
            IDocumentRepository documentUrlRepository,
            IFileStorageService fileStorageService,
            IIncidentRepository incidentRepository,
            IDelegateRepository delegateRepository)
        {
            _applicationRepository = applicationRepository;
            _applicationInviteRepository = applicationInviteRepository;
            _orgRepository = orgRepository;
            _tempFile = tempFile;
            _mapper = mapper;
            _duplicateCheckEngine = duplicateCheckEngine;
            _identityRepository = identityRepository;
            _documentRepository = documentUrlRepository;
            _fileStorageService = fileStorageService;
            _incidentRepository = incidentRepository;
            _delegateRepository = delegateRepository;
            _searchEngine = searchEngine;
        }

        #region application-invite
        public async Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand createCmd, CancellationToken ct)
        {
            var org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(createCmd.OrgId), ct);

            // If not a volunteer org, then the payee type is required
            if (org != null && org.OrgResult.VolunteerOrganizationTypeCode == null)
            {
                if (createCmd.ApplicationInvitesCreateRequest.ApplicationInviteCreateRequests.Any(a => a.PayeeType == null))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, "Payee Type is required");
                }
            }

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
            if (request.ParentOrgId != SpdConstants.BC_GOV_ORG_ID)
            {
                request.ApplicationCreateRequest.OrgId = (Guid)request.ParentOrgId;
            }
            if (request.ApplicationCreateRequest.RequireDuplicateCheck)
            {
                result = await CheckDuplicateApp(request.ApplicationCreateRequest, ct);
                result.IsDuplicateCheckRequired = true;
                if (result.HasPotentialDuplicate)
                {
                    return result;
                }
            }

            SpdTempFile? spdTempFile = null;
            if (request.ConsentFormFile != null)
            {
                //psso does not have consent form
                string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(request.ConsentFormFile), ct);
                spdTempFile = new()
                {
                    TempFileKey = fileKey,
                    ContentType = request.ConsentFormFile.ContentType,
                    FileName = request.ConsentFormFile.FileName,
                    FileSize = request.ConsentFormFile.Length,
                };
            }
            var cmd = _mapper.Map<ApplicationCreateCmd>(request.ApplicationCreateRequest);
            cmd.CreatedByUserId = request.UserId;
            if (request.ParentOrgId == SpdConstants.BC_GOV_ORG_ID)
                cmd.ParentOrgId = request.ParentOrgId;
            Guid? applicationId = await _applicationRepository.AddApplicationAsync(cmd, ct);
            if (applicationId.HasValue && spdTempFile != null)
            {
                await _documentRepository.ManageAsync(new CreateDocumentCmd
                {
                    TempFile = spdTempFile,
                    ApplicationId = (Guid)applicationId,
                    DocumentType = DocumentTypeEnum.ApplicantConsentForm,
                }, ct);
            }
            result.ApplicationId = applicationId.Value;
            result.CreateSuccess = true;

            //if it is PSSO, add hiring manager
            if (request.ParentOrgId == SpdConstants.BC_GOV_ORG_ID)
            {
                //add hiring manager
                await _delegateRepository.ManageAsync(
                    new CreateDelegateCmd()
                    {
                        ApplicationId = applicationId.Value,
                        PSSOUserRoleCode = PSSOUserRoleEnum.HiringManager,
                        PortalUserId = request.UserId,
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

        public async Task<ApplicationPaymentListResponse> Handle(ApplicationPaymentListQuery request, CancellationToken ct)
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

            return _mapper.Map<ApplicationPaymentListResponse>(response);
        }

        public async Task<ApplicationStatisticsResponse> Handle(ApplicationStatisticsQuery request, CancellationToken ct)
        {
            var qry = _mapper.Map<ApplicationStatisticsQry>(request);
            var response = await _applicationRepository.QueryApplicationStatisticsAsync(qry, ct);

            return _mapper.Map<ApplicationStatisticsResponse>(response);
        }

        public async Task<Unit> Handle(VerifyIdentityCommand request, CancellationToken ct)
        {
            var cmd = _mapper.Map<VerifyIdentityCmd>(request);
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
        public async Task<ClearanceAccessListResponse> Handle(ClearanceAccessListQuery request, CancellationToken ct)
        {
            ClearanceAccessFilterBy filterBy = _mapper.Map<ClearanceAccessFilterBy>(request.FilterBy);
            ClearanceAccessSortBy sortBy = _mapper.Map<ClearanceAccessSortBy>(request.SortBy);
            Paging paging = _mapper.Map<Paging>(request.Paging);

            var response = await _applicationRepository.QueryAsync(
                new ClearanceAccessListQry
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = paging
                },
                ct);

            return _mapper.Map<ClearanceAccessListResponse>(response);

        }

        public async Task<Unit> Handle(ClearanceAccessDeleteCommand request, CancellationToken ct)
        {
            var cmd = _mapper.Map<ClearanceAccessDeleteCmd>(request);
            await _applicationRepository.DeleteClearanceAccessAsync(cmd, ct);
            return default;
        }

        public async Task<ApplicationInvitePrepopulateDataResponse> Handle(GetApplicationInvitePrepopulateDataQuery request, CancellationToken ct)
        {
            var clearanceListResp = await _applicationRepository.QueryAsync(new ClearanceQry(ClearanceId: request.ClearanceId), ct);
            if (!clearanceListResp.Clearances.Any())
                throw new ApiException(HttpStatusCode.BadRequest, "do active clearance associated with the clearance id");
            Guid appId = clearanceListResp.Clearances.First().ApplicationId;
            var application = await _applicationRepository.QueryApplicationAsync(new ApplicationQry(appId), ct);
            return _mapper.Map<ApplicationInvitePrepopulateDataResponse>(application);
        }

        public async Task<FileResponse> Handle(ClearanceLetterQuery query, CancellationToken ct)
        {
            DocumentQry qry = new DocumentQry(ClearanceId: query.ClearanceId);
            var docList = await _documentRepository.QueryAsync(qry, ct);
            if (docList == null || !docList.Items.Any())
                return new FileResponse();

            var docUrl = docList.Items.OrderByDescending(f => f.UploadedDateTime).FirstOrDefault();
            FileQueryResult fileResult = (FileQueryResult)await _fileStorageService.HandleQuery(
                new FileQuery { Key = docUrl.DocumentUrlId.ToString(), Folder = $"spd_clearance/{docUrl.ClearanceId}" },
                ct);
            return new FileResponse
            {
                Content = fileResult.File.Content,
                ContentType = fileResult.File.ContentType,
                FileName = fileResult.File.FileName
            };
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
        public async Task<ApplicationCreateResponse> Handle(ApplicantApplicationCreateCommand command, CancellationToken ct)
        {
            //todo: add check if invite is still valid

            var result = new ApplicationCreateResponse();
            var cmd = _mapper.Map<ApplicationCreateCmd>(command.ApplicationCreateRequest);
            cmd.OrgId = command.ApplicationCreateRequest.OrgId;
            cmd.CreatedByApplicantBcscId = command.BcscId;

            if (command.ApplicationCreateRequest.AgreeToShare != null &&
               (bool)command.ApplicationCreateRequest.AgreeToShare &&
               cmd.SharedClearanceId.HasValue &&
               cmd.CreatedByApplicantBcscId != null)//bcsc authenticated and has sharable clearance
            {
                var contacts = await _identityRepository.Query(new IdentityQry(cmd.CreatedByApplicantBcscId, null, IdentityProviderTypeEnum.BcServicesCard), ct);
                var contact = contacts.Items.FirstOrDefault();
                if (contact == null)
                    throw new ArgumentException("No contact found");
                cmd.ContactId = contact.ContactId;
                await _applicationRepository.ProcessAppWithSharableClearanceAsync(cmd, ct);
                result.CreateSuccess = true;
                result.ApplicationId = null;
            }
            else
            {
                //no sharable clearance
                Guid? applicationId = await _applicationRepository.AddApplicationAsync(cmd, ct);
                if (applicationId.HasValue)
                {
                    result.ApplicationId = applicationId.Value;
                    result.CreateSuccess = true;
                }
            }

            if (command.ApplicationCreateRequest.AppInviteId != null)
            {
                await _applicationInviteRepository.DeleteApplicationInvitesAsync(
                    new ApplicationInviteDeleteCmd()
                    {
                        ApplicationInviteId = (Guid)command.ApplicationCreateRequest.AppInviteId,
                        OrgId = command.ApplicationCreateRequest.OrgId,
                    }, ct);
            }
            return result;
        }

        public async Task<ApplicantApplicationListResponse> Handle(ApplicantApplicationListQuery request, CancellationToken cancellationToken)
        {
            var query = new ApplicantApplicationListQry();
            query.ApplicantId = request.ApplicantId;
            var response = await _applicationRepository.QueryApplicantApplicationListAsync(query, cancellationToken);
            return _mapper.Map<ApplicantApplicationListResponse>(response);
        }

        public async Task<ApplicantApplicationResponse> Handle(ApplicantApplicationQuery request, CancellationToken cancellationToken)
        {
            var response = await _applicationRepository.QueryApplicationAsync(new ApplicationQry(request.ApplicationId), cancellationToken);
            return _mapper.Map<ApplicantApplicationResponse>(response);
        }

        public async Task<ApplicantApplicationFileListResponse> Handle(ApplicantApplicationFileQuery query, CancellationToken ct)
        {
            var contacts = await _identityRepository.Query(new IdentityQry(query.BcscId, null, IdentityProviderTypeEnum.BcServicesCard), ct);
            var contact = contacts.Items.FirstOrDefault();
            if (contact == null)
                throw new ArgumentException("No contact found");

            DocumentQry qry = new DocumentQry(query.ApplicationId, contact.ContactId);
            var docList = await _documentRepository.QueryAsync(qry, ct);

            return new ApplicantApplicationFileListResponse
            {
                Items = _mapper.Map<IEnumerable<ApplicantApplicationFileResponse>>(docList.Items)
            };
        }

        public async Task<IEnumerable<ApplicantAppFileCreateResponse>> Handle(CreateApplicantAppFileCommand command, CancellationToken ct)
        {
            var contacts = await _identityRepository.Query(new IdentityQry(command.BcscId, null, IdentityProviderTypeEnum.BcServicesCard), ct);
            var contact = contacts.Items.FirstOrDefault();
            if (contact == null)
                throw new ArgumentException("No contact found");

            //validate the application is in correct state.
            ApplicationResult app = await _applicationRepository.QueryApplicationAsync(new ApplicationQry(command.ApplicationId), ct);
            FileTypeCode? validFileCode = app.CaseSubStatus switch
            {
                CaseSubStatusEnum.ApplicantInformation => FileTypeCode.ApplicantInformation,
                CaseSubStatusEnum.StatutoryDeclaration => FileTypeCode.StatutoryDeclaration,
                CaseSubStatusEnum.OpportunityToRespond => FileTypeCode.OpportunityToRespond,
                _ => throw new ArgumentException("Invalid File Type")
            };
            if (validFileCode != command.Request.FileType)
                throw new ArgumentException("Invalid File Type");

            //put file to cache
            IList<DocumentResp> docResps = new List<DocumentResp>();
            foreach (var file in command.Request.Files)
            {
                string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(file), ct);
                SpdTempFile spdTempFile = new()
                {
                    TempFileKey = fileKey,
                    ContentType = file.ContentType,
                    FileName = file.FileName,
                    FileSize = file.Length,
                };

                //create bcgov_documenturl and file
                var docResp = await _documentRepository.ManageAsync(new CreateDocumentCmd
                {
                    TempFile = spdTempFile,
                    ApplicationId = command.ApplicationId,
                    DocumentType = Enum.Parse<DocumentTypeEnum>(command.Request.FileType.ToString()),
                    SubmittedByApplicantId = contact.ContactId
                }, ct);
                docResps.Add(docResp);
            }

            //update application status to InProgress, substatus to InReview
            await _incidentRepository.ManageAsync(
                new UpdateIncidentCmd
                {
                    ApplicationId = command.ApplicationId,
                    CaseStatus = CaseStatusEnum.InProgress,
                    CaseSubStatus = CaseSubStatusEnum.InReview
                },
                ct);
            return _mapper.Map<IEnumerable<ApplicantAppFileCreateResponse>>(docResps);
        }

        public async Task<FileResponse> Handle(PrepopulateFileTemplateQuery query, CancellationToken ct)
        {
            //get caseId from applicationId
            var incidents = await _incidentRepository.QueryAsync(new IncidentQry { ApplicationId = query.ApplicationId }, ct);
            if (incidents.Items.Count() <= 0)
                throw new ApiException(HttpStatusCode.BadRequest, "cannot find the case for this application.");

            //dynamics will put the pre-popluated template file in S3 and add record in documentUrl. so, download file from there.
            var docList = await _documentRepository.QueryAsync(new DocumentQry
            {
                CaseId = incidents.Items.First().IncidentId,
                FileType = Enum.Parse<DocumentTypeEnum>(query.FileTemplateType.ToString()),
            }, ct);

            var docUrl = docList.Items.OrderByDescending(f => f.UploadedDateTime).FirstOrDefault();

            if (docUrl != null)
            {
                FileQueryResult fileResult = (FileQueryResult)await _fileStorageService.HandleQuery(
                    new FileQuery { Key = docUrl.DocumentUrlId.ToString(), Folder = $"incident/{docUrl.CaseId}" }, //need confirm with dynamics.
                    ct);
                return new FileResponse
                {
                    Content = fileResult.File.Content,
                    ContentType = fileResult.File.ContentType,
                    FileName = fileResult.File.FileName
                };
            }
            throw new ApiException(HttpStatusCode.NoContent, "No file found.");
        }
        #endregion


    }
}