using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class BizProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public BizProfileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get Business profile
    /// </summary>
    /// <param name="id"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/biz/{id}")]
    [Authorize(Policy = "OnlyBceid")]
    [HttpGet]
    public async Task<BizProfileResponse> GetProfile([FromRoute] Guid id, CancellationToken ct)
    {
        return await _mediator.Send(new GetBizProfileQuery(id), ct);
    }
}
