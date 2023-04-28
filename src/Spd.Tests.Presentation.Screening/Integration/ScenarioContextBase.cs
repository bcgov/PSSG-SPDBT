using Alba;
using Alba.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Dynamics;
using System.IdentityModel.Tokens.Jwt;
using Xunit;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration;

public class WebAppFixture
{
    public static readonly Guid LOGON_USER_GUID = Guid.Parse("946597A702244BA0884BDC3AC8CB21B6");
    public static readonly Guid LOGON_ORG_GUID = Guid.Parse("EBB1709425324FD8BEFCB6BBCD679DF2");
    public IAlbaHost albaHost = null!;
    public IAlbaHost albaNoAuthMockHost = null!;
    public DynamicsTestData testData { get; set; } = null!;

    public async Task<IAlbaHost> CreateHost(ITestOutputHelper output, IConfiguration configuration)
    {
        var bceidStub = new JwtSecurityStub()
            .With("bceid_user_guid", LOGON_USER_GUID.ToString())
            .With("bceid_username", "VictoriaCharity")
            .With("bceid_business_guid", LOGON_ORG_GUID.ToString())
            .With("identity_provider", "bceidboth")
            .With(JwtRegisteredClaimNames.Email, "guy@company.com")
            .WithName("SPD_TEST");

        albaHost = await Alba.AlbaHost.For<Program>(bceidStub);
        return albaHost;
    }

    public async Task<IAlbaHost> CreateNoAuthMockHost(ITestOutputHelper output, IConfiguration configuration)
    {
        albaNoAuthMockHost = await Alba.AlbaHost.For<Program>();
        return albaNoAuthMockHost;
    }

    public async Task CreateDynamicsData()
    {
        testData = new DynamicsTestData(albaHost.Services.CreateScope().ServiceProvider.GetRequiredService<IDynamicsContextFactory>());
    }
}

[CollectionDefinition("WebAppScenario")]
public class ScenarioCollection : ICollectionFixture<WebAppFixture>
{
}

[Collection("WebAppScenario")]
public abstract class ScenarioContextBase : IAsyncLifetime
{
    protected readonly ITestOutputHelper output;
    protected readonly WebAppFixture fixture;
    private readonly IConfiguration configuration;

    protected IAlbaHost Host { get; private set; } = null!;
    protected IAlbaHost NoMockAuthHost { get; private set; } = null!;

    protected ScenarioContextBase(ITestOutputHelper output, WebAppFixture fixture)
    {
        this.output = output;
        this.fixture = fixture;
        //this.configuration = new ConfigurationBuilder().AddUserSecrets(Assembly.GetExecutingAssembly(), false).Build();
    }

    public async Task InitializeAsync()
    {
        Host = await fixture.CreateHost(output, configuration);
        NoMockAuthHost=await fixture.CreateNoAuthMockHost(output, configuration);
        await fixture.CreateDynamicsData();
    }

    public async Task DisposeAsync()
    {
        if (Host != null) await Host.DisposeAsync();
    }
}