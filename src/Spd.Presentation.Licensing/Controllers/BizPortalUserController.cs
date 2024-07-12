using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class BizPortalUserController : ControllerBase
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
    [Authorize(Policy = "OnlyBCeID", Roles = "PrimaryManager")]
    [Route("api/business/{bizId}/portal-users")]
    [HttpPost]
    public async Task<BizPortalUserResponse> Add([FromBody][Required] BizPortalUserCreateRequest bizPortalUserCreateRequest, [FromRoute] Guid bizId)
    {
        bizPortalUserCreateRequest.BizId = bizId;

        string? hostUrl = _configuration.GetValue<string>("HostUrl");
        if (hostUrl == null)
            throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");

        Guid? userId = _currentUser.GetUserId() != null ? Guid.Parse(_currentUser.GetUserId()) : null;
        return await _mediator.Send(new BizPortalUserCreateCommand(bizPortalUserCreateRequest, hostUrl, userId));
    }
}
