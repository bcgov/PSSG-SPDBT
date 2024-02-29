using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Cache;
using Spd.Utilities.LogonUser;
using Spd.Utilities.LogonUser.Configurations;
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

                //todo: do not know what biz user would be like yet.
                //var userIdInfo = context.User.GetBceidUserIdentityInfo();
                ////validate if the orgId in httpHeader is belong to this user and add the user role to claims.
                //OrgUserProfileResponse? userProfile = await cache.Get<OrgUserProfileResponse>($"{BizUserCacheKeyPrefix}{userIdInfo.UserGuid}");
                //if (userProfile == null || userProfile.UserInfos.Any(u => u.UserId == Guid.Empty))
                //{
                //    userProfile = await mediator.Send(new GetCurrentUserProfileQuery(mapper.Map<PortalUserIdentity>(userIdInfo)));
                //    await cache.Set<OrgUserProfileResponse>($"{BizUserCacheKeyPrefix}{userIdInfo.UserGuid}", userProfile, new TimeSpan(0, 30, 0));
                //}

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
    }
}