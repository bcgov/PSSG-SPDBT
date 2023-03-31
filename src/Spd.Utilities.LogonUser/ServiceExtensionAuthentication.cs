using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Spd.Utilities.LogonUser.Configurations;
using System.Security.Claims;

namespace Spd.Utilities.LogonUser
{
    public static class ServiceExtensionAuthentication
    {
        public static void ConfigureAuthentication(this IServiceCollection services,
            IConfiguration configuration)
        {
            //services.Configure<BCeIDAuthenticationConfiguration>(opts => configuration.GetSection(BCeIDAuthenticationConfiguration.Name).Bind(opts));

            //var bceidConfig = configuration
            //.GetSection(BCeIDAuthenticationConfiguration.Name)
            //.Get<BCeIDAuthenticationConfiguration>();

            //if (bceidConfig == null)
            //    throw new Exception("bcediAuthentication configuration is not set correctly.");

            //services.AddAuthentication(options =>
            //{
            //    options.DefaultScheme = BCeIDAuthenticationConfiguration.AuthSchemeName;
            //}).AddJwtBearer(BCeIDAuthenticationConfiguration.AuthSchemeName, options =>
            //{
            //    options.MetadataAddress = $"{bceidConfig.Authority}/.well-known/openid-configuration";
            //    options.Authority = bceidConfig?.Authority;
            //    options.RequireHttpsMetadata = true;
            //    options.TokenValidationParameters = new TokenValidationParameters
            //    {
            //        ValidateAudience = true,
            //        ValidAudiences = new[] { bceidConfig?.Audiences },
            //        ValidateIssuer = true,
            //        ValidIssuers = new[] { bceidConfig?.Issuer },
            //        RequireSignedTokens = true,
            //        RequireAudience = true,
            //        RequireExpirationTime = true,
            //        ValidateLifetime = true,
            //        ClockSkew = TimeSpan.FromSeconds(60),
            //        NameClaimType = ClaimTypes.Upn,
            //        RoleClaimType = ClaimTypes.Role,
            //        ValidateActor = true,
            //        ValidateIssuerSigningKey = true,
            //    };

            //});
            //services.AddAuthorization(options =>
            //{
            //    options.AddPolicy(BCeIDAuthenticationConfiguration.AuthSchemeName, policy =>
            //    {
            //        policy.AddAuthenticationSchemes(BCeIDAuthenticationConfiguration.AuthSchemeName)
            //            .RequireAuthenticatedUser();
            //        //.RequireClaim("user_role")
            //        //.RequireClaim("user_team");
            //    });
            //    options.DefaultPolicy = options.GetPolicy(BCeIDAuthenticationConfiguration.AuthSchemeName) ?? null!;
            //});
        }
    }
}
