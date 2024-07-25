using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Cache;
using Spd.Utilities.LogonUser;
using Spd.Utilities.LogonUser.Configurations;
using System.Net;
using System.Security.Claims;

namespace Spd.Presentation.Licensing
{
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IDistributedCache cache;
        private readonly IMapper mapper;
        private readonly ILogger<UsersMiddleware> logger;
        private readonly BCeIDAuthenticationConfiguration? bceidConfig;
        private readonly BcscAuthenticationConfiguration? bcscConfig;
        private readonly string BizUserCacheKeyPrefix = "biz-user-";
        private readonly string WorkerCacheKeyPrefix = "security-worker-";

        public UsersMiddleware(RequestDelegate next, IDistributedCache cache, IConfiguration configuration, IMapper mapper, ILogger<UsersMiddleware> logger)
        {
            this.next = next;
            this.cache = cache;
            this.mapper = mapper;
            this.logger = logger;
            bceidConfig = configuration
                .GetSection(BCeIDAuthenticationConfiguration.Name)
                .Get<BCeIDAuthenticationConfiguration>();

            bcscConfig = configuration
            .GetSection(BcscAuthenticationConfiguration.Name)
            .Get<BcscAuthenticationConfiguration>();
        }

        public async Task InvokeAsync(HttpContext context, IMediator mediator)
        {
            if (IPrincipalExtensions.BCeID_IDENTITY_PROVIDERS.Contains(context.User.GetIdentityProvider()))
            {
                //bceid user
                //var userIdInfo = context.User.GetBceidUserIdentityInfo();
                if (context.Request.Headers.TryGetValue("business", out var bizIdStr))
                {
                    bool isSuccess = await ProcessBceidUser(bizIdStr, context, mediator);
                    if (isSuccess)
                    {
                        await next(context);
                    }
                }

                //if (userProfile != null)
                {
                    context.User.AddUpdateClaim(ClaimTypes.Role, "BizLicencee");
                }
                await next(context);
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

        private async Task<bool> ProcessBceidUser(string bizIdStr, HttpContext context, IMediator mediator)
        {
            if (!Guid.TryParse(bizIdStr, out Guid bizId))
            {
                await ReturnUnauthorized(context, "business is not a valid guid");
                return false;
            }

            var userIdInfo = context.User.GetBceidUserIdentityInfo();
            //validate if the orgId in httpHeader is belong to this user and add the user role to claims.
            OrgUserProfileResponse? userProfile = await cache.Get<OrgUserProfileResponse>($"{OrgUserCacheKeyPrefix}{userIdInfo.UserGuid}");
            if (userProfile == null || userProfile.UserInfos.Any(u => u.UserId == Guid.Empty))
            {
                userProfile = await mediator.Send(new GetCurrentUserProfileQuery(mapper.Map<PortalUserIdentity>(userIdInfo)));
                await cache.Set($"{OrgUserCacheKeyPrefix}{userIdInfo.UserGuid}", userProfile, new TimeSpan(0, 30, 0));
            }

            //add ui to claims
            context.User.UpdateUserClaims(ui.UserId.ToString(), orgId.ToString(), ui.ContactAuthorizationTypeCode.ToString());
            return true;
        }

        private async Task ReturnUnauthorized(HttpContext context, string msg)
        {
            context.Response.Clear();
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsync(msg);
        }
    }
}