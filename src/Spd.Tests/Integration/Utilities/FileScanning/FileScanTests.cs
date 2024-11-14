using Bogus;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.FileScanning;
using Xunit.Abstractions;

namespace Spd.Tests.Integration.Utilities.FileScanning;

public class FileScanTests(ITestOutputHelper output, IntegrationTestFixture fixture) : IntegrationTestBase(output, fixture)
{
    private readonly Faker faker = new("en_CA");

    [Fact]
    public async Task Scan_File_Clean()
    {
        var provider = base.Fixture.ServiceProvider.GetRequiredService<IFileScanProvider>();
        var file = await faker.GenerateFile(10_000_000);
        var result = await provider.ScanAsync(file.Content, default);
        result.Result.ShouldBe(ScanResult.Clean);
    }
}