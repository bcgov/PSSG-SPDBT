using AutoFixture;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Moq;
using Spd.Manager.Common.Admin;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using System.Text;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class ConfigurationControllerTest
{
    private readonly IFixture fixture;
    private Mock<IOptions<BCeIDAuthenticationConfiguration>> mockBceIdAuthConfig = new();
    private Mock<IOptions<BcscAuthenticationConfiguration>> mockBcscAuthConfig = new();
    private Mock<IOptions<GoogleReCaptchaConfiguration>> mockRecaptchConfig = new();
    private Mock<IMediator> mockMediator = new();

    private ConfigurationController sut;

    public ConfigurationControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        IConfiguration configuration = CreateConfiguration();

        mockBceIdAuthConfig.Setup(m => m.Value)
            .Returns(new BCeIDAuthenticationConfiguration());
        mockBcscAuthConfig.Setup(m => m.Value)
            .Returns(new BcscAuthenticationConfiguration());
        mockRecaptchConfig.Setup(m => m.Value)
            .Returns(new GoogleReCaptchaConfiguration());

        var licenceFee = fixture.Create<LicenceFeeResponse>();
        List<LicenceFeeResponse> licenceFeeList = new List<LicenceFeeResponse>() { licenceFee };
        mockMediator.Setup(m => m.Send(It.IsAny<GetLicenceFeeListQuery>(), CancellationToken.None))
            .ReturnsAsync(new LicenceFeeListResponse() { LicenceFees = licenceFeeList });

        mockMediator.Setup(m => m.Send(It.IsAny<GetReplacementProcessingTimeQuery>(), CancellationToken.None))
            .ReturnsAsync("test");

        sut = new ConfigurationController(mockBceIdAuthConfig.Object,
            mockRecaptchConfig.Object,
            mockBcscAuthConfig.Object,
            configuration,
            mockMediator.Object);
    }

    [Fact]
    public async void Get_Return_ConfigurationResponse()
    {
        var result = await sut.Get();

        Assert.IsType<ConfigurationResponse>(result);
        mockMediator.Verify();
    }
    private static IConfiguration CreateConfiguration()
    {
        var json = @"
        {
            ""InvalidWorkerLicenceCategoryMatrix"": {
                ""ArmouredCarGuard"": [""ArmouredCarGuard"", ""SecurityGuardUnderSupervision""],
                ""BodyArmourSales"": [""SecurityGuardUnderSupervision"", ""BodyArmourSales""],
                ""ClosedCircuitTelevisionInstaller"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""ClosedCircuitTelevisionInstaller"", ""SecurityGuardUnderSupervision""],
                ""ElectronicLockingDeviceInstaller"": [""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""SecurityGuardUnderSupervision""],
                ""FireInvestigator"": [""PrivateInvestigatorUnderSupervision"", ""PrivateInvestigator"", ""FireInvestigator"", ""SecurityGuardUnderSupervision""],
                ""Locksmith"": [""ElectronicLockingDeviceInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""SecurityGuardUnderSupervision""],
                ""LocksmithUnderSupervision"": [""ElectronicLockingDeviceInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""SecurityGuardUnderSupervision""],
                ""PrivateInvestigator"": [""PrivateInvestigatorUnderSupervision"", ""PrivateInvestigator"", ""FireInvestigator"", ""SecurityGuardUnderSupervision""],
                ""PrivateInvestigatorUnderSupervision"": [""PrivateInvestigatorUnderSupervision"", ""PrivateInvestigator"", ""FireInvestigator"", ""SecurityGuardUnderSupervision""],
                ""SecurityAlarmInstaller"": [""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityAlarmSales"", ""ClosedCircuitTelevisionInstaller"", ""SecurityGuardUnderSupervision""],
                ""SecurityAlarmInstallerUnderSupervision"": [""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityAlarmSales"", ""ClosedCircuitTelevisionInstaller"", ""SecurityGuardUnderSupervision""],
                ""SecurityAlarmMonitor"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityGuardUnderSupervision"", ""SecurityAlarmSales"", ""SecurityGuard""],
                ""SecurityAlarmResponse"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityGuardUnderSupervision"", ""SecurityGuard""],
                ""SecurityAlarmSales"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmSales"", ""SecurityGuardUnderSupervision"", ""SecurityGuard""],
                ""SecurityConsultant"": [""SecurityConsultant"", ""SecurityGuardUnderSupervision""],
                ""SecurityGuard"": [""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityGuardUnderSupervision"", ""SecurityGuard"", ""SecurityAlarmSales""],
                ""SecurityGuardUnderSupervision"": [""ArmouredCarGuard"", ""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityAlarmSales"", ""ClosedCircuitTelevisionInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""PrivateInvestigator"", ""PrivateInvestigatorUnderSupervision"", ""FireInvestigator"", ""SecurityConsultant"", ""SecurityGuardUnderSupervision"", ""SecurityGuard"", ""BodyArmourSales""]
            }
        }";


        var builder = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonStream(new MemoryStream(Encoding.UTF8.GetBytes(json)));
        return builder.Build();
    }
}
