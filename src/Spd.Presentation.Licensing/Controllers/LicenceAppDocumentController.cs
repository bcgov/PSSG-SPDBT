using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers;
[ApiController]
public class LicenceAppDocumentController : SpdLicenceControllerBase
{
    private readonly IMediator _mediator;
    private readonly IConfiguration _configuration;
    private readonly IPrincipal _currentUser;

    public LicenceAppDocumentController(IMediator mediator, IDistributedCache cache,
        IDataProtectionProvider dpProvider,
        IPrincipal currentUser,
        IRecaptchaVerificationService recaptchaVerificationService,
        IConfiguration configuration) : base(cache, dpProvider, recaptchaVerificationService, configuration)
    {
        _mediator = mediator;
        _configuration = configuration;
        _currentUser = currentUser;
    }

    /// <summary> 
    /// Upload document files to transient storage
    /// </summary>
    /// <param name="fileUploadRequest"></param>
    /// <param name="licenceAppId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/licence-application-documents/{licenceAppId}/files")]
    [HttpPost]
    [RequestSizeLimit(26214400)] //25M
    [Authorize(Policy = "BcscBCeID")]
    public async Task<IEnumerable<LicenceAppDocumentResponse>> UploadLicenceAppFiles([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, [FromRoute] Guid licenceAppId, CancellationToken ct)
    {
        VerifyFiles(fileUploadRequest.Documents);

        if (User.HasClaim("Policy", "OnlyBcsc"))
        {
            var applicantInfo = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new CreateDocumentInTransientStoreCommand(fileUploadRequest, applicantInfo.Sub, licenceAppId), ct);
        }
        return await _mediator.Send(new CreateDocumentInTransientStoreCommand(fileUploadRequest, null, licenceAppId), ct);
    }

    ///<summary> 
    /// Uploading document files, save in cache
    /// </summary>
    /// <param name="fileUploadRequest"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/licence-application-documents/files")]
    [HttpPost]
    [Authorize(Policy = "BcscBCeID")]
    [RequestSizeLimit(26214400)] //25M
    public async Task<Guid> UploadFilesToCache([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, CancellationToken ct)
    {
        VerifyFiles(fileUploadRequest.Documents);

        CreateDocumentInCacheCommand command = new(fileUploadRequest);
        var newFileInfos = await _mediator.Send(command, ct);
        Guid fileKeyCode = Guid.NewGuid();
        await Cache.SetAsync(fileKeyCode.ToString(), newFileInfos, TimeSpan.FromMinutes(20), ct);
        return fileKeyCode;
    }

    /// <summary>
    /// Upload first step: get a Guid code.
    /// the keycode will be set in the cookies
    /// </summary>
    /// <param name="recaptcha"></param>
    /// <param name="ct"></param>
    /// <returns>Guid: keyCode</returns>
    [Route("api/licence-application-documents/anonymous/keyCode")]
    [HttpPost]
    public async Task<IActionResult> GetAnonymousCode([FromBody] GoogleRecaptcha recaptcha, CancellationToken ct)
    {
        await VerifyGoogleRecaptchaAsync(recaptcha, ct);
        string keyCode = Guid.NewGuid().ToString();
        await Cache.SetAsync(keyCode, new LicenceAppDocumentsCache(), TimeSpan.FromMinutes(20), ct);
        SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, keyCode);
        return Ok();
    }

    /// <summary>
    /// Upload document files, use the keyCode (in cookies) to upload files.
    /// save files in cache, files are not connected to the application yet.
    /// </summary>
    /// <param name="fileUploadRequest"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/licence-application-documents/anonymous/files")]
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
}
