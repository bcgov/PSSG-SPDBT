using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Net;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class BizPortalUserController : SpdControllerBase
{
    private readonly ILogger<BizPortalUserController> _logger;
    private readonly IMediator _mediator;
    private readonly IConfiguration _configuration;
    private readonly IPrincipal _currentUser;

    public BizPortalUserController(ILogger<BizPortalUserController> logger, IMediator mediator, IConfiguration configuration, IPrincipal currentUser)
    {
        _logger = logger;
        _mediator = mediator;
        _configuration = configuration;
        _currentUser = currentUser;
    }

    /// <summary>
    /// Create Business Portal User
    /// </summary>
    /// <param name="bizId"></param>
    /// <returns></returns>
    [Authorize(Policy = "OnlyBCeID")]//, Roles = "PrimaryManager")]
    [Route("api/business/{bizId}/portal-users")]
    [HttpPost]
    public async Task<BizPortalUserResponse> Add([FromRoute] Guid bizId, [FromBody][Required] BizPortalUserCreateRequest bizPortalUserCreateRequest)
    {
        bizPortalUserCreateRequest.BizId = bizId;

        string? hostUrl = _configuration.GetValue<string>("HostUrl");
        if (hostUrl == null)
            throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");

        Guid? userId = _currentUser.GetUserId() != null ? Guid.Parse(_currentUser.GetUserId()) : null;
        return await _mediator.Send(new BizPortalUserCreateCommand(bizPortalUserCreateRequest, hostUrl, userId));
    }

    /// <summary>
    /// Update Business Portal User
    /// </summary>
    /// <param name="bizId"></param>
    /// <param name="userId"></param>
    /// <param name="bizPortalUserUpdateRequest"></param>
    /// <returns></returns>
    [Authorize(Policy = "OnlyBCeID")]//, Roles = "PrimaryManager")]
    [Route("api/business/{bizId}/portal-users/{userId}")]
    [HttpPut]
    public async Task<BizPortalUserResponse> Put([FromRoute] Guid bizId, [FromRoute] Guid userId, [FromBody][Required] BizPortalUserUpdateRequest bizPortalUserUpdateRequest)
    {
        bizPortalUserUpdateRequest.Id = userId;
        bizPortalUserUpdateRequest.BizId = bizId;

        //if role is manager, can only change his own information
        if (_currentUser.GetUserRole() == ContactAuthorizationTypeCode.BusinessManager.ToString() &&
            userId.ToString() != _currentUser.GetUserId())
        {
            throw new ApiException(HttpStatusCode.Forbidden, "Business Manager can only change his own information.");
        }
        return await _mediator.Send(new BizPortalUserUpdateCommand(userId, bizPortalUserUpdateRequest));
    }

    /// <summary>
    /// Get Business Portal User list
    /// </summary>
    /// <param name="bizId"></param>
    /// <returns></returns>
    [Authorize(Policy = "OnlyBCeID")]//, Roles = "PrimaryManager,Manager")]
    [Route("api/business/{bizId}/portal-users")]
    [HttpGet]
    public async Task<BizPortalUserListResponse> GetBizPortalUserList([FromRoute] Guid bizId)
    {
        return await _mediator.Send(new BizPortalUserListQuery(bizId));
    }

    /// <summary>
    /// Get Business Portal User
    /// </summary>
    /// <param name="bizId"></param>
    /// <returns></returns>
    [Authorize(Policy = "OnlyBCeID")]//, Roles = "PrimaryManager,Manager")]
    [Route("api/business/{bizId}/portal-users/{userId}")]
    [HttpGet]
    public async Task<BizPortalUserResponse> Get([FromRoute] Guid bizId, Guid userId)
    {
        if (_currentUser.GetUserId() == userId.ToString())
        {
            await _mediator.Send(new BizPortalUserUpdateLoginCommand(userId));
        }
        return await _mediator.Send(new BizPortalUserGetQuery(userId));
    }

    [Authorize(Policy = "OnlyBCeID")]//, Roles = "PrimaryManager")]
    [Route("api/business/{bizId}/portal-users/{userId}")]
    [HttpDelete]
    public async Task<ActionResult> DeleteAsync([FromRoute] Guid userId, [FromRoute] Guid bizId)
    {
        await _mediator.Send(new BizPortalUserDeleteCommand(userId, bizId));
        return Ok();
    }
}
