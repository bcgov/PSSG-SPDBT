using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.LogonUser.Configurations;

namespace Spd.Presentation.Licensing;

public class UsersMiddleware
{
    private readonly RequestDelegate next;
    private readonly IDistributedCache cache;
    private readonly BcscAuthenticationConfiguration bcscConfig;
    private readonly string BizUserCacheKeyPrefix = "biz-user-";

    public UsersMiddleware(RequestDelegate next, IDistributedCache cache, IConfiguration configuration)
    {
        this.next = next;
        this.cache = cache;
        bcscConfig = configuration
        .GetSection(BcscAuthenticationConfiguration.Name)
        .Get<BcscAuthenticationConfiguration>() ?? throw new InvalidOperationException($"{nameof(BcscAuthenticationConfiguration)} configuration is missing");
    }

    public async Task InvokeAsync(HttpContext context, IMediator mediator)
    {
        if (IPrincipalExtensions.BCeID_IDENTITY_PROVIDERS.Contains(context.User.GetIdentityProvider()))
        {
            //bceid user
            var userIdInfo = context.User.GetBceidUserIdentityInfo();
            ////validate if the bizUserId in httpHeader is correct and add the user role to claims.
            if (context.Request.Headers.TryGetValue("bizUserId", out var userIdStr) && Guid.TryParse(userIdStr, out var userId))
            {
                var userProfile = await cache.GetAsync($"{BizUserCacheKeyPrefix}{userIdInfo.UserGuid}",
                     async ct => await mediator.Send(new BizPortalUserGetQuery(userId), ct),
                     TimeSpan.FromMinutes(30),
                     context.RequestAborted);

                if (userProfile != null)
                {
                    context.User.UpdateUserClaims(userProfile.Id.ToString(), userProfile.BizId.ToString(), userProfile.ContactAuthorizationTypeCode.ToString());
                }
                await next(context);
            }
            else
            {
                await next(context);
            }
        }
        else if (context.User.GetIssuer() == bcscConfig.Issuer)
        {
            await next(context);
        }
        else
        {
            await next(context);
        }
    }
}