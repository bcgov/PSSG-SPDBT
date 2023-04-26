using MediatR;
using Microsoft.AspNetCore.Http;
using Spd.Manager.Membership.OrgUser;
using Spd.Utilities.Shared.Exceptions;
using System.Security.Principal;

namespace Spd.Utilities.LogonUser
{
    //this middleware has no function yet. Leave it here for future use.
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

            if(context.Request.Headers.TryGetValue("organization", out var orgStr))
            {
                ProcessUser(context.User, mediator, orgStr);
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

        private async Task ProcessUser(IPrincipal user, IMediator mediator, string orgStr)
        {
            if (!Guid.TryParse(orgStr, out Guid orgId))
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "organization is not a valid guid");
            }
            var users = await mediator.Send(new OrgUserListQuery(orgId));
        }

    }
}
