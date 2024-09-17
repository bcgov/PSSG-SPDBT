using Xunit.Abstractions;

namespace Spd.Tests.Integration;

public abstract class IntegrationTestBase : IClassFixture<IntegrationTestFixture>
{
    protected IntegrationTestBase(ITestOutputHelper output, IntegrationTestFixture fixture)
    {
        this.Fixture = fixture;
        this.Fixture.OutputHelper = output;
    }

    protected IntegrationTestFixture Fixture { get; private set; }
}