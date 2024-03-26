using AutoFixture;
using Spd.Manager.Licence;
using Spd.Manager.Shared;

namespace Spd.Tests.Fixtures;
public class WorkerLicenceFixture
{
    private readonly IFixture fixture;

    public WorkerLicenceFixture(CancellationToken cancellationToken)
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    public WorkerLicenceAppAnonymousSubmitRequest GenerateValidWorkerLicenceAppAnonymousSubmitRequest(
        ApplicationTypeCode applicationTypeCode = ApplicationTypeCode.New,
        Guid? appLicId = null)
    {
        WorkerLicenceAppAnonymousSubmitRequest workerLicenceAppAnonymousSubmitRequest = fixture.Build<WorkerLicenceAppAnonymousSubmitRequest>()
            .With(w => w.OriginalApplicationId, appLicId ?? Guid.NewGuid())
            .With(w => w.ApplicationTypeCode, applicationTypeCode)
            .Create();

        return workerLicenceAppAnonymousSubmitRequest;
    }
}
