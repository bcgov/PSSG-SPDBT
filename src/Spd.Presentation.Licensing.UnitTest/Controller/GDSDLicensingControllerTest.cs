using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Shouldly;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using System.Security.Principal;
using System.Text;

public class GDSDLicensingControllerTests
{
    private readonly Mock<IPrincipal> _mockCurrentUser;
    private readonly Mock<IMediator> _mockMediator;
    private readonly Mock<IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest>> _mockAnonymousSubmitRequestValidator;
    private readonly Mock<IValidator<GDSDTeamLicenceAppUpsertRequest>> _mockUpsertValidator;
    private readonly Mock<IValidator<GDSDTeamLicenceAppChangeRequest>> _mockChangeValidator;
    private readonly Mock<IRecaptchaVerificationService> _mockRecaptchaService;
    private readonly Mock<IDistributedCache> _mockCache;
    private readonly Mock<IDataProtectionProvider> _mockDataProtectionProvider;
    private readonly Mock<ITimeLimitedDataProtector> _mockTimeLimitDataProvider;
    private readonly Mock<IConfiguration> _mockConfiguration;

    private readonly GDSDTeamLicensingController _controller;

    public GDSDLicensingControllerTests()
    {
        _mockCurrentUser = new Mock<IPrincipal>();
        _mockMediator = new Mock<IMediator>();
        _mockAnonymousSubmitRequestValidator = new Mock<IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest>>();
        _mockUpsertValidator = new Mock<IValidator<GDSDTeamLicenceAppUpsertRequest>>();
        _mockChangeValidator = new Mock<IValidator<GDSDTeamLicenceAppChangeRequest>>();
        _mockRecaptchaService = new Mock<IRecaptchaVerificationService>();
        _mockCache = new Mock<IDistributedCache>();
        _mockDataProtectionProvider = new Mock<IDataProtectionProvider>();
        _mockTimeLimitDataProvider = new Mock<ITimeLimitedDataProtector>();
        _mockConfiguration = new Mock<IConfiguration>();

        _mockDataProtectionProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
            .Returns(_mockTimeLimitDataProvider.Object);

        _controller = new GDSDTeamLicensingController(
            _mockCurrentUser.Object,
            _mockMediator.Object,
            _mockConfiguration.Object,
            _mockAnonymousSubmitRequestValidator.Object,
            _mockUpsertValidator.Object,
            _mockChangeValidator.Object,
            _mockRecaptchaService.Object,
            _mockCache.Object,
            _mockDataProtectionProvider.Object
        );

    }

    [Fact]
    public async Task SubmitGDSDTeamAppAnonymous_ShouldReturnLicenceAppId_WhenRequestIsValid()
    {
        // Arrange
        // Mock cookie collection
        var cookies = new Mock<IRequestCookieCollection>();
        cookies.Setup(c => c[SessionConstants.AnonymousApplicationSubmitKeyCode]).Returns("MockedSessionKeyValue");

        // Mock HttpContext and set cookies
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers["Cookie"] = $"{SessionConstants.AnonymousApplicationSubmitKeyCode}=cookieValuetestlongdata"; ;
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };
        var request = new GDSDTeamLicenceAppAnonymousSubmitRequest
        {
            ApplicationTypeCode = ApplicationTypeCode.New,
            DocumentKeyCodes = []
        };
        var cancellationToken = CancellationToken.None;
        Guid licenceAppId = Guid.NewGuid();

        _mockAnonymousSubmitRequestValidator
            .Setup(v => v.ValidateAsync(request, cancellationToken))
            .ReturnsAsync(new ValidationResult());

        _mockMediator
            .Setup(m => m.Send(It.IsAny<GDSDTeamLicenceAppAnonymousSubmitCommand>(), cancellationToken))
            .ReturnsAsync(new GDSDTeamAppCommandResponse { LicenceAppId = licenceAppId });

        var cachedBytes = Encoding.UTF8.GetBytes("{\"Items\": []}");
        _mockCache
            .Setup(m => m.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(cachedBytes);
        _mockTimeLimitDataProvider
            .Setup(m => m.Unprotect(It.IsAny<byte[]>()))
            .Returns(cachedBytes);

        // Act
        var result = await _controller.SubmitGDSDTeamAppAnonymous(request, cancellationToken);

        // Assert
        result.LicenceAppId.ShouldBe(licenceAppId);
    }
}
