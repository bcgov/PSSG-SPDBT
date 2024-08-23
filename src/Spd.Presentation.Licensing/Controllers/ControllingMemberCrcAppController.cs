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
    /// Upload licence application files: frontend use the keyCode (in cookies) to upload following files.
    /// Uploading file only save files in cache, the files are not connected to the application yet.
    /// </summary>
    /// <param name="fileUploadRequest"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/anonymous/files")]
    [HttpPost]
    [RequestSizeLimit(26214400)] //25M
    public async Task<Guid> UploadLicenceAppFilesAnonymous([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, CancellationToken ct)
    {
        await VerifyKeyCode();
        VerifyFiles(fileUploadRequest.Documents);

        CreateDocumentInCacheCommand command = new(fileUploadRequest);
        var newFileInfos = await _mediator.Send(command, ct);
        Guid fileKeyCode = Guid.NewGuid();
        await Cache.SetAsync(fileKeyCode.ToString(), newFileInfos, TimeSpan.FromMinutes(30), ct);
        return fileKeyCode;
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
        IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(ControllingMemberCrcSubmitRequest.DocumentKeyCodes, ct);
        var validateResult = await _controllingMemberCrcAppSubmitValidator.ValidateAsync(ControllingMemberCrcSubmitRequest, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

        ControllingMemberCrcAppCommandResponse? response = null;
        response = await _mediator.Send(new ControllingMemberCrcAppSubmitRequestCommand(ControllingMemberCrcSubmitRequest, newDocInfos), ct);
        return response;
    }
}