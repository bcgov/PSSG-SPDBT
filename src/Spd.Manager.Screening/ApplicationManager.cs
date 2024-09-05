using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Retry;
using Spd.Engine.Search;
using Spd.Engine.Validation;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository.Delegates;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Registration;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.TempFileStorage;
using System.Net;

namespace Spd.Manager.Screening

{
    internal partial class ApplicationManager :
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
        IRequestHandler<DelegateListQuery, DelegateListResponse>,
        IRequestHandler<CreateDelegateCommand, DelegateResponse>,
        IRequestHandler<DeleteDelegateCommand, Unit>,
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
        private readonly IMainFileStorageService _fileStorageService;
        private readonly IIncidentRepository _incidentRepository;
        private readonly IDelegateRepository _delegateRepository;
        private readonly IPortalUserRepository _portalUserRepository;
        private readonly ILogger<IApplicationManager> _logger;
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
            IMainFileStorageService fileStorageService,
            IIncidentRepository incidentRepository,
            IDelegateRepository delegateRepository,
            IPortalUserRepository portalUserRepository,
            ILogger<IApplicationManager> logger)
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
            _portalUserRepository = portalUserRepository;
            _logger = logger;
        }

        #region application
        public async Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken ct)
        {
            _logger.LogDebug($"applicationCreateCommand={request}");
            ApplicationCreateResponse result = new();
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
            if (request.ParentOrgId == SpdConstants.BcGovOrgId)
            {
                //add initiator
                await _delegateRepository.ManageAsync(
                    new CreateDelegateCmd()
                    {
                        ApplicationId = applicationId.Value,
                        PSSOUserRoleCode = PSSOUserRoleEnum.Initiator,
                        PortalUserId = request.UserId,
                    }, ct);
            }

            //update status 
            if (IfSubmittedDirectly(request.ApplicationCreateRequest.ServiceType, request.ApplicationCreateRequest.PayeeType, request.ApplicationCreateRequest.HaveVerifiedIdentity ?? false))
            {
                await _applicationRepository.UpdateAsync(
                    new UpdateCmd()
                    {
                        ApplicationId = applicationId.Value,
                        OrgId = request.ApplicationCreateRequest.OrgId,
                        Status = ApplicationStatusEnum.Submitted
                    },
                    ct);
            }
            return result;
        }

        public async Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken ct)
        {
            AppFilterBy filterBy = _mapper.Map<AppFilterBy>(request.FilterBy);
            AppSortBy sortBy = _mapper.Map<AppSortBy>(request.SortBy);
            Paging paging = _mapper.Map<Paging>(request.Paging);
            if (request.IsPSSO)
            {
                filterBy.OrgId = null;
                filterBy.ParentOrgId = SpdConstants.BcGovOrgId;
                filterBy.DelegatePortalUserId = null;
                if (!request.ShowAllPSSOApps)
                {
                    filterBy.DelegatePortalUserId = request.UserId.ToString();
                }
            }

            _logger.LogDebug($"filterBy={filterBy}");
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
            ApplicationResult app = await _applicationRepository.QueryApplicationAsync(new ApplicationQry(request.ApplicationId), ct);
            UpdateCmd updateCmd = new()
            {
                OrgId = request.OrgId,
                ApplicationId = request.ApplicationId,
                Status = null,
                HaveVerifiedIdentity = null
            };
            if (request.Status == IdentityStatusCode.Rejected)
            {
                updateCmd.Status = ApplicationStatusEnum.Cancelled;
            }
            else
            {
                Shared.PayerPreferenceTypeCode? payerPreference = app.PayeeType == null ? null : Enum.Parse<Shared.PayerPreferenceTypeCode>(app.PayeeType.Value.ToString());
                if (IfSubmittedDirectly(Enum.Parse<ServiceTypeCode>(app.ServiceType.Value.ToString()), payerPreference, true))
                {
                    updateCmd.Status = ApplicationStatusEnum.Submitted;
                }
                else
                {
                    if (app.PaidOn != null) //already paid
                        updateCmd.Status = ApplicationStatusEnum.Submitted;
                    else //not paid
                        updateCmd.Status = ApplicationStatusEnum.PaymentPending;
                }
                updateCmd.HaveVerifiedIdentity = true;
            }
            await _applicationRepository.UpdateAsync(updateCmd, ct);
            return default;
        }

        private async Task<ApplicationCreateResponse> CheckDuplicateApp(ApplicationCreateRequest request, CancellationToken ct)
        {
            ApplicationCreateResponse resp = new();

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
            BulkUploadCreateResponse response = new();
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
                throw new ApiException(HttpStatusCode.BadRequest, "No active clearance associated with the clearance id");
            Guid appId = clearanceListResp.Clearances.First().ApplicationId;
            var application = await _applicationRepository.QueryApplicationAsync(new ApplicationQry(appId), ct);
            return _mapper.Map<ApplicationInvitePrepopulateDataResponse>(application);
        }

        public async Task<FileResponse> Handle(ClearanceLetterQuery query, CancellationToken ct)
        {
            DocumentQry qry = new(ClearanceId: query.ClearanceId);
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
            ShareableClearanceResponse response = new();
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
            ApplicationInviteResult? invite = null;
            //check if invite is still valid
            if (command.ApplicationCreateRequest.AppInviteId != null)
            {
                var invites = await _applicationInviteRepository.QueryAsync(
                    new ApplicationInviteQuery()
                    {
                        FilterBy = new AppInviteFilterBy(null, null, AppInviteId: command.ApplicationCreateRequest.AppInviteId)
                    }, ct);
                invite = invites.ApplicationInvites.FirstOrDefault();
                if (invite != null && (invite.Status == ApplicationInviteStatusEnum.Completed || invite.Status == ApplicationInviteStatusEnum.Cancelled || invite.Status == ApplicationInviteStatusEnum.Expired))
                    throw new ArgumentException("Invalid Invite status.");
            }

            var result = new ApplicationCreateResponse();
            var cmd = _mapper.Map<ApplicationCreateCmd>(command.ApplicationCreateRequest);
            cmd.OrgId = command.ApplicationCreateRequest.OrgId;
            cmd.CreatedByApplicantBcscId = command.BcscId;

            if (command.ApplicationCreateRequest.AgreeToShareCrc != null &&
               (bool)command.ApplicationCreateRequest.AgreeToShareCrc &&
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

                //update status 
                if (IfSubmittedDirectly(command.ApplicationCreateRequest.ServiceType, command.ApplicationCreateRequest.PayeeType, command.ApplicationCreateRequest.HaveVerifiedIdentity ?? false))
                {
                    await _applicationRepository.UpdateAsync(
                        new UpdateCmd()
                        {
                            ApplicationId = applicationId.Value,
                            OrgId = command.ApplicationCreateRequest.OrgId,
                            Status = ApplicationStatusEnum.Submitted
                        },
                        ct);
                }

                //if orgId is bc government id, then add invite creator to application delegate as initiator.
                if (cmd.ParentOrgId == SpdConstants.BcGovOrgId)
                {
                    //add initiator
                    if (invite?.CreatedByUserId != null)
                    {
                        await _delegateRepository.ManageAsync(
                            new CreateDelegateCmd()
                            {
                                ApplicationId = applicationId.Value,
                                PSSOUserRoleCode = PSSOUserRoleEnum.Initiator,
                                PortalUserId = (Guid)(invite.CreatedByUserId),
                            }, ct);
                    }
                }
            }

            //inactivate invite
            if (command.ApplicationCreateRequest.AppInviteId != null)
            {
                await _applicationInviteRepository.ManageAsync(
                    new ApplicationInviteUpdateCmd()
                    {
                        ApplicationInviteId = (Guid)command.ApplicationCreateRequest.AppInviteId,
                        OrgId = command.ApplicationCreateRequest.OrgId,
                        ApplicationInviteStatusEnum = ApplicationInviteStatusEnum.Completed
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

            DocumentQry qry = new(query.ApplicationId, contact.ContactId);
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
                CaseSubStatusEnum.SelfDisclosure => FileTypeCode.SelfDisclosure,
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
                throw new ApiException(HttpStatusCode.BadRequest, "The case cannot be found for this application.");

            //dynamics will put the pre-popluated template file in S3 and add record in documentUrl. so, download file from there.
            DocumentQry qry = new()
            {
                CaseId = incidents.Items.First().IncidentId,
                FileType = Enum.Parse<DocumentTypeEnum>(query.FileTemplateType.ToString()),
            };
            DocumentListResp docList = null;
            RetryPolicy<Task<bool>> retryIfNoFound = Policy.HandleResult<Task<bool>>(b => !b.Result)
                .WaitAndRetry(8, waitSec => TimeSpan.FromSeconds(5));
            await retryIfNoFound.Execute(async () =>
            {
                docList = await _documentRepository.QueryAsync(qry, ct);
                if (docList == null || !docList.Items.Any())
                    return false;
                return true;
            });

            if (docList == null || !docList.Items.Any()) return new FileResponse();
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
            return new FileResponse();
        }
        #endregion

        private static bool IfSubmittedDirectly(ServiceTypeCode serviceType, Shared.PayerPreferenceTypeCode? payerPreference, bool IdentityVerified)
        {
            bool noNeedToPay = false;
            if (serviceType == ServiceTypeCode.CRRP_VOLUNTEER) noNeedToPay = true;
            if (serviceType == ServiceTypeCode.PSSO) noNeedToPay = true;
            if (serviceType == ServiceTypeCode.MCFD) noNeedToPay = true;
            if (serviceType == ServiceTypeCode.PSSO_VS) noNeedToPay = true;
            if (serviceType == ServiceTypeCode.PE_CRC || serviceType == ServiceTypeCode.PE_CRC_VS)
            {
                if (payerPreference == Shared.PayerPreferenceTypeCode.Organization || payerPreference == null) noNeedToPay = true;
                else noNeedToPay = false;
            }
            if (serviceType == ServiceTypeCode.CRRP_EMPLOYEE) noNeedToPay = false;
            if (noNeedToPay)
            {
                if (IdentityVerified) return true;
            }

            return false;
        }
    }
}