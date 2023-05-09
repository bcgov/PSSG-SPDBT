using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.Cache;
using System.Net;

namespace Spd.Utilities.LogonUser
{
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IDistributedCache cache;

        public UsersMiddleware(RequestDelegate next, IDistributedCache cache)
        {
            this.next = next;
            this.cache = cache;
        }

        public async Task InvokeAsync(HttpContext context, IMediator mediator)
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
                await ProcessUser(context, mediator, orgIdStr);
            }
            else
            {
                await ReturnUnauthorized(context, "missing organization in the header.");
                return;
            }
            await next(context);
        }

        //endpoints that no authentication needed  
        private static bool NoUserMiddlewareProcessNeededEndpoints(HttpContext context)
        {
            var Endpoints = new List<(string method, string path)>
            {
                ("GET", "api/health"),
                ("GET", "api/user"),
                ("GET", "api/configuration"),
                ("POST", "api/anonymous-org-registrations"),
                ("POST", "api/org-registrations"),
                ("GET", "api/metadata/address"),
                ("POST","api/invitations")
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

        private async Task ProcessUser(HttpContext context, IMediator mediator, string? orgIdStr)
        {
            if (!Guid.TryParse(orgIdStr, out Guid orgId))
            {
                await ReturnUnauthorized(context, "organization is not a valid guid");
                return;
            }
            UserProfileResponse? userProfile = await cache.Get<UserProfileResponse>($"user-{context.User.GetUserGuid()}");
            if (userProfile == null)
            {
                userProfile = await mediator.Send(new GetCurrentUserProfileQuery());
                await cache.Set<UserProfileResponse>($"user-{context.User.GetUserGuid()}", userProfile, new TimeSpan(0, 30, 0));
            }

            if (userProfile?.UserInfos == null)
            {
                await ReturnUnauthorized(context, "invalid user");
                return;
            }
            UserInfo? ui = userProfile.UserInfos.FirstOrDefault(ui => ui.UserGuid == context.User.GetUserGuid() && ui.OrgId == orgId);
            if (ui == null)
            {
                await ReturnUnauthorized(context, "invalid user or organization");
                return;
            }
            //add ui to claims
            context.User.UpdateUserClaims(ui.UserId.ToString(), orgId.ToString());
        }

        private async Task ReturnUnauthorized(HttpContext context, string msg)
        {
            context.Response.Clear();
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsync(msg);
        }
    }
}
