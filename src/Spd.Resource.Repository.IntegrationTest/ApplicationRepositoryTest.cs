using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared;

namespace Spd.Resource.Repository.IntegrationTest;

public class ApplicationRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IApplicationRepository _appRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public ApplicationRepositoryTest(IntegrationTestSetup testSetup)
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

        _appRepository = testSetup.ServiceProvider.GetRequiredService<IApplicationRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    [Theory]
    [InlineData(EmployeeInteractionTypeCode.Adults, ServiceTypeCode.CRRP_EMPLOYEE, EmployeeInteractionTypeCode.Adults, ServiceTypeCode.CRRP_VOLUNTEER, 1)]
    [InlineData(EmployeeInteractionTypeCode.Adults, ServiceTypeCode.CRRP_EMPLOYEE, EmployeeInteractionTypeCode.ChildrenAndAdults, ServiceTypeCode.CRRP_VOLUNTEER, 1)]
    [InlineData(EmployeeInteractionTypeCode.Adults, ServiceTypeCode.CRRP_EMPLOYEE, EmployeeInteractionTypeCode.Children, ServiceTypeCode.CRRP_VOLUNTEER, 0)]
    [InlineData(EmployeeInteractionTypeCode.Children, ServiceTypeCode.CRRP_VOLUNTEER, EmployeeInteractionTypeCode.Adults, ServiceTypeCode.CRRP_VOLUNTEER, 0)]
    [InlineData(EmployeeInteractionTypeCode.Children, ServiceTypeCode.CRRP_EMPLOYEE, EmployeeInteractionTypeCode.ChildrenAndAdults, ServiceTypeCode.CRRP_VOLUNTEER, 1)]
    [InlineData(EmployeeInteractionTypeCode.ChildrenAndAdults, ServiceTypeCode.CRRP_EMPLOYEE, EmployeeInteractionTypeCode.Adults, ServiceTypeCode.CRRP_VOLUNTEER, 0)]
    [InlineData(EmployeeInteractionTypeCode.ChildrenAndAdults, ServiceTypeCode.CRRP_EMPLOYEE, EmployeeInteractionTypeCode.ChildrenAndAdults, ServiceTypeCode.CRRP_VOLUNTEER, 1)]
    public async Task ClearanceQry_QueryAsync_Run_Correctly(EmployeeInteractionTypeCode queryWorkWith,
        ServiceTypeCode queryServiceType,
        EmployeeInteractionTypeCode existingClearanceWorkWith,
        ServiceTypeCode existingClearanceServiceType,
        int expectedClearanceCount)
    {
        // Arrange
        contact contact = new();
        contact.firstname = $"{IntegrationTestSetup.DataPrefix}{new Random().Next(1000)}";
        contact.contactid = Guid.NewGuid();
        _context.AddTocontacts(contact);
        spd_clearance clearance = new();
        clearance.spd_workswith = (int)Enum.Parse<WorksWithChildrenOptionSet>(existingClearanceWorkWith.ToString());
        clearance.spd_clearanceid = Guid.NewGuid();
        clearance.spd_dategranted = DateTime.Now.AddDays(-200);
        //clearance.spd_expirydate = DateTimeOffset.UtcNow.AddDays(200); //dynamics automatically set it based on dategranted
        clearance.spd_sharable = (int)YesNoOptionSet.Yes;
        _context.AddTospd_clearances(clearance);
        _context.SetLink(clearance, nameof(clearance.spd_ServiceType), _context.LookupServiceType(existingClearanceServiceType.ToString()));
        _context.SetLink(clearance, nameof(clearance.spd_ContactID), contact);
        await _context.SaveChangesAsync();

        // Action
        ClearanceQry qry = new(
            ContactId: contact.contactid,
            FromDate: DateTimeOffset.UtcNow.AddMonths(SpdConstants.ShareableClearanceExpiredDateBufferInMonths),
            Shareable: true,
            IncludeWorkWith: queryWorkWith,
            IncludeServiceTypeEnum: queryServiceType
        );
        ClearanceListResp? resp = await _appRepository.QueryAsync(qry, CancellationToken.None);

        // Assert
        Assert.NotNull(resp);
        Assert.Equal(expectedClearanceCount, resp.Clearances.Count());

        //Annihilate
        _context.DeleteObject(clearance);
        _context.DeleteObject(contact);
        await _context.SaveChangesAsync();
    }
}