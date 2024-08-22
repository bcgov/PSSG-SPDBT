using Amazon.Runtime.Internal.Util;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class ControllingMemberCrcAppController : SpdLicenceControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ControllingMemberCrcAppController> _logger;

    private readonly IConfiguration _configuration;
    private readonly IValidator<ControllingMemberCrcAppSubmitRequest> _controllingMemberCrcAppSubmitValidator;
    public ControllingMemberCrcAppController(IMediator mediator,
        IValidator<ControllingMemberCrcAppSubmitRequest> controllingMemberCrcAppSubmitValidator,
        ILogger<ControllingMemberCrcAppController> logger,
        IDistributedCache cache,
        IDataProtectionProvider dpProvider,
        IRecaptchaVerificationService recaptchaVerificationService,
        IConfiguration configuration) : base(cache, dpProvider, recaptchaVerificationService, configuration)
    {
        _mediator = mediator;
        _logger = logger;
        _configuration = configuration;
        _controllingMemberCrcAppSubmitValidator = controllingMemberCrcAppSubmitValidator;
    }

    /// <summary>
    /// Upload licence application first step: frontend needs to make this first request to get a Guid code.
    /// the keycode will be set in the cookies
    /// </summary>
    /// <param name="recaptcha"></param>
    /// <param name="ct"></param>
    /// <returns>Guid: keyCode</returns>
    [Route("api/controlling-member-crc-applications/anonymous/keyCode")]
    [HttpPost]
    public async Task<IActionResult> GetControllingMemberCrcAppSubmissionAnonymousCode([FromBody] GoogleRecaptcha recaptcha, CancellationToken ct)
    {
        await VerifyGoogleRecaptchaAsync(recaptcha, ct);
        string keyCode = Guid.NewGuid().ToString();
        await Cache.SetAsync(keyCode, new LicenceAppDocumentsCache(), TimeSpan.FromMinutes(20), ct);
        SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, keyCode);
        return Ok();
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