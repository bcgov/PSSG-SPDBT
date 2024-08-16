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
public class CrcControllingMemberController : SpdControllerBase
{
    private readonly IMediator _mediator;
    /// <summary>
    /// 
    /// </summary>
    /// <param name="mediator"></param>
    public CrcControllingMemberController (IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Save New Licence Crc Controlling Member
    /// </summary>
    /// <param name="CrcControllingMemberUpsertRequest"></param>
    /// <returns></returns>
    [Route("api/business-licence/New-Crc-Controlling-Member")]
    [HttpPost]
    public async Task<CrcControllingMemberCommandResponse> SaveCrcControllingMemberApplication([FromBody][Required] CrcControllingMemberUpsertRequest CrcControllingMemberUpsertRequest, CancellationToken ct)
    {
       return await _mediator.Send(new CrcControllingMemberUpsertCommand(CrcControllingMemberUpsertRequest), ct);
    }
}