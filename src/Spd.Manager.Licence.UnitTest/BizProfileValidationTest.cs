using AutoFixture;
using FluentValidation.TestHelper;

namespace Spd.Manager.Licence.UnitTest;
public class BizProfileValidationTest
{
    private readonly BizProfileUpdateRequestValidator validator;
    private readonly IFixture fixture;

    public BizProfileValidationTest()
    {
        validator = new BizProfileUpdateRequestValidator();

        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    [Fact]
    public void BizProfileUpdateRequestValidator_ShouldPass()
    {
        var address = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var bizManagerContactInfo = fixture.Build<ContactInfo>()
            .With(c => c.EmailAddress, "test@test.com")
            .Create();

        var model = fixture.Build<BizProfileUpdateRequest>()
            .With(r => r.BizTypeCode, BizTypeCode.NonRegisteredSoleProprietor)
            .With(r => r.BizAddress, address)
            .With(r => r.BizManagerContactInfo, bizManagerContactInfo)
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void BizProfileUpdateRequestValidator_WithBranches_ShouldPass()
    {
        var address = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.Province, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var branch = fixture.Build<BranchInfo>()
            .With(b => b.BranchAddress, address)
            .Create();

        var bizManagerContactInfo = fixture.Build<ContactInfo>()
            .With(c => c.EmailAddress, "test@test.com")
            .Create();

        var model = fixture.Build<BizProfileUpdateRequest>()
            .With(r => r.BizTypeCode, BizTypeCode.Corporation)
            .With(r => r.Branches, new List<BranchInfo>() { branch })
            .With(r => r.BizAddress, address)
            .With(r => r.BizManagerContactInfo, bizManagerContactInfo)
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void BizProfileUpdateRequestValidator_WithBranchWithoutInformation_ShouldThrowException()
    {
        Address address = new();

        var branch = fixture.Build<BranchInfo>()
            .With(b => b.BranchAddress, address)
            .Create();

        var model = fixture.Build<BizProfileUpdateRequest>()
            .With(r => r.BizTypeCode, BizTypeCode.Corporation)
            .With(r => r.Branches, new List<BranchInfo>() { branch })
            .With(r => r.BizAddress, address)
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.Branches);
    }

    [Fact]
    public void BizBCAddressEmpty_WhenBizAddressIsNotInBC_ShouldThrowException()
    {
        var address = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var model = fixture.Build<BizProfileUpdateRequest>()
            .With(r => r.BizTypeCode, BizTypeCode.NonRegisteredPartnership)
            .With(r => r.BizAddress, address)
            .Without(r => r.BizBCAddress)
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.BizBCAddress);
    }

    [Fact]
    public void SoleProprietorEmpty_WhenBizTypeCodeIsOneOfSoleProprietor_ShouldThrowException()
    {
        var address = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var model = fixture.Build<BizProfileUpdateRequest>()
            .With(r => r.BizTypeCode, BizTypeCode.RegisteredSoleProprietor)
            .With(r => r.BizAddress, address)
            .Without(r => r.SoleProprietorLicenceId)
            .Without(r => r.SoleProprietorSwlEmailAddress)
            .Without(r => r.SoleProprietorSwlPhoneNumber)
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.SoleProprietorLicenceId);
        result.ShouldHaveValidationErrorFor(r => r.SoleProprietorSwlEmailAddress);
        result.ShouldHaveValidationErrorFor(r => r.SoleProprietorSwlPhoneNumber);
    }

    [Fact]
    public void BizManagerContactInfo_WhenHasEmptyFields_ShouldThrowException()
    {
        var address = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.Country, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var model = fixture.Build<BizProfileUpdateRequest>()
            .With(r => r.BizTypeCode, BizTypeCode.NonRegisteredSoleProprietor)
            .With(r => r.BizAddress, address)
            .Create();

        model.BizManagerContactInfo.GivenName = string.Empty;
        model.BizManagerContactInfo.Surname = string.Empty;
        model.BizManagerContactInfo.PhoneNumber = string.Empty;
        model.BizManagerContactInfo.EmailAddress = string.Empty;

        var result = validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.BizManagerContactInfo);
    }
}
