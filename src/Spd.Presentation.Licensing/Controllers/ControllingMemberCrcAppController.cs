using Amazon.Runtime.Internal.Util;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers;

[ApiController]
public class ControllingMemberCrcAppController : SpdLicenceControllerBase
{
    private readonly IPrincipal _currentUser;
    private readonly IMediator _mediator;
    private readonly ILogger<ControllingMemberCrcAppController> _logger;

    private readonly IConfiguration _configuration;
    private readonly IValidator<ControllingMemberCrcAppSubmitRequest> _controllingMemberCrcAppSubmitValidator;
    private readonly IValidator<ControllingMemberCrcAppUpsertRequest> _controllingMemberCrcAppUpsertValidator;
    public ControllingMemberCrcAppController(IPrincipal currentUser, IMediator mediator,
        IValidator<ControllingMemberCrcAppSubmitRequest> controllingMemberCrcAppSubmitValidator,
        IValidator<ControllingMemberCrcAppUpsertRequest> controllingMemberCrcAppUpsertValidator,
        ILogger<ControllingMemberCrcAppController> logger,
        IDistributedCache cache,
        IDataProtectionProvider dpProvider,
        IRecaptchaVerificationService recaptchaVerificationService,
        IConfiguration configuration) : base(cache, dpProvider, recaptchaVerificationService, configuration)
    {
        _mediator = mediator;
        _currentUser = currentUser;
        _logger = logger;
        _configuration = configuration;
        _controllingMemberCrcAppSubmitValidator = controllingMemberCrcAppSubmitValidator;
        _controllingMemberCrcAppUpsertValidator = controllingMemberCrcAppUpsertValidator;
    }
    #region authenticated
    /// <summary>
    /// Get Controlling member CRC Application
    /// </summary>
    /// <param name="cmCrcAppId"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/{cmCrcAppId}")]
    [Authorize(Policy = "OnlyBcsc")]
    [HttpGet]
    public async Task<ControllingMemberCrcAppResponse> GetControllingMemberCrcApplication([FromRoute][Required] Guid cmCrcAppId)
    {
        return await _mediator.Send(new GetControllingMemberCrcApplicationQuery(cmCrcAppId));
    }
    /// <summary>
    /// Create Controlling member CRC Application
    /// </summary>
    /// <param name="controllingMemberCrcAppUpsertRequest"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications")]
    [Authorize(Policy = "OnlyBcsc")]
    [HttpPost]
    public async Task<ControllingMemberCrcAppCommandResponse> SaveControllingMemberCrcApplication([FromBody][Required] ControllingMemberCrcAppUpsertRequest controllingMemberCrcAppUpsertRequest)
    {
        if (controllingMemberCrcAppUpsertRequest.ApplicantId == null || controllingMemberCrcAppUpsertRequest.ApplicantId == Guid.Empty)
            throw new ApiException(HttpStatusCode.BadRequest, "must have applicant");
        return await _mediator.Send(new ControllingMemberCrcUpsertCommand(controllingMemberCrcAppUpsertRequest));
    }
    /// <summary>
    /// Upload Controlling Member application files to transient storage
    /// </summary>
    /// <param name="fileUploadRequest"></param>
    /// <param name="CrcAppId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/{CrcAppId}/files")]
    [HttpPost]
    [RequestSizeLimit(26214400)] //25M
    [Authorize(Policy = "OnlyBcsc")]
    public async Task<IEnumerable<LicenceAppDocumentResponse>> UploadLicenceAppFiles([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, [FromRoute] Guid CrcAppId, CancellationToken ct)
    {
        VerifyFiles(fileUploadRequest.Documents);
        var applicantInfo = _currentUser.GetBcscUserIdentityInfo();

        return await _mediator.Send(new CreateDocumentInTransientStoreCommand(fileUploadRequest, applicantInfo.Sub, CrcAppId), ct);
    }
    /// <summary>
    /// Submit Controlling Member Crc Application
    /// authenticated
    /// </summary>
    /// <param name="ControllingMemberCrcSubmitRequest"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/submit")]
    [Authorize(Policy = "OnlyBcsc")]
    [HttpPost]
    public async Task<ControllingMemberCrcAppCommandResponse> SubmitControllingMemberCrcApplication([FromBody][Required] ControllingMemberCrcAppUpsertRequest controllingMemberCrcSubmitRequest, CancellationToken ct)
    {
        //TODO: modify validator condition
        var validateResult = await _controllingMemberCrcAppUpsertValidator.ValidateAsync(controllingMemberCrcSubmitRequest, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

        return await _mediator.Send(new ControllingMemberCrcSubmitCommand(controllingMemberCrcSubmitRequest));
    }

    #endregion authenticated
    #region anonymous
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
    /// Submit Controlling Member Crc Application
    /// anonymous
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
        response = await _mediator.Send(new ControllingMemberCrcAppNewCommand(ControllingMemberCrcSubmitRequest, newDocInfos), ct);
        return response;
    }
    #endregion anonymous
}