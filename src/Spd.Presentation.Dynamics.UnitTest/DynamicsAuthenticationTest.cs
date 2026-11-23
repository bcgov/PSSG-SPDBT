using System.Net;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Hosting;

namespace Spd.Presentation.Dynamics.UnitTest;

public class DynamicsAuthenticationTest
{
    [Theory]
    [InlineData(null)]
    [InlineData("OnPremise")]
    public async Task OnPremiseUsesExistingPasswordGrant(string? authenticationType)
    {
        var (services, handler) = Configure(authenticationType);
        using var provider = services.BuildServiceProvider();

        var token = await provider.GetRequiredService<ISecurityTokenProvider>().AcquireToken();

        Assert.Equal("test-token", token);
        Assert.Equal("https://adfs.example.com/token", handler.RequestUri);
        Assert.Equal("password", handler.Parameters["grant_type"]);
        Assert.Equal("DOMAIN\\service", handler.Parameters["username"]);
        Assert.Equal("https://dynamics.example.com", handler.Parameters["resource"]);
    }

    [Fact]
    public async Task CloudUsesClientCredentialsAndCachesToken()
    {
        var (services, handler) = Configure("Cloud");
        using var provider = services.BuildServiceProvider();
        var tokenProvider = provider.GetRequiredService<ISecurityTokenProvider>();

        Assert.Equal("test-token", await tokenProvider.AcquireToken());
        Assert.Equal("test-token", await tokenProvider.AcquireToken());
        Assert.Equal(1, handler.RequestCount);
        Assert.Equal("https://login.microsoftonline.com/tenant-id/oauth2/v2.0/token", handler.RequestUri);
        Assert.Equal("client_credentials", handler.Parameters["grant_type"]);
        Assert.Equal("client-id:client-secret", handler.BasicCredentials);
        Assert.Equal("https://dynamics.example.com/.default", handler.Parameters["scope"]);
        Assert.False(handler.Parameters.ContainsKey("username"));
    }

    [Fact]
    public void UnsupportedAuthenticationTypeFailsConfiguration()
    {
        var (services, _) = ConfigureServices("99");
        Assert.Throws<InvalidOperationException>(() => new Configurer().Configure(CreateContext(services, "99")));
    }

    [Fact]
    public async Task CloudWithoutCredentialsFailsBeforeRequest()
    {
        var (services, handler) = Configure("Cloud", includeEntraCredentials: false);
        using var provider = services.BuildServiceProvider();

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => provider.GetRequiredService<ISecurityTokenProvider>().AcquireToken());
        Assert.Equal(0, handler.RequestCount);
    }

    [Fact]
    public async Task CloudTokenFailureIsReported()
    {
        var (services, handler) = Configure("Cloud");
        handler.RejectToken = true;
        using var provider = services.BuildServiceProvider();

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => provider.GetRequiredService<ISecurityTokenProvider>().AcquireToken());

        Assert.Contains("Entra ID token request failed", exception.Message);
        Assert.Equal(1, handler.RequestCount);
    }

    private static (ServiceCollection Services, TokenHandler Handler) Configure(
        string? authenticationType, bool includeEntraCredentials = true)
    {
        var (services, configuration) = ConfigureServices(authenticationType, includeEntraCredentials);
        new Configurer().Configure(new ConfigurationContext(
            services, configuration, Mock.Of<IWebHostEnvironment>(), NullLogger.Instance));
        var handler = new TokenHandler();
        services.AddHttpClient("oauth").ConfigurePrimaryHttpMessageHandler(() => handler);
        return (services, handler);
    }

    private static (ServiceCollection Services, IConfiguration Configuration) ConfigureServices(
        string? authenticationType, bool includeEntraCredentials = true)
    {
        var values = new Dictionary<string, string?>
        {
            ["Dynamics:AuthenticationType"] = authenticationType,
            ["Dynamics:AuthenticationSettings:OAuth2TokenEndpointUrl"] = "https://adfs.example.com/token",
            ["Dynamics:AuthenticationSettings:ClientId"] = "client-id",
            ["Dynamics:AuthenticationSettings:ClientSecret"] = "client-secret",
            ["Dynamics:AuthenticationSettings:ServiceAccountDomain"] = "DOMAIN",
            ["Dynamics:AuthenticationSettings:ServiceAccountName"] = "service",
            ["Dynamics:AuthenticationSettings:ServiceAccountPassword"] = "password",
            ["Dynamics:AuthenticationSettings:ResourceName"] = "https://dynamics.example.com",
            ["Dynamics:EntraId:TenantId"] = "tenant-id",
            ["Dynamics:EntraId:ClientId"] = "client-id",
            ["Dynamics:EntraId:ClientSecret"] = includeEntraCredentials ? "client-secret" : null,
            ["Dynamics:EntraId:ResourceName"] = "https://dynamics.example.com/",
        };
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(values).Build();
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDistributedMemoryCache();
        return (services, configuration);
    }

    private static ConfigurationContext CreateContext(ServiceCollection services, string authenticationType)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["Dynamics:AuthenticationType"] = authenticationType })
            .Build();
        return new ConfigurationContext(services, configuration, Mock.Of<IWebHostEnvironment>(), NullLogger.Instance);
    }

    private sealed class TokenHandler : HttpMessageHandler
    {
        public int RequestCount { get; private set; }
        public string? RequestUri { get; private set; }
        public string? BasicCredentials { get; private set; }
        public bool RejectToken { get; set; }
        public Dictionary<string, string> Parameters { get; private set; } = new();

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            RequestCount++;
            RequestUri = request.RequestUri?.AbsoluteUri;
            if (request.Headers.Authorization is { Scheme: "Basic", Parameter: { } parameter })
                BasicCredentials = Encoding.UTF8.GetString(Convert.FromBase64String(parameter));
            var body = await request.Content!.ReadAsStringAsync(cancellationToken);
            Parameters = QueryHelpers.ParseQuery(body).ToDictionary(pair => pair.Key, pair => pair.Value.ToString());
            if (RejectToken)
                return new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("""{"error":"invalid_client","error_description":"Invalid credentials"}""")
                };
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("""{"access_token":"test-token","token_type":"Bearer","expires_in":3600}""")
            };
        }
    }
}
