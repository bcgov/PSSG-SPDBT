using AutoFixture;
using Spd.Manager.Licence;
using Spd.Manager.Shared;

namespace Spd.Tests.Fixtures;
public class WorkerLicenceFixture
{
    private readonly IFixture fixture;

    public WorkerLicenceFixture()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    public WorkerLicenceAppSubmitRequest GenerateValidWorkerLicenceAppSubmitRequest(
        ApplicationTypeCode applicationTypeCode = ApplicationTypeCode.New,
        Guid? appLicId = null)
    {
        WorkerLicenceAppSubmitRequest request = fixture.Build<WorkerLicenceAppSubmitRequest>()
            .With(r => r.LatestApplicationId, appLicId ?? Guid.NewGuid())
            .With(r => r.ApplicationTypeCode, applicationTypeCode)
            .With(r => r.HasLegalNameChanged, false)
            .With(r => r.IsPoliceOrPeaceOfficer, false)
            .With(r => r.HasNewMentalHealthCondition, false)
            .With(r => r.IsCanadianCitizen, true)
            .With(r => r.CategoryCodes, new List<WorkerCategoryTypeCode>() { WorkerCategoryTypeCode.BodyArmourSales })
            .Without(r => r.PreviousDocumentIds)
            .Create();

        return request;
    }
}
