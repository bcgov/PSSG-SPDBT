using IdentityModel.Client;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Timeout;

namespace Spd.Utilities.Dynamics
{
    public interface ISecurityTokenProvider
    {
        Task<string> AcquireToken(CancellationToken ct = default);
    }

    internal static class DynamicsTokenRequest
    {
        public static Task<TokenResponse> RequestAsync(
            OAuthSettings settings,
            ILogger logger,
            Func<CancellationToken, Task<TokenResponse>> request,
            CancellationToken ct
        )
        {
            var timeoutInMilliSecs = settings.OAuth2TokenRequestTimeoutInMilliSeconds;
            var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromMilliseconds(timeoutInMilliSecs), TimeoutStrategy.Pessimistic);
            var retryPolicy = Policy
                .Handle<TimeoutRejectedException>()
                .WaitAndRetryAsync(
                    settings.OAuth2TokenRequestMaxRetryTimes,
                    _ => TimeSpan.FromMilliseconds(timeoutInMilliSecs),
                    (result, timespan, retryNo, context) =>
                    {
                        logger.LogInformation(
                            "{OperationKey}: Retry number {RetryNo} within {TotalMilliseconds}ms. Get timeout rejection",
                            context.OperationKey,
                            retryNo,
                            timespan.TotalMilliseconds
                        );
                    }
                );
            var wrapper = Policy.WrapAsync(retryPolicy, timeoutPolicy);
            return wrapper.ExecuteAsync(_ => request(ct), new Context("GetDynamicsToken"));
        }
    }
}
