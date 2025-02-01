using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Shouldly;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Security.Principal;

public class GDSDLicensingControllerTests
{
    private readonly Mock<IPrincipal> _mockCurrentUser;
    private readonly Mock<IMediator> _mockMediator;
    private readonly Mock<IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest>> _mockAnonymousSubmitRequestValidator;
    private readonly Mock<IValidator<GDSDTeamLicenceAppUpsertRequest>> _mockUpsertValidator;
    private readonly Mock<IRecaptchaVerificationService> _mockRecaptchaService;
    private readonly Mock<IDistributedCache> _mockCache;
    private readonly Mock<IDataProtectionProvider> _mockDataProtectionProvider;
    private readonly Mock<IConfiguration> _mockConfiguration;

    private readonly GDSDLicensingController _controller;

    public GDSDLicensingControllerTests()
    {
        _mockCurrentUser = new Mock<IPrincipal>();
        _mockMediator = new Mock<IMediator>();
        _mockAnonymousSubmitRequestValidator = new Mock<IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest>>();
        _mockUpsertValidator = new Mock<IValidator<GDSDTeamLicenceAppUpsertRequest>>();
        _mockRecaptchaService = new Mock<IRecaptchaVerificationService>();
        _mockCache = new Mock<IDistributedCache>();
        _mockDataProtectionProvider = new Mock<IDataProtectionProvider>();
        _mockConfiguration = new Mock<IConfiguration>();

        _mockDataProtectionProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
            .Returns(new Mock<ITimeLimitedDataProtector>().Object);

        _controller = new GDSDLicensingController(
            _mockCurrentUser.Object,
            _mockMediator.Object,
            _mockConfiguration.Object,
            _mockAnonymousSubmitRequestValidator.Object,
            _mockUpsertValidator.Object,
            _mockRecaptchaService.Object,
            _mockCache.Object,
            _mockDataProtectionProvider.Object
        );
    }

    [Fact]
    public async Task SubmitGDSDTeamAppAnonymous_ShouldReturnLicenceAppId_WhenRequestIsValid()
    {
        // Arrange
        var request = new GDSDTeamLicenceAppAnonymousSubmitRequest
        {
            ApplicationTypeCode = ApplicationTypeCode.New,
            DocumentKeyCodes = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() }
        };
        var cancellationToken = CancellationToken.None;
        Guid licenceAppId = Guid.NewGuid();

        _mockAnonymousSubmitRequestValidator
            .Setup(v => v.ValidateAsync(request, cancellationToken))
            .ReturnsAsync(new ValidationResult());

        _mockMediator
            .Setup(m => m.Send(It.IsAny<GDSDTeamLicenceAppAnonymousSubmitCommand>(), cancellationToken))
            .ReturnsAsync(new GDSDAppCommandResponse { LicenceAppId = licenceAppId });

        // Act
        var result = await _controller.SubmitGDSDTeamAppAnonymous(request, cancellationToken);

        // Assert
        result.LicenceAppId.ShouldBe(licenceAppId);
    }

    [Fact]
    public async Task SubmitGDSDTeamAppAnonymous_ShouldThrowApiException_WhenValidationFails()
    {
        // Arrange
        var request = new GDSDTeamLicenceAppAnonymousSubmitRequest();
        var cancellationToken = CancellationToken.None;
        var validationErrors = new List<ValidationFailure> { new("Property", "Error message") };

        _mockAnonymousSubmitRequestValidator
            .Setup(v => v.ValidateAsync(request, cancellationToken))
            .ReturnsAsync(new ValidationResult(validationErrors));

        // Act
        var act = async () => await _controller.SubmitGDSDTeamAppAnonymous(request, cancellationToken);

        // Assert
        var exception = await act.ShouldThrowAsync<ApiException>();
        exception.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }
}
