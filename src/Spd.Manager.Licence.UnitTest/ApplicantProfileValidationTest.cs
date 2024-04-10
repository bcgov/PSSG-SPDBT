﻿using AutoFixture;
using FluentValidation.TestHelper;

namespace Spd.Manager.Licence.UnitTest;
public class ApplicantProfileValidationTest
{
    private readonly ApplicantUpdateRequestValidator validator;
    private readonly IFixture fixture;

    public ApplicantProfileValidationTest()
    {
        validator = new ApplicantUpdateRequestValidator();

        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    [Fact]
    public void ApplicantUpdateRequestValidator_ShouldPass()
    {
        var address = fixture.Build<Address>()
            .With(a => a.AddressLine1, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.City, new string('a', 100))
            .With(a => a.PostalCode, new string('a', 20))
            .Create();

        var model = fixture.Build<ApplicantUpdateRequest>()
            .With(r => r.EmailAddress, "test@test.com")
            .With(r => r.PhoneNumber, new string('9', 15))
            .With(r => r.MailingAddress, address)
            .With(r => r.ResidentialAddress, address)
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }
}
