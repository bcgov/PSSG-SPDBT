using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Spd.Utilities.LogonUser.Configurations;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net;
using System.Security.Claims;
using IdentityModel.Client;
using System.Text.Json;

namespace Spd.Utilities.LogonUser
{
    public static class ServiceExtensionAuthentication
    {
        public static void ConfigureAuthentication(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<BCeIDAuthenticationConfiguration>(opts => configuration.GetSection(BCeIDAuthenticationConfiguration.Name).Bind(opts));
            services.Configure<BcscAuthenticationConfiguration>(opts => configuration.GetSection(BcscAuthenticationConfiguration.Name).Bind(opts));
            services.Configure<IdirAuthenticationConfiguration>(opts => configuration.GetSection(IdirAuthenticationConfiguration.Name).Bind(opts));

            var bceidConfig = configuration
            .GetSection(BCeIDAuthenticationConfiguration.Name)
            .Get<BCeIDAuthenticationConfiguration>();

            var bcscConfig = configuration
            .GetSection(BcscAuthenticationConfiguration.Name)
            .Get<BcscAuthenticationConfiguration>();

            var idirConfig = configuration
            .GetSection(IdirAuthenticationConfiguration.Name)
            .Get<IdirAuthenticationConfiguration>();

            if (bceidConfig == null)
                throw new ConfigurationErrorsException("bcediAuthentication configuration is not set correctly.");

            if (bcscConfig == null)
                throw new ConfigurationErrorsException("bcscAuthentication configuration is not set correctly.");

            if (idirConfig == null)
                throw new ConfigurationErrorsException("idirAuthentication configuration is not set correctly.");

            var defaultScheme = "BCeID_OR_BCSC";
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
            .AddJwtBearer(IdirAuthenticationConfiguration.AuthSchemeName, options =>
            {
                options.MetadataAddress = $"{idirConfig.Authority}/.well-known/openid-configuration";
                options.Authority = idirConfig?.Authority;
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
                options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
                {
                    OnTokenValidated = async ctx =>
                    {
                        var oidcConfig = await ctx.Options.ConfigurationManager.GetConfigurationAsync(CancellationToken.None);

                        //set token validation parameters
                        var validationParameters = ctx.Options.TokenValidationParameters.Clone();
                        validationParameters.IssuerSigningKeys = oidcConfig.JsonWebKeySet.GetSigningKeys();
                        validationParameters.ValidateLifetime = false;
                        validationParameters.ValidateIssuer = false;

                        var userInfoRequest = new UserInfoRequest
                        {
                            Address = oidcConfig.UserInfoEndpoint,
                            Token = ((JwtSecurityToken)ctx.SecurityToken).RawData
                        };
                        //set the userinfo response to be JWT
                        userInfoRequest.Headers.Accept.Clear();
                        userInfoRequest.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/jwt"));

                        //request userinfo claims through the backchannel
                        var response = await ctx.Options.Backchannel.GetUserInfoAsync(userInfoRequest, CancellationToken.None);
                        if (response.IsError && response.HttpStatusCode == HttpStatusCode.OK)
                        {
                            //handle encrypted userinfo response...
                            if (response.HttpResponse.Content?.Headers?.ContentType?.MediaType == "application/jwt")
                            {
                                var handler = new JwtSecurityTokenHandler();
                                if (handler.CanReadToken(response.Raw))
                                {
                                    handler.ValidateToken(response.Raw, validationParameters, out var token);
                                    var jwe = token as JwtSecurityToken;
                                    MapClaimsToPrincipalClaims(ctx.Principal, jwe.Claims);
                                }
                            }
                            else
                            {
                                //...or fail
                                ctx.Fail(response.Error);
                            }
                        }
                        else if (response.IsError)
                        {
                            //handle for all other failures
                            ctx.Fail(response.Error);
                        }
                        else
                        {
                            //handle non encrypted
                            JsonDocument jd = JsonDocument.Parse(response.Json.GetRawText()); 
                            var claims = jd.RootElement.ToClaims();
                            MapClaimsToPrincipalClaims(ctx.Principal, claims);
                        }
                    }
                };
            })
            .AddPolicyScheme(defaultScheme, defaultScheme, options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    string? authorization = context.Request.Headers[HeaderNames.Authorization];
                    if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
                    {
                        var token = authorization["Bearer ".Length..].Trim();
                        var jwtHandler = new JwtSecurityTokenHandler();

                        if (jwtHandler.CanReadToken(token))
                        {
                            if (jwtHandler.ReadJwtToken(token).Issuer.Equals(bceidConfig.Authority) ||
                                jwtHandler.ReadJwtToken(token).Audiences.Any(a => bceidConfig.Audiences.Contains(a)))
                            {
                                return BCeIDAuthenticationConfiguration.AuthSchemeName;
                            }
                            else if (jwtHandler.ReadJwtToken(token).Issuer.Equals(bcscConfig.Issuer) ||
                                jwtHandler.ReadJwtToken(token).Audiences.Any(a => bcscConfig.Audiences.Contains(a)))
                            {
                                return BcscAuthenticationConfiguration.AuthSchemeName;
                            }
                        }
                        return BCeIDAuthenticationConfiguration.AuthSchemeName;
                    }
                    return BCeIDAuthenticationConfiguration.AuthSchemeName;
                };
            });
        }

        private static void MapClaimsToPrincipalClaims(ClaimsPrincipal principal, IEnumerable<Claim> claims)
        {
            foreach(var claim in claims) 
            {
                principal.AddUpdateClaim(claim.Type, claim.Value);
            }
        }
    }
}
