using System.Threading.Tasks;

namespace Spd.Utilities.Payment.TokenProviders
{
    internal interface ISecurityTokenProvider
    {
        Task<string> AcquireToken();
    }
}
