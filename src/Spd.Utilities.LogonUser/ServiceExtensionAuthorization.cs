using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.LogonUser.Configurations;

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

                var onlyIdirPolicyBuilder = new AuthorizationPolicyBuilder(IdirAuthenticationConfiguration.AuthSchemeName);
                options.AddPolicy("OnlyIdir",
                    onlyIdirPolicyBuilder.RequireAuthenticatedUser().Build());

                var onlyBceidPolicyBuilder = new AuthorizationPolicyBuilder(BCeIDAuthenticationConfiguration.AuthSchemeName);
                options.AddPolicy("OnlyBCeID",
                    onlyBceidPolicyBuilder.RequireAuthenticatedUser().Build());

                var bceidBcscPolicyBuilder = new AuthorizationPolicyBuilder(BCeIDAuthenticationConfiguration.AuthSchemeName, BcscAuthenticationConfiguration.AuthSchemeName);
                options.AddPolicy("BcscBCeID",
                    bceidBcscPolicyBuilder.RequireAuthenticatedUser().Build());
            });
        }
    }
}