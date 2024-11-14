using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Alba;

namespace Spd.Tests.Presentation.Screening.Integration;

public static class AuthenticationHelper
{
    public static Scenario WithBceidUser(this Scenario scenario, string userGuid, string orgGuid)
    {
        scenario
            .WithClaim("bceid_user_guid", userGuid)
            .WithClaim("bceid_username", "bceid_user")
            .WithClaim("bceid_business_guid", orgGuid)
            .WithClaim("identity_provider", "bceidbusiness")
            .WithClaim("iss", "bceidbusiness")
            .WithClaim("aud", "spd-screening-portal-4830")
            .WithClaim(JwtRegisteredClaimNames.Email, "bceid_user@test.gov.bc.ca")
            ;

        return scenario;
    }

    public static Scenario WithBcscUser(this Scenario scenario, string userGuid)
    {
        scenario
            .WithClaim("identity_provider", "bcsc")
            .WithClaim("iss", "bcsc")
            .WithClaim("sub", userGuid)
            .WithClaim("address", "some address")
            .WithClaim("birthdate", "2000-0101")
            .WithClaim("family_name", "bcsc_family")
            .WithClaim("given_name", "bcsc_given")
            .WithClaim("aud", "spd-screening-portal")
            .WithClaim(JwtRegisteredClaimNames.Email, "bcsc_user@test.gov.bc.ca")
            ;

        return scenario;
    }

    public static Scenario WithClaim(this Scenario scenario, string type, string value)
    {
        scenario.WithClaim(new Claim(type, value));

        return scenario;
    }
}