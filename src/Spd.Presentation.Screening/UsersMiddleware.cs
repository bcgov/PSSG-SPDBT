using MediatR;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.Shared.Exceptions;
using System.Security.Claims;

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
                await ProcessUser(context.User, mediator, orgIdStr);
            }
            else
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "missing organization in the header.");
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

        private async Task ProcessUser(ClaimsPrincipal user, IMediator mediator, string? orgIdStr)
        {
            if (!Guid.TryParse(orgIdStr, out Guid orgId))
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "organization is not a valid guid");
            }
            //will add to check cache here.
            UserProfileResponse userProfile = await mediator.Send(new GetCurrentUserProfileQuery());
            if (userProfile?.UserInfos == null)
            {
                throw new ApiException(System.Net.HttpStatusCode.Unauthorized, "invalid user");
            }
            UserInfo ui = userProfile.UserInfos.FirstOrDefault(ui => ui.UserGuid == user.GetUserGuid() && ui.OrgId == orgId);
            if (ui == null)
            {
                throw new ApiException(System.Net.HttpStatusCode.Unauthorized, "invalid user or organization");
            }
            //add ui to claims
            user.UpdateUserClaims(ui.UserId.ToString(), orgId.ToString());
        }

    }
}
