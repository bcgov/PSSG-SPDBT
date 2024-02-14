using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Cache;
using System.Net;

namespace Spd.Presentation.Licensing.Controllers;
public abstract class SpdLicenceAnonymousControllerBase : SpdControllerBase
{
    protected readonly ITimeLimitedDataProtector _dataProtector;
    protected readonly IDistributedCache _cache;
    protected readonly IRecaptchaVerificationService _recaptchaVerificationService;
    protected SpdLicenceAnonymousControllerBase(IDistributedCache cache, IDataProtectionProvider dpProvider, IRecaptchaVerificationService recaptchaVerificationService)
    {
        _cache = cache;
        _dataProtector = dpProvider.CreateProtector(SessionConstants.AnonymousRequestDataProtectorName).ToTimeLimitedDataProtector();
        _recaptchaVerificationService = recaptchaVerificationService;
    }

    protected void SetValueToResponseCookie(string key, string value)
    {
        var encryptedKeyCode = _dataProtector.Protect(value, DateTimeOffset.UtcNow.AddMinutes(20));
        this.Response.Cookies.Append(key,
            encryptedKeyCode,
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Secure = true,
                Expires = DateTimeOffset.UtcNow.AddMinutes(20)
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
    protected async Task<IEnumerable<LicAppFileInfo>> GetAllNewDocsInfoAsync(IEnumerable<Guid> docKeyCodes, CancellationToken ct)
    {
        if (docKeyCodes == null || !docKeyCodes.Any()) return Enumerable.Empty<LicAppFileInfo>();
        List<LicAppFileInfo> results = new List<LicAppFileInfo>();
        foreach (Guid docKey in docKeyCodes)
        {
            IEnumerable<LicAppFileInfo> items = await _cache.Get<IEnumerable<LicAppFileInfo>>(docKey.ToString());
            if (items.Any())
            {
                results.AddRange(items);
            }
        }
        return results;
    }
}
