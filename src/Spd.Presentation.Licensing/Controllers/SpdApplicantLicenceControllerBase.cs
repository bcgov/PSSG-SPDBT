using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Configurations;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.Configuration;
using System.Net;

namespace Spd.Presentation.Licensing.Controllers;

public abstract class SpdLicenceControllerBase : SpdControllerBase
{
    private readonly ITimeLimitedDataProtector _dataProtector;
    private readonly IDistributedCache _cache;
    private readonly IRecaptchaVerificationService _recaptchaVerificationService;
    private readonly IConfiguration _configuration;

    protected SpdLicenceControllerBase(IDistributedCache cache,
        IDataProtectionProvider dpProvider,
        IRecaptchaVerificationService recaptchaVerificationService,
        IConfiguration configuration)
    {
        _cache = cache;
        _dataProtector = dpProvider.CreateProtector(SessionConstants.AnonymousRequestDataProtectorName).ToTimeLimitedDataProtector();
        _recaptchaVerificationService = recaptchaVerificationService;
        _configuration = configuration;
    }

    protected IDistributedCache Cache
    { get { return _cache; } }

    protected void SetValueToResponseCookie(string key, string value, int durationInMins = 20)
    {
        var encryptedKeyCode = _dataProtector.Protect(value, DateTimeOffset.UtcNow.AddMinutes(durationInMins));
        this.Response.Cookies.Append(key,
            encryptedKeyCode,
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Secure = true,
                Expires = DateTimeOffset.UtcNow.AddMinutes(durationInMins)
            });
    }

    protected string GetInfoFromRequestCookie(string key)
    {
        //get keyCode from Cookie
        string? encodedValue;
        Request.Cookies.TryGetValue(key, out encodedValue);
        if (string.IsNullOrEmpty(encodedValue))
            throw new ApiException(HttpStatusCode.Unauthorized);
        string value;
        try
        {
            value = _dataProtector.Unprotect(encodedValue);
        }
        catch
        {
            throw new ApiException(HttpStatusCode.Unauthorized, $"{key} value is incorrect");
        }
        return value;
    }

    protected async Task VerifyGoogleRecaptchaAsync(GoogleRecaptcha googleRecaptcha, CancellationToken ct)
    {
        var isValid = await _recaptchaVerificationService.VerifyAsync(googleRecaptcha.RecaptchaCode, ct);
        if (!isValid)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid recaptcha value");
        }
    }

    protected async Task<IEnumerable<LicAppFileInfo>> GetAllNewDocsInfoAsync(IEnumerable<Guid>? docKeyCodes, CancellationToken ct)
    {
        Guid[]? array = docKeyCodes?.ToArray();
        if (array == null || array.Length == 0) return Enumerable.Empty<LicAppFileInfo>();
        List<LicAppFileInfo> results = new();
        foreach (Guid docKey in array)
        {
            IEnumerable<LicAppFileInfo>? items = await _cache.GetAsync<IEnumerable<LicAppFileInfo>>(docKey.ToString());
            if (items != null && items.Any())
            {
                results.AddRange(items);
            }
        }
        return results;
    }

    protected async Task VerifyKeyCode()
    {
        string keyCode = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationSubmitKeyCode);
        //validate keyCode
        LicenceAppDocumentsCache? keyCodeValue = await Cache.GetAsync<LicenceAppDocumentsCache?>(keyCode.ToString());
        if (keyCodeValue == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "invalid key code.");
        }
    }

    protected void VerifyFiles(IList<IFormFile> documents)
    {
        UploadFileConfiguration? fileUploadConfig = _configuration.GetSection("UploadFile").Get<UploadFileConfiguration>();
        if (fileUploadConfig == null)
            throw new ConfigurationErrorsException("UploadFile configuration does not exist.");

        //validation files
        foreach (IFormFile file in documents)
        {
            string? fileexe = FileHelper.GetFileExtension(file.FileName);
            if (!fileUploadConfig.AllowedExtensions.Split(",").Contains(fileexe, StringComparer.InvariantCultureIgnoreCase))
            {
                throw new ApiException(HttpStatusCode.BadRequest, $"{file.FileName} file type is not supported.");
            }
            long fileSize = file.Length;
            if (fileSize > fileUploadConfig.MaxFileSizeMB * 1024 * 1024)
            {
                throw new ApiException(HttpStatusCode.BadRequest, $"{file.Name} exceeds maximum supported file size {fileUploadConfig.MaxFileSizeMB} MB.");
            }
        }
    }
}