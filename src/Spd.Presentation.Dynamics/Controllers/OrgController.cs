using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Screening;
using Spd.Utilities.Shared;
using System.Configuration;

namespace Spd.Presentation.Dynamics.Controllers;

/// <summary>
/// Payment support for dynamics
/// </summary>
[Authorize]
public class OrgController : SpdControllerBase
{
    private readonly IMediator _mediator;
    private readonly IConfiguration _configuration;

    public OrgController(IMediator mediator, IConfiguration configuration) : base()
    {
        _mediator = mediator;
        _configuration = configuration;
    }

    /// <summary>
    /// Get a org-invitation link
    /// </summary>
    /// <param name="orgId">the GUID of the organization</param>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <response code="200">Ok, with the correct link generated</response>
    /// <response code="400">if the organization cannot be found</response>
    /// <returns>
    /// </returns>
    [HttpGet]
    [Route("api/org-invite-link/{orgId}")]
    public async Task<OrgInvitationLinkResponse> GetOrgInvitationLinkAsync(
        [FromRoute] Guid orgId,
        CancellationToken ct)
    {
        string? screeningHostUrl = _configuration.GetValue<string>("ScreeningHostUrl");
        string? screeningOrgPath = _configuration.GetValue<string>("ScreeningOrgInvitationPath");
        if (screeningHostUrl == null || screeningOrgPath == null)
        {
            throw new ConfigurationErrorsException("ScreeningHostUrl or screeningOrgPath is not set correctly.");
        }

        return await _mediator.Send(new OrgInvitationLinkCreateCommand(orgId, $"{screeningHostUrl}{screeningOrgPath}"), ct);
    }
}