using System.Net;
using System.Security.Claims;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Screening;
using Spd.Utilities.LogonUser;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening
{
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IDistributedCache cache;
        private readonly IMapper mapper;
        private readonly ILogger<UsersMiddleware> logger;
        private readonly BCeIDAuthenticationConfiguration? bceidConfig;
        private readonly BcscAuthenticationConfiguration? bcscConfig;
        private readonly string OrgUserCacheKeyPrefix = "user-";
        private readonly string ApplicantCacheKeyPrefix = "applicant-";
        private readonly string IdirUserCacheKeyPrefix = "idir-user-";

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
                if (NoUserMiddlewareProcessNeededEndpoints(context) ||
                    context.User.Identity == null ||
                    !context.User.Identity.IsAuthenticated)
                {
                    await next(context);
                    return;
                }

                if (context.Request.Headers.TryGetValue("organization", out var orgIdStr))
                {
                    bool isSuccess = await ProcessBceidUser(orgIdStr, context, mediator);
                    if (isSuccess)
                    {
                        await next(context);
                    }
                }
                else
                {
                    await ReturnUnauthorized(context, "missing organization in the header.");
                }
            }
            else if (context.User.GetIdentityProvider() == IPrincipalExtensions.IDIR_IDENTITY_PROVIDER)
            {
                //idir user
                bool isSuccess = await ProcessIdirUser(SpdConstants.BcGovOrgId, context, mediator);
                if (isSuccess)
                {
                    await next(context);
                }
            }
            else if (context.User.GetIssuer() == bcscConfig.Issuer)
            {
                //bcsc user
                var applicantInfo = context.User.GetBcscUserIdentityInfo();
                //we need to differentiate if current user-applicant has account in spd db. If yes, add role applicant.
                var appProfile = await cache.GetAsync($"{ApplicantCacheKeyPrefix}{applicantInfo.Sub}",
                    async ct => await mediator.Send(new GetApplicantProfileQuery(applicantInfo.Sub), ct),
                    TimeSpan.FromMinutes(30),
                    context.RequestAborted);

                if (appProfile != null)
                {
                    context.User.AddUpdateClaim(ClaimTypes.Role, "Applicant");
                }
                await next(context);
            }
            else
            {
                await next(context);
            }
        }

        private static bool NoUserMiddlewareProcessNeededEndpoints(HttpContext context)
        {
            var Endpoints = new List<(string method, string path)>
            {
                ("GET", "api/health"),
                ("GET", "api/ministries"),
                ("GET", "api/users/whoami"),
                ("GET", "api/configuration"),
                ("GET", "api/metadata/address"),
                ("GET", "api/org-registrations"),
                ("GET", "api/orgs/access-code"),
                ("POST", "api/anonymous-org-registrations"),
                ("POST", "api/org-registrations"),
                ("POST", "api/user/invitation"),
                ("POST", "api/applicants/invites"),
                ("GET", "api/orgs/add-bceid-primary-users")
            };

            if (context.Request.Path.HasValue)
            {
                foreach (var (method, path) in Endpoints)
                {
                    if (context.Request.Path.Value.Contains(path, StringComparison.OrdinalIgnoreCase) &&
                        method == context.Request.Method)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private async Task ReturnUnauthorized(HttpContext context, string msg)
        {
            context.Response.Clear();
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            context.Response.ContentType = "text/plain";
            await context.Response.WriteAsync(msg);
        }

        private async Task<bool> ProcessIdirUser(Guid orgId, HttpContext context, IMediator mediator)
        {
            var idirUserIdentityInfo = context.User.GetIdirUserIdentityInfo();
            var idirUserProfile = await cache.GetAsync($"{IdirUserCacheKeyPrefix}{idirUserIdentityInfo.UserGuid}",
                async ct => await mediator.Send(new GetIdirUserProfileQuery(mapper.Map<IdirUserIdentity>(idirUserIdentityInfo)), ct),
                TimeSpan.FromMinutes(30),
                context.RequestAborted);
            if (idirUserProfile == null) return true;

            logger.LogDebug("ProcessIdirUser -{IdirUserProfile}", idirUserProfile);
            if (idirUserProfile.UserId.HasValue)
                context.User.UpdateUserClaims(idirUserProfile.UserId.ToString()!, orgId.ToString(), "BCGovStaff", idirUserProfile.IsPSA);
            return true;
        }

        private async Task<bool> ProcessBceidUser(string orgIdStr, HttpContext context, IMediator mediator)
        {
            if (!Guid.TryParse(orgIdStr, out Guid orgId))
            {
                await ReturnUnauthorized(context, "organization is not a valid guid");
                return false;
            }

            var userIdInfo = context.User.GetBceidUserIdentityInfo();
            //validate if the orgId in httpHeader is belong to this user and add the user role to claims.
            var userProfile = await cache.GetAsync($"{OrgUserCacheKeyPrefix}{userIdInfo.UserGuid}",
                async ct => await mediator.Send(new GetCurrentUserProfileQuery(mapper.Map<PortalUserIdentity>(userIdInfo)), ct),
                TimeSpan.FromMinutes(30),
                context.RequestAborted);

            if (userProfile?.UserInfos == null)
            {
                await ReturnUnauthorized(context, "invalid user");
                return false;
            }
            UserInfo? ui = userProfile.UserInfos.FirstOrDefault(ui => ui.UserGuid == userIdInfo.UserGuid && ui.OrgId == orgId);
            if (ui == null)
            {
                await ReturnUnauthorized(context, "invalid user or organization");
                return false;
            }
            //add ui to claims
            context.User.UpdateUserClaims(ui.UserId.ToString(), orgId.ToString(), ui.ContactAuthorizationTypeCode.ToString());
            return true;
        }
    }
}