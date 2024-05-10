using FluentValidation;

namespace Spd.Manager.Licence;
public class BizProfileUpdateRequestValidator : AbstractValidator<BizProfileUpdateRequest>
{
    public BizProfileUpdateRequestValidator()
    {
        RuleFor(r => r.BizTradeName).NotEmpty();
        RuleFor(r => r.BizTypeCode).NotEmpty().IsInEnum();
        RuleFor(r => r.BizBCAddress).NotEmpty();
        RuleFor(r => r.BizMailingAddress)
            .NotEmpty()
            .When(r => r.MailingAddressIsSameBizAddress == false);
        RuleFor(r => r)
            .Must(r => r.BizMailingAddress.AddressLine1 != r.BizBCAddress.AddressLine1)
            .When(r => r.MailingAddressIsSameBizAddress == false);
    }
}
