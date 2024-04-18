﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.Printing;
using Spd.Utilities.Printing.BCMailPlus;
using System.Text.Json;

namespace Spd.Tests.Integration.Utilities.BcMailPlus;

public class BcMailPlusTests : IAsyncLifetime
{
    private IServiceScope serviceScope = null!;
    private IServiceProvider services => serviceScope.ServiceProvider;

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 1 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 2 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 3 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 3 rotated right).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 3 rotated 270).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Security Worker Licence (Photo 4 bad).json")]
    public async Task RunSecurityWorkerLicenseJob(string fileName)
    {
        (await Run(Jobs.SecurityWorkerLicense, fileName)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 1 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 2 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 3 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Armoured Vehicle Permit (Photo 4 bad).json")]
    public async Task RunArmouredVehiclePermitJob(string fileName)
    {
        (await Run(Jobs.SecurityWorkerLicense, fileName)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 1 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 2 good).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 3 bad).json")]
    [InlineData("Integration/Utilities/BcMailPlus/TestFiles/Body Armour Permit (Photo 4 bad).json")]
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

    public async Task DisposeAsync()
    {
        await Task.CompletedTask;
        serviceScope.Dispose();
    }

    public async Task InitializeAsync()
    {
        await Task.CompletedTask;
        var servicesCollection = new ServiceCollection();
        var configuration = new ConfigurationBuilder().AddUserSecrets(GetType().Assembly).Build();
        servicesCollection.AddSingleton<IConfiguration>(configuration);
        servicesCollection.AddPrinting(configuration);

        serviceScope = servicesCollection.BuildServiceProvider().CreateScope();
    }
}