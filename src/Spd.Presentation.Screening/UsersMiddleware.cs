using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.Cache;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Shared;
using System.Net;
using System.Security.Claims;

namespace Spd.Utilities.LogonUser
{
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IDistributedCache cache;
        private readonly IMapper mapper;
        private readonly BCeIDAuthenticationConfiguration? bceidConfig;
        private readonly BcscAuthenticationConfiguration? bcscConfig;

        public UsersMiddleware(RequestDelegate next, IDistributedCache cache, IConfiguration configuration, IMapper mapper)
        {
            this.next = next;
            this.cache = cache;
            this.mapper = mapper;
            bceidConfig = configuration
                .GetSection(BCeIDAuthenticationConfiguration.Name)
                .Get<BCeIDAuthenticationConfiguration>();

            bcscConfig = configuration
            .GetSection(BcscAuthenticationConfiguration.Name)
            .Get<BcscAuthenticationConfiguration>();
        }

        public async Task InvokeAsync(HttpContext context, IMediator mediator)
        {
            if (context.User.GetIssuer() == bceidConfig.Issuer) //bceid and idir have the same issuer
            {
                if (NoUserMiddlewareProcessNeededEndpoints(context) ||
                    context.User.Identity == null ||
                    !context.User.Identity.IsAuthenticated)
                {
                    await next(context);
                    return;
                }

                if (context.Request.Headers.TryGetValue("organization", out var orgIdStr))
                {
                    bool isSuccess = await ProcessUser(context, mediator, orgIdStr);
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
            else if (context.User.GetIssuer() == bcscConfig.Issuer)
            {
                var applicantInfo = context.User.GetApplicantIdentityInfo();
                //we need to differentiate if current user-applicant has account in spd db. If yes, add role applicant.
                ApplicantProfileResponse? appProfile = await cache.Get<ApplicantProfileResponse>($"applicant-{applicantInfo.Sub}");
                if (appProfile == null)
                {
                    appProfile = await mediator.Send(new GetApplicantProfileQuery(applicantInfo.Sub));
                    if (appProfile != null)
                        await cache.Set($"applicant-{applicantInfo.Sub}", appProfile, new TimeSpan(0, 30, 0));
                }

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

        //endpoints that no authentication needed  
        private static bool NoUserMiddlewareProcessNeededEndpoints(HttpContext context)
        {
            var Endpoints = new List<(string method, string path)>
            {
                ("GET", "api/health"),
                ("GET", "api/users/whoami"),
                ("GET", "api/idir-users/whoami"),
                ("GET", "api/configuration"),
                ("GET", "api/metadata/address"),
                ("GET", "api/org-registrations"),
                ("GET", "api/orgs/access-code"),
                ("POST", "api/anonymous-org-registrations"),
                ("POST", "api/org-registrations"),
                ("POST", "api/user/invitation"),
                ("POST", "api/applicants/invites")
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

        private async Task<bool> ProcessUser(HttpContext context, IMediator mediator, string? orgIdStr)
        {
            if (!Guid.TryParse(orgIdStr, out Guid orgId))
            {
                await ReturnUnauthorized(context, "organization is not a valid guid");
                return false;
            }

            //the user is from idir, so, should be bc gov
            if (context.User.GetIdentityProvider() == IPrincipalExtensions.IDIR_IDENTITY_PROVIDER)
            {
                return await ProcessIdirUser(orgId, context, mediator);
            }

            //the user is from bceid
            if (IPrincipalExtensions.BCeID_IDENTITY_PROVIDERS.Contains(context.User.GetIdentityProvider()))
            {
                return await ProcessBceidUser(orgId, context, mediator);
            }
            return true;
        }

        private async Task ReturnUnauthorized(HttpContext context, string msg)
        {
            context.Response.Clear();
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsync(msg);
        }

        private async Task<bool> ProcessIdirUser(Guid orgId, HttpContext context, IMediator mediator)
        {
            if (orgId != SpdConstants.BC_GOV_ORG_ID)
            {
                await ReturnUnauthorized(context, "invalid user or organization");
                return false;
            }
            IdirUserProfileResponse? idirUserProfile = await cache.Get<IdirUserProfileResponse>($"idir-user-{context.User.GetUserGuid()}");
            if (idirUserProfile == null)
            {
                var idirUserInfo = context.User.GetIdirUserIdentityInfo();
                idirUserProfile = await mediator.Send(new ManageIdirUserCommand(mapper.Map<IdirUserIdentity>(idirUserInfo)));
                await cache.Set<IdirUserProfileResponse>($"idir-user--{context.User.GetUserGuid()}", idirUserProfile, new TimeSpan(0, 30, 0));
            }
            context.User.UpdateUserClaims(Guid.Empty.ToString(), orgId.ToString(), "BCGovStaff");
            return true;
        }

        private async Task<bool> ProcessBceidUser(Guid orgId, HttpContext context, IMediator mediator)
        {
            //validate if the orgId in httpHeader is belong to this user and add the user role to claims.
            OrgUserProfileResponse? userProfile = await cache.Get<OrgUserProfileResponse>($"user-{context.User.GetUserGuid()}");
            if (userProfile == null)
            {
                var userIdInfo = context.User.GetPortalUserIdentityInfo();
                userProfile = await mediator.Send(new GetCurrentUserProfileQuery(mapper.Map<PortalUserIdentity>(userIdInfo)));
                await cache.Set<OrgUserProfileResponse>($"user-{context.User.GetUserGuid()}", userProfile, new TimeSpan(0, 30, 0));
            }

            if (userProfile?.UserInfos == null)
            {
                await ReturnUnauthorized(context, "invalid user");
                return false;
            }
            UserInfo? ui = userProfile.UserInfos.FirstOrDefault(ui => ui.UserGuid == context.User.GetUserGuid() && ui.OrgId == orgId);
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
