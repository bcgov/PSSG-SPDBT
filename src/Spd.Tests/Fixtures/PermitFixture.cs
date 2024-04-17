using AutoFixture;
using Spd.Manager.Licence;
using Spd.Manager.Shared;

namespace Spd.Tests.Fixtures;
public class PermitFixture
{
    private readonly IFixture fixture;

    public PermitFixture()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    public PermitAppSubmitRequest GenerateValidPermitAppSubmitRequest(
        ApplicationTypeCode applicationTypeCode = ApplicationTypeCode.New,
        Guid? appLicId = null)
    {
        PermitAppSubmitRequest request = fixture.Build<PermitAppSubmitRequest>()
            .With(r => r.OriginalApplicationId, appLicId ?? Guid.NewGuid())
            .With(r => r.ApplicationTypeCode, applicationTypeCode)
            .With(r => r.HasLegalNameChanged, false)
            .With(r => r.IsCanadianCitizen, true)
            .Without(r => r.PreviousDocumentIds)
            .Create();

        return request;
    }
}
