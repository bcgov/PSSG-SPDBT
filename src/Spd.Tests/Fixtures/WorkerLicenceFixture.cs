using AutoFixture;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

    public WorkerLicenceAppAnonymousSubmitRequest GenerateValidWorkerLicenceAppAnonymousSubmitRequest(ApplicationTypeCode applicationTypeCode = ApplicationTypeCode.New)
    {
        WorkerLicenceAppAnonymousSubmitRequest workerLicenceAppAnonymousSubmitRequest = fixture.Build<WorkerLicenceAppAnonymousSubmitRequest>()
                .With(w => w.ApplicationTypeCode, applicationTypeCode)
                .Create();
    
        return workerLicenceAppAnonymousSubmitRequest;
    }
}
