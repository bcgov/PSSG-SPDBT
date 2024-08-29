using IdentityModel.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Spd.Utilities.LogonUser.Configurations;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
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
                throw new ConfigurationErrorsException("bceidAuthentication configuration is not set correctly.");

            if (bcscConfig == null)
                throw new ConfigurationErrorsException("bcscAuthentication configuration is not set correctly.");

            if (idirConfig == null)
                throw new ConfigurationErrorsException("idirAuthentication configuration is not set correctly.");

            var defaultScheme = "BCeID_OR_BCSC_OR_IDIR";
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
                options.Authority = bceidConfig.Authority;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidAudiences = new[] { bceidConfig.Audiences },
                    ValidateIssuer = true,
                    ValidIssuers = new[] { bceidConfig.Issuer },
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
                options.Validate();
            })
            .AddJwtBearer(IdirAuthenticationConfiguration.AuthSchemeName, options =>
            {
                options.MetadataAddress = $"{idirConfig.Authority}/.well-known/openid-configuration";
                options.Authority = idirConfig.Authority;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidAudiences = new[] { idirConfig.Audiences },
                    ValidateIssuer = true,
                    ValidIssuers = new[] { idirConfig.Issuer },
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
                options.Validate();
            })
            .AddJwtBearer(BcscAuthenticationConfiguration.AuthSchemeName, options =>
            {
                options.MetadataAddress = $"{bcscConfig.Authority}/.well-known/openid-configuration";
                options.Authority = bcscConfig.Authority;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidAudiences = new[] { bcscConfig.Audiences },
                    ValidateIssuer = true,
                    ValidIssuers = new[] { bcscConfig.Issuer },
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
                        var ct = ctx.HttpContext.RequestAborted;
                        var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<BcscAuthenticationConfiguration>>();
                        var oidcConfig = await ctx.Options.ConfigurationManager!.GetConfigurationAsync(ct);

                        //set token validation parameters
                        var validationParameters = ctx.Options.TokenValidationParameters.Clone();
                        validationParameters.IssuerSigningKeys = oidcConfig.JsonWebKeySet.GetSigningKeys();

                        string tokenStr = ((JsonWebToken)ctx.SecurityToken).EncodedHeader + "."
                            + ((JsonWebToken)ctx.SecurityToken).EncodedPayload + "."
                            + ((JsonWebToken)ctx.SecurityToken).EncodedSignature;

                        var userInfoRequest = new UserInfoRequest
                        {
                            Address = oidcConfig.UserInfoEndpoint,
                            Token = tokenStr
                        };
                        //set the userinfo response to be JWT
                        userInfoRequest.Headers.Accept.Clear();
                        userInfoRequest.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/jwt"));

                        //request userinfo claims through the backchannel
                        var response = await ctx.Options.Backchannel.GetUserInfoAsync(userInfoRequest, ct);
                        if (response != null && !response.IsError && response.HttpStatusCode == HttpStatusCode.OK)
                        {
                            //handle encrypted userinfo response...
                            if (response.HttpResponse?.Content?.Headers?.ContentType?.MediaType == "application/jwt")
                            {
                                var handler = new JwtSecurityTokenHandler();
                                if (handler.CanReadToken(response.Raw))
                                {
                                    var token = await handler.ValidateTokenAsync(response.Raw, validationParameters);
                                    if (token.SecurityToken is JwtSecurityToken jwe)
                                    {
                                        MapClaimsToPrincipalClaims(ctx.Principal!, jwe.Claims);
                                    }
                                }
                            }
                            else if (response.HttpResponse?.Content?.Headers?.ContentType?.MediaType == "application/json")
                            {
                                var claims = JsonSerializer.Deserialize<Dictionary<string, object>>(response.Raw!)!;
                                foreach (var claim in claims)
                                {
                                    string str = claim.Value.ToString()!;
                                    ctx.Principal!.AddUpdateClaim(claim.Key, str);
                                }
                            }
                            else
                            {
                                //...or fail
                                ctx.Fail($"Failed to get userinfo: {response.Error}");
                            }
                        }
                        else
                        {
                            logger.LogError(response?.Exception, "Failed to get userinfo for token {Token}", tokenStr);
                            //handle for all other failures
                            ctx.Fail($"Failed to get userinfo: {response?.Error}");
                        }
                    }
                };
                options.Validate();
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
                            JwtSecurityToken jwtToken = jwtHandler.ReadJwtToken(token);
                            if (bceidConfig.Authority.Equals(jwtToken.Issuer) ||
                                jwtToken.Audiences.Any(a => bceidConfig.Audiences.Equals(a)))
                            {
                                //idir and bceid have the same authoritiy and audience.
                                var identityProviderClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "identity_provider");
                                if (identityProviderClaim != null && identityProviderClaim.Value.Equals("idir", StringComparison.InvariantCultureIgnoreCase))
                                {
                                    return IdirAuthenticationConfiguration.AuthSchemeName;
                                }
                                return BCeIDAuthenticationConfiguration.AuthSchemeName;
                            }
                            else if (jwtToken.Issuer.Equals(bcscConfig.Issuer) ||
                                (jwtToken.Audiences ?? []).Any(a => bcscConfig.Audiences.Equals(a)))
                            {
                                return BcscAuthenticationConfiguration.AuthSchemeName;
                            }
                        }
                        return BCeIDAuthenticationConfiguration.AuthSchemeName;
                    }
                    return BCeIDAuthenticationConfiguration.AuthSchemeName;
                };
                options.Validate();
            });
        }

        private static void MapClaimsToPrincipalClaims(ClaimsPrincipal principal, IEnumerable<Claim> claims)
        {
            foreach (var claim in claims)
            {
                principal.AddUpdateClaim(claim.Type, claim.Value);
            }
        }
    }
}