using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.Cache;
using Spd.Utilities.LogonUser.Configurations;
using System.Net;
using System.Security.Claims;
using System.Text.Json;

namespace Spd.Utilities.LogonUser
{
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IDistributedCache cache;
        private readonly BCeIDAuthenticationConfiguration bceidConfig;
        private readonly BcscAuthenticationConfiguration bcscConfig;

        public UsersMiddleware(RequestDelegate next, IDistributedCache cache, IConfiguration configuration)
        {
            this.next = next;
            this.cache = cache;
            bceidConfig = configuration
                .GetSection(BCeIDAuthenticationConfiguration.Name)
                .Get<BCeIDAuthenticationConfiguration>();

            bcscConfig = configuration
            .GetSection(BcscAuthenticationConfiguration.Name)
            .Get<BcscAuthenticationConfiguration>();
        }

        public async Task InvokeAsync(HttpContext context, IMediator mediator)
        {
            if (context.User.GetIssuer() == bceidConfig.Issuer)
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
                string? userInfoStr = context.User.Claims.FirstOrDefault(c => c.Type == "userInfo")?.Value;
                context.User.AddUpdateClaim(IPrincipalExtensions.BCeID_DISPLAY_USER_NAME, GetDisplayName(userInfoStr)??string.Empty);
                context.User.AddUpdateClaim(ClaimTypes.Role, "Applicant");
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
                ("GET", "api/user"),
                ("GET", "api/configuration"),
                ("GET", "api/metadata/address"),
                ("POST", "api/anonymous-org-registrations"),
                ("POST", "api/org-registrations"),
                ("POST", "api/user/invitation"),
                ("GET", "api/org-registrations"),
                ("POST", "api/application/invitation"),
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

            UserProfileResponse? userProfile = await cache.Get<UserProfileResponse>($"user-{context.User.GetUserGuid()}");
            if (userProfile == null)
            {
                userProfile = await mediator.Send(new GetCurrentUserProfileQuery());
                await cache.Set<UserProfileResponse>($"user-{context.User.GetUserGuid()}", userProfile, new TimeSpan(0, 30, 0));
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

        private async Task ReturnUnauthorized(HttpContext context, string msg)
        {
            context.Response.Clear();
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsync(msg);
        }

        private string? GetDisplayName(string userInfoStr)
        {
            //bcsc returned userinfo would be like
            //{"sub":"A5VOX7AS6AULXIV2QPMY7R4JLOFHUTFW","birthdate":"1972-04-13","email_verified":true,"gender":"female","iss":"https://idtest.gov.bc.ca/oauth2/","given_name":"GIVENONE","given_names":"GIVENONE GIVENTWO","display_name":"GIVENONE SURNAME","aud":"ca.bc.gov.ag.spd.dev","transaction_identifier":"715efacb-591b-456d-8e6c-eec6be724a71","family_name":"SURNAME","iat":1685752338,"email":"SPD00001@TEST.COM","age":51,"jti":"872ab531-21bc-44e8-b86f-60dc0dd2a9f1"}
            JsonDocument jd = JsonDocument.Parse(userInfoStr);
            string? displayname = jd.RootElement.GetProperty("display_name").GetString();
            return displayname;

        }
    }
}
