# Dynamics authentication

`Dynamics:AuthenticationType` defaults to `OnPremise`, which uses the existing ADFS password grant and `Dynamics:AuthenticationSettings` values. Set it to `Cloud` to use Entra ID client credentials instead. Both modes retain the existing OData clients and queries.

For `Cloud`, configure:

- `Dynamics:EntraId:TenantId`: Entra tenant ID
- `Dynamics:EntraId:ClientId`: application client ID
- `Dynamics:EntraId:ClientSecret`: application secret (supply securely, not in source control)
- `Dynamics:EntraId:ResourceName`: Dynamics environment URL, without `/.default`

The Entra token endpoint is derived from the tenant ID, and the token request uses the resource URL with the `/.default` scope. The existing token timeout, retry, and cache-duration settings under `Dynamics:AuthenticationSettings` also apply to Cloud. For environment variables, replace colons with double underscores (for example, `Dynamics__AuthenticationType=Cloud`).
