using MediatR;
using Spd.Manager.Membership.UserProfile;
using System.Net;

namespace Spd.Utilities.LogonUser
{
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;

        public UsersMiddleware(RequestDelegate next)
        {
            this.next = next;
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
                ReturnUnauthorized(context, "missing organization in the header.");
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
                ("POST", "api/org-registrations")
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
            //will add to check cache here.
            UserProfileResponse userProfile = await mediator.Send(new GetCurrentUserProfileQuery());
            if (userProfile?.UserInfos == null)
            {
                await ReturnUnauthorized(context, "invalid user");
                return;
            }
            UserInfo ui = userProfile.UserInfos.FirstOrDefault(ui => ui.UserGuid == context.User.GetUserGuid() && ui.OrgId == orgId);
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
