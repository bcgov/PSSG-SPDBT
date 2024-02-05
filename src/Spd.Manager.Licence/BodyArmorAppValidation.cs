using FluentValidation;
using Microsoft.Extensions.Configuration;
using Spd.Manager.Shared;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;

public class BodyArmorAppAnonymousSubmitRequestJsonValidator : PersonalLicenceAppBaseValidator<BodyArmorAppAnonymousSubmitRequestJson>
{
    public BodyArmorAppAnonymousSubmitRequestJsonValidator(IConfiguration configuration)
    {
        RuleFor(r => r.OriginalApplicationId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.OriginalLicenceId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true).When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
    }
}


