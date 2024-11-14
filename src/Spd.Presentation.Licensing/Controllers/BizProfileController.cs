using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class BizProfileController : SpdControllerBase
{
    private readonly IMediator _mediator;
    private readonly IValidator<BizProfileUpdateRequest> _bizProfileUpdateRequestValidator;

    public BizProfileController(IMediator mediator,
    IValidator<BizProfileUpdateRequest> bizProfileUpdateRequestValidator)
    {
        _mediator = mediator;
        _bizProfileUpdateRequestValidator = bizProfileUpdateRequestValidator;
    }

    /// <summary>
    /// Get Business profile
    /// </summary>
    /// <param name="id"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/biz/{id}")]
    [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
    [HttpGet]
    public async Task<BizProfileResponse> GetProfile([FromRoute] Guid id, CancellationToken ct)
    {
        return await _mediator.Send(new GetBizProfileQuery(id), ct);
    }

    /// <summary>
    /// Update Business profile
    /// </summary>
    /// <param name="bizId"></param>
    /// <param name="request"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/biz/{bizId}")]
    [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
    [HttpPut]
    public async Task<Guid> UpdateBizProfile([FromRoute] string bizId, BizProfileUpdateRequest request, CancellationToken ct)
    {
        if (!Guid.TryParse(bizId, out Guid bizGuidId))
            throw new ApiException(HttpStatusCode.BadRequest, $"{nameof(bizId)} is not a valid guid.");

        var validateResult = await _bizProfileUpdateRequestValidator.ValidateAsync(request, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

        BizProfileUpdateCommand command = new(bizGuidId, request);
        await _mediator.Send(command, ct);

        return bizGuidId;
    }
}
