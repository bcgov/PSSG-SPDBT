using AutoFixture;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        var model = fixture.Build<BizProfileUpdateRequest>()
            .With(r => r.BizTypeCode, BizTypeCode.NonRegisteredPartnership)
            .With(r => r.BizMailingAddress, address)
            .With(r => r.BizBCAddress, address)
            .With(r => r.MailingAddressIsSameBizAddress, true)
            .Create();

        var result = validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }
}
