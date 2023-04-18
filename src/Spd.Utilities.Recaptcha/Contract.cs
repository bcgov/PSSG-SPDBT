namespace Spd.Utilities.Recaptcha;
public interface IRecaptchaVerificationService
{
    public Task<bool> VerifyAsync(string clientResponse, CancellationToken ct);
}
