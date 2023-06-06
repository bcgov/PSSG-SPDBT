using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ManagerContract;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spd.Presentation.Screening.Controllers
{
    [Authorize(Policy = "OnlyBcsc")]
    public class ApplicantController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IValidator<ApplicationCreateRequest> _appCreateRequestValidator;

        public ApplicantController(IMediator mediator,
            IValidator<ApplicationCreateRequest> appCreateRequestValidator,
            IValidator<ApplicationCreateRequestFromBulk> appCreateRequestFromBulkValidator,
            IConfiguration configuration)
        {
            _mediator = mediator;
            _appCreateRequestValidator = appCreateRequestValidator;
        }

        #region application-invites
        /// <summary>
        /// Verify if the current application invite is correct, and return needed info
        /// </summary>
        /// <param name="appInviteVerifyRequest">which include InviteEncryptedCode</param>
        /// <returns></returns>
        [Route("api/applicants/invites")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<AppInviteVerifyResponse> VerifyAppInvitation([FromBody][Required] AppInviteVerifyRequest appInviteVerifyRequest)
        {
            return await _mediator.Send(new ApplicationInviteVerifyCommand(appInviteVerifyRequest));
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
        public async Task<ApplicationStatisticsResponse> GetAppStatsList([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new ApplicationStatisticsQuery(orgId));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/identity/{applicationId}")]
        [HttpPut]
        public async Task<ActionResult> Verify([FromRoute] Guid applicationId, [FromRoute] Guid orgId, [FromQuery] IdentityStatusCode status)
        {
            await _mediator.Send(new IdentityCommand(orgId, applicationId, status));
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
            var userId = this.HttpContext.User.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);

            var options = new JsonSerializerOptions() { PropertyNameCaseInsensitive = true };
            options.Converters.Add(new JsonStringEnumConverter());
            ApplicationCreateRequest? appCreateRequest = JsonSerializer.Deserialize<ApplicationCreateRequest>(createApplication.ApplicationCreateRequestJson, options);
            if (appCreateRequest == null)
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "ApplicationCreateRequestJson is invalid.");
            var result = await _appCreateRequestValidator.ValidateAsync(appCreateRequest);
            if (!result.IsValid)
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, JsonSerializer.Serialize(result.Errors));

            return await _mediator.Send(new ApplicationCreateCommand(appCreateRequest, orgId, Guid.Parse(userId), createApplication.ConsentFormFile));
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
        public async Task<ApplicationListResponse> GetList([FromRoute] Guid orgId, [FromQuery] string? filters, [FromQuery] string? sorts, [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            if (string.IsNullOrWhiteSpace(sorts)) sorts = "-submittedOn";
            PaginationRequest pagination = new PaginationRequest((int)page, (int)pageSize);
            AppListFilterBy filterBy = GetAppListFilterBy(filters, orgId);
            AppListSortBy sortBy = GetAppSortBy(sorts);
            return await _mediator.Send(
                new ApplicationListQuery
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = pagination
                });
        }

        private AppListFilterBy GetAppListFilterBy(string? filters, Guid orgId)
        {
            AppListFilterBy appListFilterBy = new AppListFilterBy(orgId);
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
        #endregion

 
    }
}

