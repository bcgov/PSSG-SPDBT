using Alba;
using Alba.Security;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Dynamics;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration;

public class WebAppFixture
{
    public static readonly string LOGON_USER_GUID = "946597A702244BA0884BDC3AC8CB21B6";
    public static readonly string LOGON_ORG_GUID = "EBB1709425324FD8BEFCB6BBCD679DF2";
    public IAlbaHost albaHost = null!;
    public IAlbaHost albaNoAuthMockHost = null!;
    public DynamicsTestData testData { get; set; } = null!;

    public async Task<IAlbaHost> CreateHost(ITestOutputHelper output, IConfiguration configuration)
    {
        var bceidStub = new JwtSecurityStub();

        albaHost = await Alba.AlbaHost.For<Program>(bceidStub);
        return albaHost;
    }

    public async Task<IAlbaHost> CreateNoAuthMockHost(ITestOutputHelper output, IConfiguration configuration)
    {
        albaNoAuthMockHost = await AlbaHost.For<Program>();
        return albaNoAuthMockHost;
    }

    public async Task CreateDynamicsData()
    {
        testData = new DynamicsTestData(albaHost.Services.CreateScope().ServiceProvider.GetRequiredService<IDynamicsContextFactory>(),
            albaHost.Services.CreateScope().ServiceProvider.GetRequiredService<IDataProtectionProvider>());
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
        NoMockAuthHost = await fixture.CreateNoAuthMockHost(output, configuration);
        await fixture.CreateDynamicsData();
    }

    public async Task DisposeAsync()
    {
        if (Host != null) await Host.DisposeAsync();
    }
}