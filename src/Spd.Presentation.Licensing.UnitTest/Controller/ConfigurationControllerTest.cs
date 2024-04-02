using AutoFixture;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Moq;
using Spd.Manager.Common.Admin;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        IConfiguration configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

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
}
