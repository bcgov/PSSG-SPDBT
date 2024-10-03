namespace Spd.Utilities.LogonUser.UnitTest;

public class UnitTest1
{
    [Theory]
    [InlineData("givenname1", "givenname1", null)]
    [InlineData("given", "givenname1", "given")]
    [InlineData("givenname1 givenname2", "givenname1", "givenname2")]
    [InlineData(" givenname1 givenname2 ", "givenname1 ", "givenname2")]
    [InlineData("givenname1 givenname1", "givenname1 ", "givenname1")]
    [InlineData("givenname2 givenname1", "givenname1 ", "givenname2 givenname1")]
    [InlineData("", "", null)]
    [InlineData(null, "", null)]
    [InlineData(null, null, null)]
    public void GetMiddleNames_ShouldWork(string givenNames, string firstName, string expectedMiddleName)
    {
        var middleNames = IPrincipalExtensions.GetMiddleNames(givenNames, firstName);
        Assert.Equal(middleNames.Item1, expectedMiddleName);
    }
}