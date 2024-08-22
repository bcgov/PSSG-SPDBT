using Amazon.Runtime.Internal;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class ControllingMemberCrcAppController : SpdControllerBase
{
    private readonly IValidator<ControllingMemberCrcAppSubmitRequest> _controllingMemberCrcAppSubmitValidator;
    private readonly IMediator _mediator;
    /// <summary>
    /// 
    /// </summary>
    /// <param name="mediator"></param>
    public ControllingMemberCrcAppController(IMediator mediator, IValidator<ControllingMemberCrcAppSubmitRequest> controllingMemberCrcAppSubmitValidator = null)
    {
        _mediator = mediator;
        _controllingMemberCrcAppSubmitValidator = controllingMemberCrcAppSubmitValidator;
    }

    /// <summary>
    /// Save New Licence Crc Controlling Member
    /// </summary>
    /// <param name="ControllingMemberCrcSubmitRequest"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/anonymous/submit")]
    [HttpPost]
    public async Task<ControllingMemberCrcAppCommandResponse> SubmitControllingMemberCrcApplication([FromBody][Required] ControllingMemberCrcAppSubmitRequest ControllingMemberCrcSubmitRequest, CancellationToken ct)
    {
        var validateResult = await _controllingMemberCrcAppSubmitValidator.ValidateAsync(ControllingMemberCrcSubmitRequest, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
        return await _mediator.Send(new ControllingMemberCrcAppSubmitRequestCommand(ControllingMemberCrcSubmitRequest), ct);
    }
}