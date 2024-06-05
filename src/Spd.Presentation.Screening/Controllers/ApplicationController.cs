using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Screening;
using Spd.Manager.Shared;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Globalization;
using System.Security.Principal;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spd.Presentation.Screening.Controllers
{
    [Authorize(Roles = "Primary,Contact,BCGovStaff")]
    public class ApplicationController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IValidator<ApplicationCreateRequest> _appCreateRequestValidator;
        private readonly IValidator<ApplicationCreateRequestFromBulk> _appCreateRequestFromBulkValidator;
        private readonly IConfiguration _configuration;
        private readonly IPrincipal _currentUser;
        private readonly ILogger<ApplicationController> _logger;

        public ApplicationController(IMediator mediator,
            IValidator<ApplicationCreateRequest> appCreateRequestValidator,
            IValidator<ApplicationCreateRequestFromBulk> appCreateRequestFromBulkValidator,
            IConfiguration configuration,
            IPrincipal currentUser,
            ILogger<ApplicationController> logger)
        {
            _mediator = mediator;
            _appCreateRequestValidator = appCreateRequestValidator;
            _appCreateRequestFromBulkValidator = appCreateRequestFromBulkValidator;
            _configuration = configuration;
            _currentUser = currentUser;
            _logger = logger;
        }

        #region application-invites

        /// <summary>
        /// create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
        /// </summary>
        /// <param name="invitesCreateRequest"></param>
        /// <param name="orgId">organizationId, for PSSO, it should be BC Gov hard coded id.</param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-invites")]
        [HttpPost]
        public async Task<ApplicationInvitesCreateResponse> AddApplicationInvites([FromBody][Required] ApplicationInvitesCreateRequest invitesCreateRequest, [FromRoute] Guid orgId)
        {
            var userId = _currentUser.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            if (hostUrl == null)
                throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");
            invitesCreateRequest.HostUrl = hostUrl;
            return await _mediator.Send(new ApplicationInviteCreateCommand(invitesCreateRequest, orgId, Guid.Parse(userId), _currentUser.IsPSA()));
        }

        /// <summary>
        /// get the active application invites list.
        /// support wildcard search for email and name, it will search email or name contains str.
        /// sample: /application-invites?filters=searchText@=str
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="filters"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-invites")]
        [HttpGet]
        public async Task<ApplicationInviteListResponse> GetInvitesList([FromRoute] Guid orgId, [FromQuery] string? filters, [FromQuery] uint? page, [FromQuery] uint? pageSize)
        {
            bool isPSSO = false;
            bool isPSA = false;
            Guid? idirUserId = null;

            string? identityProvider = _currentUser.GetIdentityProvider();
            if (identityProvider != null && identityProvider.Equals("idir", StringComparison.InvariantCultureIgnoreCase))
            {
                idirUserId = Guid.Parse(_currentUser.GetUserId());
                isPSA = _currentUser.IsPSA();
                isPSSO = true;
            }
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            PaginationRequest pagination = new((int)page, (int)pageSize);

            string? filterValue = null;
            if (!string.IsNullOrWhiteSpace(filters))
            {
                try
                {
                    var strs = filters.Split("@=");
                    if (strs[0].Equals("searchText", StringComparison.InvariantCultureIgnoreCase))
                        filterValue = strs[1];
                }
                catch
                {
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "invalid filtering string.");
                }
            }
            AppInviteListFilterBy filterBy = new(orgId, EmailOrNameContains: filterValue);
            AppInviteListSortBy sortBy = new(SubmittedDateDesc: true);

            return await _mediator.Send(new ApplicationInviteListQuery()
            {
                FilterBy = filterBy,
                SortBy = sortBy,
                Paging = pagination,
                IsPSSO = isPSSO,
                UserId = idirUserId,
                IsPSA = isPSA
            });
        }

        /// <summary>
        /// remove the invitation for a organization
        /// </summary>
        /// <param name="applicationInviteId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-invites/{applicationInviteId}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteAsync([FromRoute] Guid applicationInviteId, [FromRoute] Guid orgId)
        {
            await _mediator.Send(new ApplicationInviteDeleteCommand(orgId, applicationInviteId));
            return Ok();
        }
        #endregion

        #region bulk-upload

        /// <summary>
        /// return all bulk upload history belong to the organization.
        /// sort: submittedon, default will be desc
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="sorts"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/applications/bulk/history")]
        [HttpGet]
        public async Task<BulkHistoryListResponse> GetBulkUploadHistoryList([FromRoute] Guid orgId, [FromQuery] string? sorts, [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            if (string.IsNullOrWhiteSpace(sorts)) sorts = "-submittedOn";
            PaginationRequest pagination = new((int)page, (int)pageSize);
            return await _mediator.Send(new GetBulkUploadHistoryQuery(orgId)
            {
                SortBy = sorts,
                Paging = pagination
            });
        }

        /// <summary>
        /// create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
        /// </summary>
        /// <param name="bulkUploadRequest"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/applications/bulk")]
        [HttpPost]
        public async Task<BulkUploadCreateResponse> BulkUpload([FromForm][Required] BulkUploadRequest bulkUploadRequest, [FromRoute] Guid orgId, CancellationToken ct)
        {
            var userId = this.HttpContext.User.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);

            //validation file
            string fileName = bulkUploadRequest.File.FileName;
            string exe = fileName.Split(".").Last();
            if (!SpdConstants.BulkAppUploadFileExtensions.Contains(exe))
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"file uploaded does not supported.");
            }
            long fileSize = bulkUploadRequest.File.Length;
            if (fileSize > SpdConstants.UploadFileMaxSize)
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"max supported file size is {SpdConstants.UploadFileMaxSize}.");
            }

            //parse file
            var (applications, validationErrs) = await ParseBulkUploadFileAsync(bulkUploadRequest.File, orgId, ct);
            if (validationErrs.Any())
            {
                return new BulkUploadCreateResponse() { ValidationErrs = validationErrs };
            }

            var result = await _mediator.Send(new BulkUploadCreateCommand(
                new BulkUploadCreateRequest(fileName, fileSize, applications, bulkUploadRequest.RequireDuplicateCheck),
                orgId,
                Guid.Parse(userId)));
            return result;
        }
        private async Task<(IEnumerable<ApplicationCreateRequestFromBulk>, IEnumerable<ValidationErr>)> ParseBulkUploadFileAsync(IFormFile bulkFile, Guid orgId, CancellationToken ct)
        {
            IList<ValidationErr> errors = new List<ValidationErr>();
            IList<ApplicationCreateRequestFromBulk> list = new List<ApplicationCreateRequestFromBulk>();
            if (bulkFile.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    bulkFile.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    string s = Encoding.UTF8.GetString(fileBytes);
                    var lines = s.Split('\n');
                    int lineNo = 1;
                    foreach (string line in lines)
                    {
                        if (string.IsNullOrWhiteSpace(line)) continue;
                        ApplicationCreateRequestFromBulk oneRequest = new();
                        AliasCreateRequest[] aliases = new AliasCreateRequest[3];
                        oneRequest.LineNumber = lineNo;
                        try
                        {
                            string[] data = line.Split(SpdConstants.BulkAppUploadColSeperator);
                            oneRequest.OrgId = orgId;
                            oneRequest.Surname = CleanString(data[0]);
                            oneRequest.GivenName = CleanString(data[1]);
                            oneRequest.MiddleName1 = CleanString(data[2]);
                            aliases[0] = new AliasCreateRequest();
                            aliases[0].Surname = CleanString(data[3]);
                            aliases[0].GivenName = CleanString(data[4]);
                            aliases[0].MiddleName1 = CleanString(data[5]);
                            aliases[1] = new AliasCreateRequest();
                            aliases[1].Surname = CleanString(data[6]);
                            aliases[1].GivenName = CleanString(data[7]);
                            aliases[1].MiddleName1 = CleanString(data[8]);
                            aliases[2] = new AliasCreateRequest();
                            aliases[2].Surname = CleanString(data[9]);
                            aliases[2].GivenName = CleanString(data[10]);
                            aliases[2].MiddleName1 = CleanString(data[11]);
                            oneRequest.AddressLine1 = CleanString(data[12]);
                            oneRequest.AddressLine2 = CleanString(data[13]);
                            oneRequest.City = CleanString(data[14]);
                            oneRequest.Province = CleanString(data[15]);
                            oneRequest.Country = CleanString(data[16]);
                            oneRequest.PostalCode = PostalCodeCleanup(CleanString(data[17]));
                            oneRequest.PhoneNumber = PhoneNumberCleanup(CleanString(data[18]));
                            oneRequest.BirthPlace = CleanString(data[19]);
                            string? birthDateStr = CleanString(data[20]);
                            if (string.IsNullOrEmpty(birthDateStr))
                                oneRequest.DateOfBirth = null;
                            else
                                oneRequest.DateOfBirth = DateOnly.ParseExact(birthDateStr, SpdConstants.BulkAppUploadBirthdateFormat, CultureInfo.InvariantCulture);
                            string? genderStr = CleanString(data[21]);
                            oneRequest.GenderCode = string.IsNullOrEmpty(genderStr) ? GenderCode.U : Enum.Parse<GenderCode>(genderStr);
                            oneRequest.LicenceNo = CleanString(data[22]);
                            oneRequest.DriversLicense = CleanString(data[23]);
                            oneRequest.AgreeToCompleteAndAccurate = true;
                            oneRequest.HaveVerifiedIdentity = true;
                            oneRequest.OriginTypeCode = ApplicationOriginTypeCode.GenericUpload;
                            oneRequest.PayeeType = PayerPreferenceTypeCode.Organization;
                            List<AliasCreateRequest> aliasCreates = new();
                            foreach (AliasCreateRequest a in aliases)
                            {
                                if (!string.IsNullOrWhiteSpace(a.Surname))
                                    aliasCreates.Add(a);
                            };
                            oneRequest.Aliases = aliasCreates.AsEnumerable();
                            var validateResult = await _appCreateRequestFromBulkValidator.ValidateAsync(oneRequest, ct);
                            if (!validateResult.IsValid)
                            {
                                ValidationErr err = new(lineNo,
                                    string.Join(";", validateResult.Errors.Select(e => e.ErrorMessage)));
                                errors.Add(err);
                            }

                            list.Add(oneRequest);
                        }
                        catch (Exception ex)
                        {
                            ValidationErr err = new(lineNo, ex.Message);
                            errors.Add(err);
                        }
                        lineNo++;
                    }
                }
            }

            return (list.AsEnumerable(), errors);
        }

        private string? CleanString(string? str)
        {
            if (str == null) return null;
            return str.Replace("\"", string.Empty).Trim();
        }

        private string? PhoneNumberCleanup(string? str)
        {
            if (str == null) return null;
            return str.Replace(",", string.Empty)
               .Replace("-", string.Empty)
               .Replace("(", string.Empty)
               .Replace(")", string.Empty)
               .Replace(" ", string.Empty);
        }

        private string? PostalCodeCleanup(string? str)
        {
            if (str == null) return null;
            return str.Replace("-", string.Empty)
               .Replace(" ", string.Empty);
        }

        #endregion

        #region application

        /// <summary>
        /// return the application statistics for a particular organization.
        /// </summary>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-statistics")]
        [HttpGet]
        public async Task<ApplicationStatisticsResponse> GetAppStatsListForOrg([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new ApplicationStatisticsQuery(orgId));
        }

        /// <summary>
        /// return the application statistics for a particular delegate.
        /// </summary>
        /// <param name="delegateUserId"></param>
        /// <returns></returns>
        [Route("api/users/{delegateUserId}/psso-application-statistics")]
        [HttpGet]
        public async Task<ApplicationStatisticsResponse> GetAppStatsListForDelegate([FromRoute] Guid delegateUserId)
        {
            return await _mediator.Send(new ApplicationStatisticsQuery(null, delegateUserId));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/identity/{applicationId}")]
        [HttpPut]
        public async Task<ActionResult> IdentityVerify([FromRoute] Guid applicationId, [FromRoute] Guid orgId, [FromQuery] IdentityStatusCode status)
        {
            await _mediator.Send(new VerifyIdentityCommand(orgId, applicationId, status));
            return Ok();
        }

        /// <summary>
        /// create application. if checkDuplicate is true, it will check if there is existing duplicated applications 
        /// </summary>
        /// <param name="createApplication"></param>
        /// <param name="orgId">organizationId</param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application")]
        [HttpPost]
        public async Task<ApplicationCreateResponse> AddApplication([FromForm][Required] CreateApplication createApplication, [FromRoute] Guid orgId)
        {

            bool isPSSO = false;

            string? identityProvider = _currentUser.GetIdentityProvider();
            if (identityProvider != null && identityProvider.Equals("idir", StringComparison.InvariantCultureIgnoreCase))
            {
                isPSSO = true;
            }
            _logger.LogDebug($"AddApplication isPsso={isPSSO}");
            if (isPSSO)
            {
                //PSSO
                if (createApplication.ConsentFormFile != null)
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "no need for consent file.");
            }
            else
            {
                if (createApplication.ConsentFormFile == null)
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "must have consent file.");
            }

            var userId = this.HttpContext.User.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);

            var options = new JsonSerializerOptions() { PropertyNameCaseInsensitive = true };
            options.Converters.Add(new JsonStringEnumConverter());
            ApplicationCreateRequest? appCreateRequest = JsonSerializer.Deserialize<ApplicationCreateRequest>(createApplication.ApplicationCreateRequestJson, options);
            if (appCreateRequest == null)
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "ApplicationCreateRequestJson is invalid.");
            appCreateRequest.OriginTypeCode = ApplicationOriginTypeCode.OrganizationSubmitted;
            var result = await _appCreateRequestValidator.ValidateAsync(appCreateRequest);
            if (!result.IsValid)
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, JsonSerializer.Serialize(result.Errors));

            if (isPSSO)
            {
                return await _mediator.Send(new ApplicationCreateCommand(appCreateRequest, SpdConstants.BcGovOrgId, Guid.Parse(userId), null));
            }
            else
            {
                return await _mediator.Send(new ApplicationCreateCommand(appCreateRequest, null, Guid.Parse(userId), createApplication.ConsentFormFile));
            }
        }

        /// <summary>
        /// return all applications belong to the organization.
        /// sort: submittedon, name, companyname , add - in front of name means descending.
        /// filters: status, use | to filter multiple status : if no filters specified, endpoint returns all applications.
        /// search:wild card search in name, email and caseID, such as searchText@=test
        /// sample: api/orgs/4165bdfe-7cb4-ed11-b83e-00505683fbf4/applications?filters=status==AwaitingPayment|AwaitingApplicant,searchText@=str&sorts=name&page=1&pageSize=15
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="filters"></param>
        /// <param name="sorts"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/applications")]
        [HttpGet]
        public async Task<ApplicationListResponse> GetList([FromRoute] Guid orgId, [FromQuery] string? filters, [FromQuery] string? sorts, [FromQuery] int? page, [FromQuery] int? pageSize, bool showAllPSSOApps = false)
        {
            var token = Request.Headers["Authorization"];
            _logger.LogDebug($"GetList token={token}");

            bool isPSSO = false;
            bool showAll = false;
            Guid? idirUserId = null;

            string? identityProvider = _currentUser.GetIdentityProvider();
            if (identityProvider != null && identityProvider.Equals("idir", StringComparison.InvariantCultureIgnoreCase))
            {
                showAll = _currentUser.IsPSA() && showAllPSSOApps;
                idirUserId = showAll ? null : Guid.Parse(_currentUser.GetUserId());
                isPSSO = true;
            }
            _logger.LogDebug($"GetList idirUserId ={idirUserId}");
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            if (string.IsNullOrWhiteSpace(sorts)) sorts = "-submittedOn";
            PaginationRequest pagination = new((int)page, (int)pageSize);
            AppListFilterBy filterBy = GetAppListFilterBy(filters, orgId);
            AppListSortBy sortBy = GetAppSortBy(sorts);
            _logger.LogDebug($"GetList filterBy ={filterBy}");
            return await _mediator.Send(
                new ApplicationListQuery
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = pagination,
                    ShowAllPSSOApps = showAll,
                    IsPSSO = isPSSO,
                    UserId = idirUserId,
                });
        }

        /// <summary>
        /// return applications in this org and paidby should be organization.
        /// sort: submittedon, name, companyname , add - in front of name means descending.
        /// filters: paid
        /// search:wild card search in name, email and caseID, such as searchText@=test
        /// sample: api/orgs/4165bdfe-7cb4-ed11-b83e-00505683fbf4/applications/payments?filters=paid==true,fromDate==2021-01-12&sorts=-paid&page=1&pageSize=15
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="filters"></param>
        /// <param name="sorts"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/applications/payments")]
        [HttpGet]
        public async Task<ApplicationPaymentListResponse> GetPaymentList([FromRoute] Guid orgId, [FromQuery] string? filters, [FromQuery] string? sorts, [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            if (string.IsNullOrWhiteSpace(sorts)) sorts = "paid";
            PaginationRequest pagination = new((int)page, (int)pageSize);
            AppPaymentListFilterBy filterBy = GetAppPaymentListFilterBy(filters, orgId);
            AppPaymentListSortBy sortBy = GetAppPaymentListSortBy(sorts);
            return await _mediator.Send(
                new ApplicationPaymentListQuery
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = pagination
                });
        }

        private AppListFilterBy GetAppListFilterBy(string? filters, Guid orgId)
        {
            AppListFilterBy appListFilterBy = new(orgId);
            if (orgId == SpdConstants.BcGovOrgId)
            {
                appListFilterBy = new AppListFilterBy(null);
                appListFilterBy.ParentOrgId = orgId;
            }

            if (string.IsNullOrWhiteSpace(filters)) return appListFilterBy;

            try
            {
                //filters string should be like status==AwaitingPayment|AwaitingApplicant,searchText@=str
                string[] items = filters.Split(',');
                foreach (string item in items)
                {
                    string[] strs = item.Split("==");
                    if (strs.Length == 2)
                    {
                        if (strs[0] == "status")
                        {
                            string[] status = strs[1].Split("|");
                            appListFilterBy.ApplicationPortalStatus = status.Select(s => Enum.Parse<ApplicationPortalStatusCode>(s)).AsEnumerable();
                        }
                    }
                    else
                    {
                        if (strs.Length == 1)
                        {
                            string[] s = strs[0].Split("@=");
                            if (s.Length == 2 && s[0] == "searchText")
                            {
                                appListFilterBy.NameOrEmailOrAppIdContains = s[1];
                            }
                        }
                    }
                }
            }
            catch
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid filter string.");
            }
            return appListFilterBy;
        }

        private AppListSortBy GetAppSortBy(string? sortby)
        {
            //sorts string should be like: sorts=-submittedOn or sorts=name
            return sortby switch
            {
                null => new AppListSortBy(),
                "expiresOn" => new AppListSortBy(false),
                "-expiresOn" => new AppListSortBy(true),
                "name" => new AppListSortBy(null, false),
                "-name" => new AppListSortBy(null, true),
                "companyname" => new AppListSortBy(null, null, false),
                "-companyname" => new AppListSortBy(null, null, true),
                _ => new AppListSortBy()
            };
        }

        private AppPaymentListFilterBy GetAppPaymentListFilterBy(string? filters, Guid orgId)
        {
            AppPaymentListFilterBy filterBy = new(orgId);
            if (string.IsNullOrWhiteSpace(filters)) return filterBy;

            try
            {
                //filters string should be like paid==true,fromDate==2021-01-09,toDate==2022-02-29
                string[] items = filters.Split(',');
                foreach (string item in items)
                {
                    string[] strs = item.Split("==");
                    if (strs.Length == 2)
                    {
                        if (strs[0].Equals("paid", StringComparison.InvariantCultureIgnoreCase))
                        {
                            string str = strs[1];
                            filterBy.Paid = str == "true";
                        }
                        else if (strs[0].Equals("fromDate", StringComparison.InvariantCultureIgnoreCase))
                        {
                            string str = strs[1];
                            filterBy.FromDateTime = DateTimeOffset.ParseExact(str, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                        }
                        else if (strs[0].Equals("toDate", StringComparison.InvariantCultureIgnoreCase))
                        {
                            string str = strs[1];
                            filterBy.ToDateTime = DateTimeOffset.ParseExact(str, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                        }
                        else if (strs[0] == "status")
                        {
                            string[] status = strs[1].Split("|");
                            filterBy.ApplicationPortalStatus = status.Select(s => Enum.Parse<ApplicationPortalStatusCode>(s)).AsEnumerable();
                        }
                    }
                    else
                    {
                        if (strs.Length == 1)
                        {
                            string[] s = strs[0].Split("@=");
                            if (s.Length == 2 && s[0] == "searchText")
                            {
                                filterBy.NameOrAppIdContains = s[1];
                            }
                        }
                    }
                }
            }
            catch
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid filter string.");
            }
            return filterBy;
        }

        private AppPaymentListSortBy GetAppPaymentListSortBy(string? sortby)
        {
            //sorts string should be like: sorts=-paid or sorts=paid
            return sortby switch
            {
                null => new AppPaymentListSortBy(),
                "paid" => new AppPaymentListSortBy(true),
                "-paid" => new AppPaymentListSortBy(false),
                _ => new AppPaymentListSortBy()
            };
        }
        #endregion

        #region clearances

        /// <summary>
        /// return 
        /// sort: expiresOn, default will be asc. Applicant Name, Email
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="sorts"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/clearances/expired")]
        [HttpGet]
        public async Task<ClearanceAccessListResponse> GetExpiredClearanceAccessList([FromRoute] Guid orgId, [FromQuery] string? filters, [FromQuery] string? sorts, [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            if (string.IsNullOrWhiteSpace(sorts)) sorts = "expireOn";
            PaginationRequest pagination = new((int)page, (int)pageSize);
            ClearanceAccessListFilterBy filterBy = GetClearanceListFilterBy(filters, orgId);
            ClearanceAccessListSortBy sortBy = GetClearanceSortBy(sorts);
            return await _mediator.Send(
                new ClearanceAccessListQuery
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = pagination
                });
        }

        /// <summary>
        /// Mark the clearance access record as inactive
        /// </summary>
        /// <param name="clearanceAccessId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/clearances/expired/{clearanceAccessId}")]
        [HttpDelete]
        public async Task<ActionResult> ClearanceAccessDeleteAsync([FromRoute] Guid clearanceAccessId, [FromRoute] Guid orgId)
        {
            await _mediator.Send(new ClearanceAccessDeleteCommand(clearanceAccessId, orgId));
            return Ok();
        }

        /// <summary>
        /// return 
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="sorts"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/clearances/expired/{clearanceId}")]
        [HttpGet]
        public async Task<ApplicationInvitePrepopulateDataResponse> GetApplicationInvitePrePopulateData([FromRoute] Guid orgId, [FromRoute] Guid clearanceId)
        {
            return await _mediator.Send(
                new GetApplicationInvitePrepopulateDataQuery(clearanceId)
            );
        }

        /// <summary>
        /// download the clearance letter
        /// </summary>
        /// <param name="clearanceId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/orgs/{orgId}/clearances/{clearanceId}/file")]
        [HttpGet]
        public async Task<FileStreamResult> DownloadClearanceLetterAsync([FromRoute] Guid clearanceId)
        {
            FileResponse response = await _mediator.Send(new ClearanceLetterQuery(clearanceId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }

        private ClearanceAccessListFilterBy GetClearanceListFilterBy(string? filters, Guid orgId)
        {
            ClearanceAccessListFilterBy clearanceListFilterBy = new(orgId);
            if (string.IsNullOrWhiteSpace(filters)) return clearanceListFilterBy;

            try
            {
                string[] items = filters.Split(',');
                foreach (string item in items)
                {
                    string[] strs = item.Split("==");

                    if (strs.Length == 1)
                    {
                        string[] s = strs[0].Split("@=");
                        if (s.Length == 2 && s[0] == "searchText")
                        {
                            clearanceListFilterBy.NameOrEmailContains = s[1];
                        }
                    }
                }
            }
            catch
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid filter string.");
            }
            return clearanceListFilterBy;
        }

        private ClearanceAccessListSortBy GetClearanceSortBy(string? sortby)
        {
            //sorts string should be like: sorts = -submittedOn or sorts = name
            return sortby switch
            {
                null => new ClearanceAccessListSortBy(),
                "expireson" => new ClearanceAccessListSortBy(false),
                "-expireson" => new ClearanceAccessListSortBy(true),
                "name" => new ClearanceAccessListSortBy(null, false),
                "-name" => new ClearanceAccessListSortBy(null, true),
                "companyname" => new ClearanceAccessListSortBy(null, null, false),
                "-companyname" => new ClearanceAccessListSortBy(null, null, true),
                _ => new ClearanceAccessListSortBy()
            };
        }
        #endregion
    }
}

public record CreateApplication
{
    public IFormFile? ConsentFormFile { get; set; }
    public string ApplicationCreateRequestJson { get; set; } = null!;
}
