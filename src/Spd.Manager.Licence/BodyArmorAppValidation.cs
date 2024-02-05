using FluentValidation;
using Microsoft.Extensions.Configuration;
using Spd.Manager.Shared;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;

public class BodyArmorAppAnonymousSubmitRequestJsonValidator : PersonalLicenceAppBaseValidator<BodyArmorAppAnonymousSubmitRequestJson>
{
    public BodyArmorAppAnonymousSubmitRequestJsonValidator(IConfiguration configuration)
    {
        //category
        RuleFor(r => r.CategoryCodes).NotEmpty().Must(d => d.Any() && d.Count() < 7);
        var invalidCategoryMatrix = configuration.GetSection("InvalidWorkerLicenceCategoryMatrix").Get<Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>>();
        if (invalidCategoryMatrix == null)
            throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "missing configuration for invalid worker licence category matrix");

        RuleFor(r => r.CategoryCodes).Must(c =>
        {
            foreach (var code in c)
            {
                var invalidCodes = invalidCategoryMatrix.GetValueOrDefault(code);
                if (invalidCodes != null)
                {
                    foreach (var cat in c)
                    {
                        if (cat != code)
                        {
                            if (invalidCodes.Contains(cat))
                            {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        })
        .When(c => c.CategoryCodes != null)
        .WithMessage("Some category cannot be in the same licence request.");

        RuleFor(r => r.OriginalApplicationId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.OriginalLicenceId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true).When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
    }
}


