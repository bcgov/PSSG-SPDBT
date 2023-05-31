using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Spd.Utilities.LogonUser.Configurations;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Spd.Utilities.LogonUser
{
    public static class ServiceExtensionAuthentication
    {
        public static void ConfigureAuthentication(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<BCeIDAuthenticationConfiguration>(opts => configuration.GetSection(BCeIDAuthenticationConfiguration.Name).Bind(opts));
            services.Configure<BcscAuthenticationConfiguration>(opts => configuration.GetSection(BcscAuthenticationConfiguration.Name).Bind(opts));

            var bceidConfig = configuration
            .GetSection(BCeIDAuthenticationConfiguration.Name)
            .Get<BCeIDAuthenticationConfiguration>();

            var bcscConfig = configuration
            .GetSection(BcscAuthenticationConfiguration.Name)
            .Get<BcscAuthenticationConfiguration>();

            if (bceidConfig == null)
                throw new ConfigurationErrorsException("bcediAuthentication configuration is not set correctly.");

            if (bcscConfig == null)
                throw new ConfigurationErrorsException("bcscAuthentication configuration is not set correctly.");

            var defaultScheme = BCeIDAuthenticationConfiguration.AuthSchemeName;
            services.AddAuthentication(
                options =>
            {
                options.DefaultScheme = defaultScheme;
                options.DefaultChallengeScheme = defaultScheme;
            }
            )
            .AddJwtBearer(BCeIDAuthenticationConfiguration.AuthSchemeName, options =>
            {
                options.MetadataAddress = $"{bceidConfig.Authority}/.well-known/openid-configuration";
                options.Authority = bceidConfig?.Authority;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidAudiences = new[] { bceidConfig?.Audiences },
                    ValidateIssuer = true,
                    ValidIssuers = new[] { bceidConfig?.Issuer },
                    RequireSignedTokens = true,
                    RequireAudience = true,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(60),
                    NameClaimType = ClaimTypes.Upn,
                    RoleClaimType = ClaimTypes.Role,
                    ValidateActor = true,
                    ValidateIssuerSigningKey = true,
                };
            })
            .AddJwtBearer(BcscAuthenticationConfiguration.AuthSchemeName, options =>
            {
                options.MetadataAddress = $"{bcscConfig.Authority}/.well-known/openid-configuration";
                options.Authority = bcscConfig?.Authority;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidAudiences = new[] { bcscConfig?.Audiences },
                    ValidateIssuer = true,
                    ValidIssuers = new[] { bcscConfig?.Issuer },
                    RequireSignedTokens = true,
                    RequireAudience = true,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(60),
                    NameClaimType = ClaimTypes.Upn,
                    RoleClaimType = ClaimTypes.Role,
                    ValidateActor = true,
                    ValidateIssuerSigningKey = true,
                };
            })
            //.AddPolicyScheme(defaultScheme, defaultScheme, options =>
            //{
            //    options.ForwardDefaultSelector = context =>
            //    {
            //        string authorization = context.Request.Headers[HeaderNames.Authorization];
            //        if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
            //        {
            //            var token = authorization["Bearer ".Length..].Trim();
            //            var jwtHandler = new JwtSecurityTokenHandler();

            //            if (jwtHandler.CanReadToken(token))
            //            {
            //                if (jwtHandler.ReadJwtToken(token).Issuer.Equals(bceidConfig.Authority) ||
            //                    jwtHandler.ReadJwtToken(token).Audiences.Any(a => bceidConfig.Audiences.Contains(a)))
            //                {
            //                    return BCeIDAuthenticationConfiguration.AuthSchemeName;
            //                }
            //                else
            //                if (jwtHandler.ReadJwtToken(token).Issuer.Equals(bcscConfig.Issuer) ||
            //                    jwtHandler.ReadJwtToken(token).Audiences.Any(a => bcscConfig.Audiences.Contains(a)))
            //                {
            //                    return BcscAuthenticationConfiguration.AuthSchemeName;
            //                }
            //            }
            //            return BCeIDAuthenticationConfiguration.AuthSchemeName;
            //        }
            //        return BCeIDAuthenticationConfiguration.AuthSchemeName;
            //    };
            //})
            ;

            services.AddAuthorization(options =>
            {
                var bceidPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes(BCeIDAuthenticationConfiguration.AuthSchemeName)
                    .Build();
                var bcscPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes(BcscAuthenticationConfiguration.AuthSchemeName)
                    .Build();

                options.AddPolicy("bceidUser", bceidPolicy);
                options.AddPolicy("bcscUser", bcscPolicy);
                options.DefaultPolicy = options.GetPolicy("bceidUser")!;
            });

            // Authorization
            //services.AddAuthorization(options =>
            //{
            //    var defaultAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder(
            //        BcscAuthenticationConfiguration.AuthSchemeName,
            //        BCeIDAuthenticationConfiguration.AuthSchemeName);
            //    defaultAuthorizationPolicyBuilder =
            //        defaultAuthorizationPolicyBuilder.RequireAuthenticatedUser();
            //    options.DefaultPolicy = defaultAuthorizationPolicyBuilder.Build();
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
