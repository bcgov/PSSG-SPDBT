using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Resource.Applicants.DocumentTemplate;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Resources.DocumentTemplates;

public class DocumentTemplatesTests : ScenarioContextBase
{
    public DocumentTemplatesTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task Can_GenerateDocBasedOnTemplate()
    {
        var org = await fixture.testData.CreateOrg("org1");
        var application = await fixture.testData.CreateAppInOrg("ln", "fn", DateTimeOffset.UtcNow, org);
        var docTemplateRepo = Host.Services.GetRequiredService<IDocumentTemplateRepository>();
        GenerateDocBasedOnTemplateCmd cmd = new GenerateDocBasedOnTemplateCmd
        {
            RegardingObjectId = (Guid)application.spd_applicationid,
            DocTemplateType = DocTemplateTypeEnum.ManualPaymentForm
        };
        var response = await docTemplateRepo.ManageAsync(cmd, CancellationToken.None);
        response.ShouldNotBeEmpty();
    }
}
