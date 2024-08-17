using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class ControllingMemberCrcAppController : SpdControllerBase
{
    private readonly IMediator _mediator;
    /// <summary>
    /// 
    /// </summary>
    /// <param name="mediator"></param>
    public ControllingMemberCrcAppController (IMediator mediator)
    {
        _mediator = mediator;
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
       return await _mediator.Send(new ControllingMemberCrcAppSubmitRequestCommand(ControllingMemberCrcSubmitRequest), ct);
    }
}