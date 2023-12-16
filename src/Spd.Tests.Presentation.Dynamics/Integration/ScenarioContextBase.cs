using System.Reflection;
using Alba;
using Alba.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Dynamics.Integration;

public class WebAppFixture
{
    public IAlbaHost AlbaHost = null!;

    public async Task<IAlbaHost> CreateHost(ITestOutputHelper output, IConfiguration configuration)
    {
        var clientId = configuration.GetValue<string>("jwt:clientId");
        var clientSecret = configuration.GetValue<string>("jwt:clientSecret");
        var scope = "openid";
        var authority = configuration.GetValue<string>("jwt:authority");

        var oidc = new OpenConnectClientCredentials
        {
            ClientId = clientId,
            ClientSecret = clientSecret,
            Scope = scope
        };

        var host = await Alba.AlbaHost.For<Program>(builder =>
        {
            builder.ConfigureServices((ctx, services) =>
            {
                services.AddLogging((builder) => builder.AddXUnit(output));
                services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    options.Authority = authority;
                    options.Audience = clientId;
                });
            });
        }, oidc);

        return host;
    }
}

[CollectionDefinition("WebAppScenario")]
public class ScenarioCollection : ICollectionFixture<WebAppFixture>
{
}

[Collection("WebAppScenario")]
public abstract class ScenarioContextBase : IAsyncLifetime
{
    private readonly ITestOutputHelper output;
    private readonly WebAppFixture fixture;
    private readonly IConfiguration configuration;

    protected IAlbaHost Host { get; private set; } = null!;

    protected ScenarioContextBase(ITestOutputHelper output, WebAppFixture fixture)
    {
        this.output = output;
        this.fixture = fixture;
        this.configuration = new ConfigurationBuilder().AddUserSecrets(Assembly.GetExecutingAssembly(), false).Build();
    }

    public async Task InitializeAsync()
    {
        Host = await fixture.CreateHost(output, configuration);
    }

    public async Task DisposeAsync()
    {
        if (Host != null) await Host.DisposeAsync();
    }
}
