using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Payment.TokenProviders;

namespace Spd.Utilities.Payment;

internal interface ITokenProviderResolver
{
    ISecurityTokenProvider GetTokenProviderByName(string name);
}

internal class TokenProviderResolver : ITokenProviderResolver
{
    private readonly IServiceProvider _serviceProvider;

    public TokenProviderResolver(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public ISecurityTokenProvider GetTokenProviderByName(string name)
    {
        if (name == "BasicTokenProvider")
            return _serviceProvider.GetRequiredService<BasicSecurityTokenProvider>();
        else
            return _serviceProvider.GetRequiredService<BearerSecurityTokenProvider>();
    }
}