using Shouldly;
using Spd.Utilities.Shared.Tools;

namespace Spd.Test.Utilities.Shared.Unit.Tools;
public class EncryptionTests
{
    public string key = "kljsdkkdlo4454GG";

    [Fact]
    public void EncryptionDecryptStringShouldWork()
    {
        string encrypted = Encryption.EncryptString(key, "test");
        string decrypted = Encryption.DecryptString(key, encrypted);
        decrypted.ShouldBe("test");
    }
}
