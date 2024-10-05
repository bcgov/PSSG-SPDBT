using AutoFixture;
using FluentValidation.TestHelper;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence.UnitTest;
public class PermitAppValidationTest
{
    private readonly PermitAppSubmitRequestValidator validator;
    private readonly IFixture fixture;

    public PermitAppValidationTest()
    {
        validator = new PermitAppSubmitRequestValidator();

        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    [Fact]
    public void PermitAppSubmitRequestValidator_ShouldPass()
    {
        var employerPrimaryAddress = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var residentialAddress = fixture.Build<ResidentialAddress>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var canadianCitizenshipDocument = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.CanadianCitizenship)
            .Create();

        var proofOfFingerprintDocument = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.ProofOfFingerprint)
            .Create();

        var model = fixture.Build<PermitAppUpsertRequest>()
            .With(r => r.WorkerLicenceTypeCode, ServiceTypeCode.ArmouredVehiclePermit)
            .With(r => r.AgreeToCompleteAndAccurate, true)
            .With(r => r.EmployerName, new string('a', 160))
            .With(r => r.SupervisorName, new string('a', 100))
            .With(r => r.SupervisorPhoneNumber, new string('9', 15))
            .With(r => r.PhoneNumber, new string('9', 15))
            .With(r => r.SupervisorEmailAddress, "test@test.com")
            .With(r => r.EmployerPrimaryAddress, employerPrimaryAddress)
            .With(r => r.ResidentialAddress, residentialAddress)
            .With(r => r.Rationale, new string('a', 3000))
            .With(r => r.IsCanadianCitizen, true)
            .With(r => r.IsCanadianResident, false)
            .With(r => r.BodyArmourPermitReasonCodes, new List<BodyArmourPermitReasonCode>() { BodyArmourPermitReasonCode.PersonalProtection })
            .With(r => r.ArmouredVehiclePermitReasonCodes, new List<ArmouredVehiclePermitReasonCode>() { ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty })
            .With(r => r.LicenceTermCode, LicenceTermCode.FiveYears)
            .With(r => r.DocumentInfos, new List<Document>() { canadianCitizenshipDocument, proofOfFingerprintDocument })
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void CanadianCitizenWithNoDocumentation_ShouldThrowError()
    {
        var employerPrimaryAddress = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var residentialAddress = fixture.Build<ResidentialAddress>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var proofOfFingerprintDocument = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.ProofOfFingerprint)
            .Create();

        var model = fixture.Build<PermitAppUpsertRequest>()
            .With(r => r.WorkerLicenceTypeCode, ServiceTypeCode.ArmouredVehiclePermit)
            .With(r => r.AgreeToCompleteAndAccurate, true)
            .With(r => r.EmployerName, new string('a', 160))
            .With(r => r.SupervisorName, new string('a', 100))
            .With(r => r.SupervisorPhoneNumber, new string('9', 15))
            .With(r => r.PhoneNumber, new string('9', 15))
            .With(r => r.SupervisorEmailAddress, "test@test.com")
            .With(r => r.EmployerPrimaryAddress, employerPrimaryAddress)
            .With(r => r.ResidentialAddress, residentialAddress)
            .With(r => r.Rationale, new string('a', 3000))
            .With(r => r.IsCanadianCitizen, true)
            .With(r => r.IsCanadianResident, false)
            .With(r => r.BodyArmourPermitReasonCodes, new List<BodyArmourPermitReasonCode>() { BodyArmourPermitReasonCode.PersonalProtection })
            .With(r => r.ArmouredVehiclePermitReasonCodes, new List<ArmouredVehiclePermitReasonCode>() { ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty })
            .With(r => r.LicenceTermCode, LicenceTermCode.FiveYears)
            .With(r => r.DocumentInfos, new List<Document>() { proofOfFingerprintDocument })
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);
    }

    [Fact]
    public void CanadianResidentWithNoDocumentation_ShouldThrowError()
    {
        var employerPrimaryAddress = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var residentialAddress = fixture.Build<ResidentialAddress>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var proofOfFingerprintDocument = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.ProofOfFingerprint)
            .Create();

        var model = fixture.Build<PermitAppUpsertRequest>()
            .With(r => r.WorkerLicenceTypeCode, ServiceTypeCode.ArmouredVehiclePermit)
            .With(r => r.AgreeToCompleteAndAccurate, true)
            .With(r => r.EmployerName, new string('a', 160))
            .With(r => r.SupervisorName, new string('a', 100))
            .With(r => r.SupervisorPhoneNumber, new string('9', 15))
            .With(r => r.PhoneNumber, new string('9', 15))
            .With(r => r.SupervisorEmailAddress, "test@test.com")
            .With(r => r.EmployerPrimaryAddress, employerPrimaryAddress)
            .With(r => r.ResidentialAddress, residentialAddress)
            .With(r => r.Rationale, new string('a', 3000))
            .With(r => r.IsCanadianCitizen, false)
            .With(r => r.IsCanadianResident, true)
            .With(r => r.BodyArmourPermitReasonCodes, new List<BodyArmourPermitReasonCode>() { BodyArmourPermitReasonCode.PersonalProtection })
            .With(r => r.ArmouredVehiclePermitReasonCodes, new List<ArmouredVehiclePermitReasonCode>() { ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty })
            .With(r => r.LicenceTermCode, LicenceTermCode.FiveYears)
            .With(r => r.DocumentInfos, new List<Document>() { proofOfFingerprintDocument })
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);
    }

    [Fact]
    public void NonCanadianCitizenWithNoDocumentation_ShouldThrowError()
    {
        var employerPrimaryAddress = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var residentialAddress = fixture.Build<ResidentialAddress>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var proofOfFingerprintDocument = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.ProofOfFingerprint)
            .Create();

        var model = fixture.Build<PermitAppUpsertRequest>()
            .With(r => r.WorkerLicenceTypeCode, ServiceTypeCode.ArmouredVehiclePermit)
            .With(r => r.AgreeToCompleteAndAccurate, true)
            .With(r => r.EmployerName, new string('a', 160))
            .With(r => r.SupervisorName, new string('a', 100))
            .With(r => r.SupervisorPhoneNumber, new string('9', 15))
            .With(r => r.PhoneNumber, new string('9', 15))
            .With(r => r.SupervisorEmailAddress, "test@test.com")
            .With(r => r.EmployerPrimaryAddress, employerPrimaryAddress)
            .With(r => r.ResidentialAddress, residentialAddress)
            .With(r => r.Rationale, new string('a', 3000))
            .With(r => r.IsCanadianCitizen, false)
            .With(r => r.IsCanadianResident, false)
            .With(r => r.BodyArmourPermitReasonCodes, new List<BodyArmourPermitReasonCode>() { BodyArmourPermitReasonCode.PersonalProtection })
            .With(r => r.ArmouredVehiclePermitReasonCodes, new List<ArmouredVehiclePermitReasonCode>() { ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty })
            .With(r => r.LicenceTermCode, LicenceTermCode.FiveYears)
            .With(r => r.DocumentInfos, new List<Document>() { proofOfFingerprintDocument })
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.DocumentInfos);
    }
}
