using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
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
    private readonly IValidator<ControllingMemberCrcAppUpdateRequest> _controllingMemberCrcAppUpdateValidator;
    public ControllingMemberCrcAppController(IPrincipal currentUser, IMediator mediator,
        IValidator<ControllingMemberCrcAppSubmitRequest> controllingMemberCrcAppSubmitValidator,
        IValidator<ControllingMemberCrcAppUpsertRequest> controllingMemberCrcAppUpsertValidator,
        IValidator<ControllingMemberCrcAppUpdateRequest> controllingMemberCrcAppUpdateValidator,
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
        _controllingMemberCrcAppUpdateValidator = controllingMemberCrcAppUpdateValidator;
    }
    #region authenticated
    /// <summary>
    /// Get Controlling member CRC Application
    /// </summary>
    /// <param name="originalAppId"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/{originalAppId}")]
    [Authorize(Policy = "OnlyBcsc")]
    [HttpGet]
    public async Task<ControllingMemberCrcAppResponse> GetControllingMemberCrcApplication([FromRoute][Required] Guid originalAppId)
    {
        return await _mediator.Send(new GetControllingMemberCrcApplicationQuery(originalAppId));
    }
    /// <summary>
    /// Create or save Controlling member CRC Application
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
        controllingMemberCrcAppUpsertRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
        return await _mediator.Send(new ControllingMemberCrcUpsertCommand(controllingMemberCrcAppUpsertRequest));
    }
   
    /// <summary>
    /// Submit Controlling Member Crc New Application
    /// authenticated
    /// </summary>
    /// <param name="ControllingMemberCrcSubmitRequest"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/submit")]
    [Authorize(Policy = "OnlyBcsc")]
    [HttpPost]
    public async Task<ControllingMemberCrcAppCommandResponse> SubmitControllingMemberCrcApplication([FromBody][Required] ControllingMemberCrcAppUpsertRequest controllingMemberCrcSubmitRequest, CancellationToken ct)
    {
        var validateResult = await _controllingMemberCrcAppUpsertValidator.ValidateAsync(controllingMemberCrcSubmitRequest, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
        controllingMemberCrcSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
        return await _mediator.Send(new ControllingMemberCrcSubmitCommand(controllingMemberCrcSubmitRequest));
    }
    
    /// <summary>
    /// Submit an update for Controlling member crc application for authenticated users,
    /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
    /// </summary>
    /// <param name="request">ControllingMemberCrcAppUpdateRequest Json data</param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/update")]
    [Authorize(Policy = "OnlyBcsc")]
    [HttpPost]
    public async Task<ControllingMemberCrcAppCommandResponse?> SubmitUpdateControllingMemberCrcApplicationAuthenticated(ControllingMemberCrcAppUpdateRequest request, CancellationToken ct)
    {
        ControllingMemberCrcAppCommandResponse? response = null;
        IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(request.DocumentKeyCodes, ct);
        //check validator
        var validateResult = await _controllingMemberCrcAppUpdateValidator.ValidateAsync(request, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

        ControllingMemberCrcAppUpdateCommand command = new(request, newDocInfos);
        response = await _mediator.Send(command, ct);
        return response;
    }

    #endregion authenticated

    #region anonymous
    

    /// <summary>
    /// Submit Controlling Member Crc New Application Anonymously.
    /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
    /// anonymous
    /// </summary>
    /// <param name="request">ControllingMemberCrcAppSubmitRequest Json data</param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/anonymous/submit")]
    [HttpPost]
    public async Task<ControllingMemberCrcAppCommandResponse> SubmitControllingMemberCrcApplicationAnonymous([FromBody][Required] ControllingMemberCrcAppSubmitRequest request, CancellationToken ct)
    {
        await VerifyKeyCode();
        IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(request.DocumentKeyCodes, ct);
        var validateResult = await _controllingMemberCrcAppSubmitValidator.ValidateAsync(request, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

        request.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;
        ControllingMemberCrcAppCommandResponse? response = null;
        if (request.ApplicationTypeCode == ApplicationTypeCode.New)
            response = await _mediator.Send(new ControllingMemberCrcAppNewCommand(request, newDocInfos), ct);

        SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
        SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);

        return response;
    }

    /// <summary>
    /// Submit an update for Controlling Member Crc Application Anonymously
    /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
    /// </summary>
    /// <param name="request">ControllingMemberCrcAppUpdateRequest data</param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/controlling-member-crc-applications/anonymous/update")]
    [HttpPost]
    public async Task<ControllingMemberCrcAppCommandResponse> UpdateControllingMemberCrcApplicationAnonymous([FromBody][Required] ControllingMemberCrcAppUpdateRequest request, CancellationToken ct)
    {
        await VerifyKeyCode();

        IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(request.DocumentKeyCodes, ct);
        var validateResult = await _controllingMemberCrcAppUpdateValidator.ValidateAsync(request, ct);
        if (!validateResult.IsValid)
            throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

        ControllingMemberCrcAppCommandResponse? response = null;
        response = await _mediator.Send(new ControllingMemberCrcAppUpdateCommand(request, newDocInfos), ct);

        SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
        SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);

        return response;
    }
    #endregion anonymous
}