using Alba;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Dynamics;
using Xunit;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration;

public class WebAppFixture
{
    public IAlbaHost albaHost = null!;
    public DynamicsTestData testData { get; set; } = null!;

    public async Task<IAlbaHost> CreateHost(ITestOutputHelper output, IConfiguration configuration)
    {
        albaHost = await Alba.AlbaHost.For<Program>();
        return albaHost;
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

    protected ScenarioContextBase(ITestOutputHelper output, WebAppFixture fixture)
    {
        this.output = output;
        this.fixture = fixture;
        //this.configuration = new ConfigurationBuilder().AddUserSecrets(Assembly.GetExecutingAssembly(), false).Build();
    }

    public async Task InitializeAsync()
    {
        Host = await fixture.CreateHost(output, configuration);
        await fixture.CreateDynamicsData();
    }

    public async Task DisposeAsync()
    {
        if (Host != null) await Host.DisposeAsync();
    }
}