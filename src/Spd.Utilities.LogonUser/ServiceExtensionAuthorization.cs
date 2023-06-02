using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Spd.Utilities.LogonUser.Configurations;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Spd.Utilities.LogonUser
{
    public static class ServiceExtensionAuthorization
    {
        public static void ConfigureAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                var onlyBcscPolicyBuilder = new AuthorizationPolicyBuilder(BcscAuthenticationConfiguration.AuthSchemeName);
                options.AddPolicy("OnlyBcsc", 
                    onlyBcscPolicyBuilder.RequireAuthenticatedUser().Build());

                var onlyBceidPolicyBuilder = new AuthorizationPolicyBuilder(BCeIDAuthenticationConfiguration.AuthSchemeName);
                options.AddPolicy("OnlyBCeID",
                    onlyBceidPolicyBuilder.RequireAuthenticatedUser().Build());
            });
        }
    }
}
