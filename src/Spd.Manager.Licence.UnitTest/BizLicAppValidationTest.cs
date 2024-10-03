using AutoFixture;
using FluentValidation.TestHelper;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace Spd.Manager.Licence.UnitTest;
public class BizLicAppValidationTest
{
    private readonly IFixture fixture;
    private readonly IConfiguration config;

    public BizLicAppValidationTest()
    {

        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        config = CreateConfiguration();
    }

    [Fact]
    public void BizLicAppUpsertRequestValidator_ShouldPass()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }
    [Fact]
    public void BizLicAppUpsertRequestValidator_With_Locksmith_SecurityAlarmInstaller_ShouldPass()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();
        model.CategoryCodes = new List<WorkerCategoryTypeCode>()
        {
            WorkerCategoryTypeCode.Locksmith,
            WorkerCategoryTypeCode.SecurityAlarmInstaller
        };

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void BizLicAppUpsertRequestValidator_WithEmptyFields_ShouldPass()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();

        model.BizId = Guid.Empty;
        model.HasExpiredLicence = null;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.BizId);
        result.ShouldHaveValidationErrorFor(r => r.HasExpiredLicence);
    }

    [Fact]
    public void BizLicAppSubmitRequestValidator_ShouldPass()
    {
        BizLicAppSubmitRequestValidator validator = new BizLicAppSubmitRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppSubmitRequest>();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void BizLicAppSubmitRequestValidator_WithEmptyFields_ShouldPass()
    {
        BizLicAppSubmitRequestValidator validator = new BizLicAppSubmitRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppSubmitRequest>();

        model.LatestApplicationId = null;
        model.OriginalLicenceId = null;
        model.PreviousDocumentIds = [];

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.LatestApplicationId);
        result.ShouldHaveValidationErrorFor(r => r.OriginalLicenceId);
        result.ShouldHaveValidationErrorFor(r => r.PreviousDocumentIds);
    }

    [Fact]
    public void ApplicantContactInfo_WhenHasEmptyFields_ShouldThrowException()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();
        model.ApplicantContactInfo.GivenName = string.Empty;
        model.ApplicantContactInfo.Surname = string.Empty;
        model.ApplicantContactInfo.PhoneNumber = string.Empty;
        model.ApplicantContactInfo.EmailAddress = string.Empty;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.ApplicantContactInfo.GivenName);
        result.ShouldHaveValidationErrorFor(r => r.ApplicantContactInfo.Surname);
        result.ShouldHaveValidationErrorFor(r => r.ApplicantContactInfo.PhoneNumber);
        result.ShouldHaveValidationErrorFor(r => r.ApplicantContactInfo.EmailAddress);
    }

    [Fact]
    public void CategoryCodes_WhenHasWrongSet_ShouldThrowException()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();
        model.CategoryCodes = new List<WorkerCategoryTypeCode>() { WorkerCategoryTypeCode.PrivateInvestigator, WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision };

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.CategoryCodes);
    }

    [Fact]
    public void BizLicAppUpsertRequest_DocumentInfos_WithoutMandatoryDocuments_ShouldThrowException()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();
        model.DocumentInfos = null;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);
    }

    [Fact]
    public void BizLicAppUpsertRequest_DocumentInfos_WhenExceedsMaxAllowed_ShouldThrowException()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();

        Document branding = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizBranding };
        Document insurance = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizInsurance };
        Document armourCarRegistrar = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ArmourCarGuardRegistrar };
        Document dogCertificate = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizSecurityDogCertificate };

        // Exceed max allowed for branding
        List<Document> documentInfos = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.BizBranding)
            .CreateMany(11)
            .ToList();
        documentInfos.Add(insurance);
        documentInfos.Add(armourCarRegistrar);
        documentInfos.Add(dogCertificate);

        model.DocumentInfos = documentInfos;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);

        // Exceed max allowed for insurance
        documentInfos = new()
        {
            branding,
            insurance,
            insurance,
            armourCarRegistrar,
            dogCertificate
        };

        model.DocumentInfos = documentInfos;

        result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);

        // Exceed max allowed for armour car registrar
        documentInfos = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.ArmourCarGuardRegistrar)
            .CreateMany(11)
            .ToList();

        model.DocumentInfos = documentInfos;

        result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);

        // Exceed max allowed for dog certificate
        documentInfos = new()
        {
            branding,
            insurance,
            armourCarRegistrar,
            dogCertificate,
            dogCertificate
        };

        model.DocumentInfos = documentInfos;

        result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);
    }

    [Fact]
    public void PrivateInvestigatorSwlInfo_WhenHasEmptyFields_ShouldThrowException()
    {
        BizLicAppUpsertRequestValidator validator = new BizLicAppUpsertRequestValidator(config);

        var model = GenerateValidRequest<BizLicAppUpsertRequest>();

        model.CategoryCodes = new List<WorkerCategoryTypeCode>() { WorkerCategoryTypeCode.PrivateInvestigator };
        model.PrivateInvestigatorSwlInfo.GivenName = null;
        model.PrivateInvestigatorSwlInfo.Surname = null;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.PrivateInvestigatorSwlInfo);
    }

    private T GenerateValidRequest<T>()
    {
        object model;

        List<WorkerCategoryTypeCode> categories = new()
        {
            WorkerCategoryTypeCode.ArmouredCarGuard,
            WorkerCategoryTypeCode.SecurityGuard,
            WorkerCategoryTypeCode.SecurityAlarmMonitor,
            WorkerCategoryTypeCode.SecurityAlarmResponse
        };

        // Contact info
        ContactInfo applicantContactInfo = fixture.Build<ContactInfo>()
            .With(c => c.EmailAddress, "test@test.com")
            .Create();

        // Controlling members
        List<SwlContactInfo> swlControllingMembers = new() { new SwlContactInfo() { LicenceId = Guid.NewGuid() } };
        List<NonSwlContactInfo> nonSwlControllingMembers = new() { new NonSwlContactInfo() { Surname = "test", EmailAddress = "test@test.com" } };
        List<SwlContactInfo> employees = new() { new SwlContactInfo() { LicenceId = Guid.NewGuid() } };

        if (typeof(T).Name == "BizLicAppUpsertRequest")
        {
            // Documents
            Document branding = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizBranding };
            Document insurance = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizInsurance };
            Document armourCarRegistrar = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ArmourCarGuardRegistrar };
            Document dogCertificate = new Document() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizSecurityDogCertificate };
            List<Document> documentInfos = new()
            {
                branding,
                insurance,
                armourCarRegistrar,
                dogCertificate
            };

            model = fixture.Build<BizLicAppUpsertRequest>()
                .With(r => r.LicenceTermCode, Shared.LicenceTermCode.OneYear)
                .With(r => r.BizTypeCode, BizTypeCode.RegisteredPartnership)
                .With(r => r.AgreeToCompleteAndAccurate, true)
                .With(r => r.UseDogs, true)
                .With(r => r.NoBranding, false)
                .With(r => r.DocumentInfos, documentInfos)
                .With(r => r.CategoryCodes, categories)
                .With(r => r.ApplicantContactInfo, applicantContactInfo)
                .Create();
        }
        else
        {
            model = fixture.Build<BizLicAppSubmitRequest>()
                .With(r => r.LicenceTermCode, Shared.LicenceTermCode.OneYear)
                .With(r => r.BizTypeCode, BizTypeCode.RegisteredPartnership)
                .With(r => r.AgreeToCompleteAndAccurate, true)
                .With(r => r.UseDogs, true)
                .With(r => r.NoBranding, false)
                .With(r => r.CategoryCodes, categories)
                .With(r => r.ApplicantContactInfo, applicantContactInfo)
                .Create();
        }

        return (T)Convert.ChangeType(model, typeof(T));
    }
    private static IConfiguration CreateConfiguration()
    {
        var json = @"
        {
            ""InvalidWorkerLicenceCategoryMatrix"": {
                ""ArmouredCarGuard"": [""ArmouredCarGuard"", ""SecurityGuardUnderSupervision""],
                ""BodyArmourSales"": [""SecurityGuardUnderSupervision"", ""BodyArmourSales""],
                ""ClosedCircuitTelevisionInstaller"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""ClosedCircuitTelevisionInstaller"", ""SecurityGuardUnderSupervision""],
                ""ElectronicLockingDeviceInstaller"": [""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""SecurityGuardUnderSupervision""],
                ""FireInvestigator"": [""PrivateInvestigatorUnderSupervision"", ""PrivateInvestigator"", ""FireInvestigator"", ""SecurityGuardUnderSupervision""],
                ""Locksmith"": [""ElectronicLockingDeviceInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""SecurityGuardUnderSupervision""],
                ""LocksmithUnderSupervision"": [""ElectronicLockingDeviceInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""SecurityGuardUnderSupervision""],
                ""PrivateInvestigator"": [""PrivateInvestigatorUnderSupervision"", ""PrivateInvestigator"", ""FireInvestigator"", ""SecurityGuardUnderSupervision""],
                ""PrivateInvestigatorUnderSupervision"": [""PrivateInvestigatorUnderSupervision"", ""PrivateInvestigator"", ""FireInvestigator"", ""SecurityGuardUnderSupervision""],
                ""SecurityAlarmInstaller"": [""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityAlarmSales"", ""ClosedCircuitTelevisionInstaller"", ""SecurityGuardUnderSupervision""],
                ""SecurityAlarmInstallerUnderSupervision"": [""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityAlarmSales"", ""ClosedCircuitTelevisionInstaller"", ""SecurityGuardUnderSupervision""],
                ""SecurityAlarmMonitor"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityGuardUnderSupervision"", ""SecurityAlarmSales"", ""SecurityGuard""],
                ""SecurityAlarmResponse"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityGuardUnderSupervision"", ""SecurityGuard""],
                ""SecurityAlarmSales"": [""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmSales"", ""SecurityGuardUnderSupervision"", ""SecurityGuard""],
                ""SecurityConsultant"": [""SecurityConsultant"", ""SecurityGuardUnderSupervision""],
                ""SecurityGuard"": [""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityGuardUnderSupervision"", ""SecurityGuard"", ""SecurityAlarmSales""],
                ""SecurityGuardUnderSupervision"": [""ArmouredCarGuard"", ""ElectronicLockingDeviceInstaller"", ""SecurityAlarmInstallerUnderSupervision"", ""SecurityAlarmInstaller"", ""SecurityAlarmMonitor"", ""SecurityAlarmResponse"", ""SecurityAlarmSales"", ""ClosedCircuitTelevisionInstaller"", ""LocksmithUnderSupervision"", ""Locksmith"", ""PrivateInvestigator"", ""PrivateInvestigatorUnderSupervision"", ""FireInvestigator"", ""SecurityConsultant"", ""SecurityGuardUnderSupervision"", ""SecurityGuard"", ""BodyArmourSales""]
            }
        }";


        var builder = new ConfigurationBuilder()
            .AddJsonStream(new MemoryStream(Encoding.UTF8.GetBytes(json)));
            


        return builder.Build();
    }
}
