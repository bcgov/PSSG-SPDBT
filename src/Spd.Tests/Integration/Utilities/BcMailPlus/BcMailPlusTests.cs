using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.Printing.BCMailPlus;
using System.Text.Json;
using Xunit.Abstractions;

namespace Spd.Tests.Integration.Utilities.BcMailPlus;

public class BcMailPlusTests(ITestOutputHelper output, IntegrationTestFixture fixture) : IntegrationTestBase(output, fixture)
{
    private IServiceProvider services => Fixture.ServiceProvider;

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 1 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 2 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 3 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 3 rotated right).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 3 rotated 270).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 3 rotated 360).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 4 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 4 bad TIFF).json")]
    public async Task RunSecurityWorkerLicenseJob(string fileName)
    {
        (await Run(Jobs.SecurityWorkerLicense, fileName)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 1 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 2 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 3 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 4 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 1 good TIFF).json")]
    public async Task RunArmouredVehiclePermitJob(string fileName)
    {
        (await Run(Jobs.SecurityWorkerLicense, fileName)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 1 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 2 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 3 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 4 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 3 bad TIFF).json")]
    public async Task RunBodyArmourPermitJob(string fileName)
    {
        (await Run(Jobs.SecurityWorkerLicense, fileName)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Business Licence.json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Business Licence - Sole Proprietor.json")]
    public async Task RunBusinessLicenseJob(string fileName)
    {
        (await Run(Jobs.BusinessLicense, fileName)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Fingerprint Request Letter.json")]
    public async Task RunFingerprintLetterJob(string fileName)
    {
        (await Run(Jobs.FingerprintsLetter, fileName)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Metal Dealers and Recyclers Permit.json")]
    public async Task RunMetalDealerAndRecyclersPermitJob(string fileName)
    {
        (await Run(Jobs.MetalDealerAndRecyclersPermit, fileName)).ShouldBeTrue();
    }

    private async Task<bool> Run(string jobName, string payloadFileName)
    {
        using var fs = File.Open(payloadFileName, FileMode.Open);
        var payload = await JsonDocument.ParseAsync(fs);
        var api = services.GetRequiredService<IBcMailPlusApi>();

        var job = await api.CreateJob(jobName, payload, CancellationToken.None);
        job.Errors.ShouldBeNullOrEmpty();
        job.JobId.ShouldNotBeNullOrEmpty();
        job.JobProperties.ShouldNotBeNull().JobId.ShouldNotBeNull();
        job.JobProperties.JobId.ShouldNotBeNull();

        var status = (await api.GetJobStatus([job.JobId], CancellationToken.None)).Jobs.Single();
        while (status.Status != JobStatusValues.PdfCreated)
        {
            await Task.Delay(10000);
            status = (await api.GetJobStatus([job.JobId!], CancellationToken.None)).Jobs.Single();
            if (status.Status == JobStatusValues.ProcessingError) throw new InvalidOperationException("Error in job");
        }

        var asset = await api.GetAsset(job.JobId!, status.JobProperties!.Asset!, CancellationToken.None);

        asset.ShouldNotBeNull();
        var extension = status.JobProperties!.Asset == "CARD_PREVIEW_IMAGE" ? ".png" : ".pdf";
        await File.WriteAllBytesAsync(payloadFileName + extension, asset);
        return true;
    }
}