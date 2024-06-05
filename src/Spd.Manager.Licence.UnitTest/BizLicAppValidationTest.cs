using AutoFixture;
using FluentValidation.TestHelper;

namespace Spd.Manager.Licence.UnitTest;
public class BizLicAppValidationTest
{
    private readonly BizLicAppSubmitRequestValidator validator;
    private readonly IFixture fixture;

    public BizLicAppValidationTest()
    {
        validator = new BizLicAppSubmitRequestValidator();

        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    [Fact]
    public void BizLicAppSubmitRequestValidator_ShouldPass()
    {
        var model = GenerateValidRequest();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void BizManagerContactInfo_WhenHasEmptyFields_ShouldThrowException()
    {
        var model = GenerateValidRequest();
        model.BizManagerContactInfo.GivenName = string.Empty;
        model.BizManagerContactInfo.Surname = string.Empty;
        model.BizManagerContactInfo.PhoneNumber = string.Empty;
        model.BizManagerContactInfo.EmailAddress = string.Empty;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.BizManagerContactInfo);
    }

    [Fact]
    public void CategoryCodes_WhenHasWrongSet_ShouldThrowException()
    {
        var model = GenerateValidRequest();
        model.CategoryCodes = new List<WorkerCategoryTypeCode>() { WorkerCategoryTypeCode.SecurityAlarmInstaller };

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.CategoryCodes);
    }

    [Fact]
    public void DocumentInfos_WithoutMandatoryDocuments_ShouldThrowException()
    {
        var model = GenerateValidRequest();
        model.DocumentInfos = null;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);
    }

    [Fact]
    public void DocumentInfos_WhenExceedsMaxAllowed_ShouldThrowException()
    {
        var model = GenerateValidRequest();

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
        documentInfos = new()
        {
            branding,
            insurance,
            armourCarRegistrar,
            armourCarRegistrar,
            dogCertificate
        };

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
        var model = GenerateValidRequest();

        model.CategoryCodes = new List<WorkerCategoryTypeCode>() { WorkerCategoryTypeCode.PrivateInvestigator };
        model.PrivateInvestigatorSwlInfo.LicenceId = null;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.PrivateInvestigatorSwlInfo);
    }

    [Fact]
    public void ControllingMembers_WhenHasEmptyFields_ShouldThrowException()
    {
        var model = GenerateValidRequest();

        List<SwlContactInfo> swlControllingMembers = new() { new SwlContactInfo() };
        List<NonSwlContactInfo> nonSwlControllingMembers = new() { new NonSwlContactInfo() };
        List<SwlContactInfo> employees = new() { new SwlContactInfo() };
        Members members = new()
        {
            SwlControllingMembers = swlControllingMembers,
            NonSwlControllingMembers = nonSwlControllingMembers,
            Employees = employees
        };
        model.Members = members;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.Members.SwlControllingMembers);
        result.ShouldHaveValidationErrorFor(r => r.Members.NonSwlControllingMembers);
        result.ShouldHaveValidationErrorFor(r => r.Members.Employees);
    }

    [Fact]
    public void ControllingMembers_WhenExceedsMaxAllowed_ShouldThrowException()
    {
        var model = GenerateValidRequest();
        List<SwlContactInfo> swlControllingMembers = fixture.CreateMany<SwlContactInfo>(21).ToList();
        List<NonSwlContactInfo> nonSwlControllingMembers = fixture.Build<NonSwlContactInfo>()
            .With(c => c.EmailAddress, "test@test.com")
            .CreateMany(21)
            .ToList();
        List<SwlContactInfo> employees = fixture.CreateMany<SwlContactInfo>(21).ToList();

        Members members = new()
        {
            SwlControllingMembers = swlControllingMembers,
            NonSwlControllingMembers = nonSwlControllingMembers,
            Employees = employees
        };
        model.Members = members;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.Members.SwlControllingMembers);
        result.ShouldHaveValidationErrorFor(r => r.Members.NonSwlControllingMembers);
        result.ShouldHaveValidationErrorFor(r => r.Members.Employees);
    }

    private BizLicAppUpsertRequest GenerateValidRequest()
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

        List<WorkerCategoryTypeCode> categories = new()
        {
            WorkerCategoryTypeCode.ArmouredCarGuard,
            WorkerCategoryTypeCode.SecurityGuard,
            WorkerCategoryTypeCode.SecurityAlarmMonitor,
            WorkerCategoryTypeCode.SecurityAlarmResponse
        };

        // Contact info
        ContactInfo bizManagerContactInfo = fixture.Build<ContactInfo>()
            .With(c => c.EmailAddress, "test@test.com")
            .Create();
        ContactInfo applicantContactInfo = fixture.Build<ContactInfo>()
            .With(c => c.EmailAddress, "test@test.com")
            .Create();

        // Controlling members
        List<SwlContactInfo> swlControllingMembers = new() { new SwlContactInfo() { LicenceId = Guid.NewGuid() } };
        List<NonSwlContactInfo> nonSwlControllingMembers = new() { new NonSwlContactInfo() { Surname = "test", EmailAddress = "test@test.com" } };
        List<SwlContactInfo> employees = new() { new SwlContactInfo() { LicenceId = Guid.NewGuid() } };

        Members members = new()
        {
            SwlControllingMembers = swlControllingMembers,
            NonSwlControllingMembers = nonSwlControllingMembers,
            Employees = employees
        };

        var model = fixture.Build<BizLicAppUpsertRequest>()
            .With(r => r.LicenceTermCode, Shared.LicenceTermCode.OneYear)
            .With(r => r.BizTypeCode, BizTypeCode.RegisteredPartnership)
            .With(r => r.DocumentInfos, documentInfos)
            .With(r => r.CategoryCodes, categories)
            .With(r => r.BizManagerContactInfo, bizManagerContactInfo)
            .With(r => r.ApplicantContactInfo, applicantContactInfo)
            .With(r => r.Members, members)
            .Create();

        return model;
    }
}
