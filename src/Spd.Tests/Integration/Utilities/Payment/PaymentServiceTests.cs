using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.Payment;

namespace Spd.Tests.Integration.Utilities.Payment;

public class PaymentServiceTests : IAsyncLifetime
{
    private IServiceScope serviceScope = null!;

    [Fact]
    public async Task GetToken_Success()
    {
        var tokenProvider = serviceScope.ServiceProvider.GetRequiredService<ITokenProviderResolver>().GetTokenProviderByName("BasicTokenProvider");
        string accessToken = await tokenProvider.AcquireToken();
        accessToken.ShouldNotBeNullOrEmpty();
    }

    public async Task InitializeAsync()
    {
        await Task.CompletedTask;
        var servicesCollection = new ServiceCollection();
        var configuration = new ConfigurationBuilder().AddUserSecrets(GetType().Assembly).Build();
        servicesCollection.AddSingleton<IConfiguration>(configuration);
        servicesCollection.AddDistributedMemoryCache();
        servicesCollection.AddPaymentService(configuration);

        serviceScope = servicesCollection.BuildServiceProvider().CreateScope();
    }

    public async Task DisposeAsync()
    {
        await Task.CompletedTask;
        serviceScope.Dispose();
    }
}