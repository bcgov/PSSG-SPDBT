using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.OptionSet;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class OptionSetRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IOptionSetRepository _optionsetRepo;
    private DynamicsContext _context;

    public OptionSetRepositoryTest(IntegrationTestSetup testSetup)
    {
        _optionsetRepo = testSetup.ServiceProvider.GetRequiredService<IOptionSetRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateReadOnly();
    }

    [Theory]
    [InlineData(Gender.M, "Male")]
    [InlineData(Gender.F, "Female")]
    [InlineData(Gender.U, "Unspecified")]
    public async Task GetLabelAsync_GenderEnum_Run_Correctly(Gender t, string expected)
    {
        //Action
        var response = await _optionsetRepo.GetLabelAsync(t, CancellationToken.None);

        //Assert
        Assert.NotNull(response);
        Assert.Equal(expected, response);
    }

    [Theory]
    [InlineData(EmployeeInteractionTypeCode.Adults, "Vulnerable Adults")]
    [InlineData(EmployeeInteractionTypeCode.ChildrenAndAdults, "Children and Vulnerable Adults")]
    [InlineData(EmployeeInteractionTypeCode.Children, "Children")]
    public async Task GetLabelAsync_EmployeeInteractionTypeCode_RunCorrectly(EmployeeInteractionTypeCode t, string expected)
    {
        //Action
        var response = await _optionsetRepo.GetLabelAsync(t, CancellationToken.None);

        //Assert
        Assert.NotNull(response);
        Assert.Equal(expected, response);
    }
}