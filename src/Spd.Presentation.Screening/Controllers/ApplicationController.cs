using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spd.Presentation.Screening.Controllers
{
    [Authorize]
    public class ApplicationController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IValidator<ApplicationCreateRequest> _appCreateRequestValidator;

        public ApplicationController(IMediator mediator, IValidator<ApplicationCreateRequest> appCreateRequestValidator)
        {
            _mediator = mediator;
            _appCreateRequestValidator = appCreateRequestValidator;
        }

        /// <summary>
        /// create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
        /// </summary>
        /// <param name="invitesCreateRequest"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-invites")]
        [HttpPost]
        public async Task<ApplicationInvitesCreateResponse> AddApplicationInvites([FromBody][Required] ApplicationInvitesCreateRequest invitesCreateRequest, [FromRoute] Guid orgId)
        {
            var userId = this.HttpContext.User.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);
            return await _mediator.Send(new ApplicationInviteCreateCommand(invitesCreateRequest, orgId, Guid.Parse(userId)));
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
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            PaginationRequest pagination = new PaginationRequest((int)page, (int)pageSize);

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
            AppInviteListFilterBy filterBy = new AppInviteListFilterBy(orgId, EmailOrNameContains: filterValue);
            AppInviteListSortBy sortBy = new AppInviteListSortBy(SubmittedDateDesc: true);
            return await _mediator.Send(new ApplicationInviteListQuery()
            {
                FilterBy = filterBy,
                SortBy = sortBy,
                Paging = pagination
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
        [Route("api/orgs/{orgId}/verifyidentity/{applicationId}")]
        [HttpPut]
        public async Task<bool> PutVerify([FromRoute] Guid applicationId, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new IdentityCommand(orgId, applicationId, true));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/rejectidentity/{applicationId}")]
        [HttpPut]
        public async Task<bool> PutReject([FromRoute] Guid applicationId, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new IdentityCommand(orgId, applicationId, false));
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
                "submittedon" => new AppListSortBy(false),
                "-submittedon" => new AppListSortBy(true),
                "name" => new AppListSortBy(null, false),
                "-name" => new AppListSortBy(null, true),
                "companyname" => new AppListSortBy(null, null, false),
                "-companyname" => new AppListSortBy(null, null, true),
                _ => new AppListSortBy()
            };
        }
    }

    public record CreateApplication
    {
        public IFormFile ConsentFormFile { get; set; } = null!;
        public string ApplicationCreateRequestJson { get; set; } = null!;
    }
}

