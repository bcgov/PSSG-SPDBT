using FluentValidation;
using Microsoft.Extensions.Configuration;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;
public class BizLicAppUpsertRequestValidator : BizLicAppBaseValidator<BizLicAppUpsertRequest>
{
    public BizLicAppUpsertRequestValidator(IConfiguration configuration)
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

        // General validations
        RuleFor(r => r.BizId).NotEqual(Guid.Empty);
        RuleFor(r => r.HasExpiredLicence).NotEmpty();
        RuleFor(r => r.ExpiredLicenceId)
            .NotEmpty()
            .When(r => r.HasExpiredLicence == true);

        // Documents required for branding
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding))
            .When(r => r.NoBranding == false)
            .WithMessage("Missing business branding document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) <= 10)
            .When(r => r.NoBranding == false && r.DocumentInfos?.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) > 0)
            .WithMessage("Maximum of 10 documents allowed for branding was exceeded.");

        // Document required for business insurance
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance))
            .WithMessage("Missing business insurance document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance) < 2)
            .When(r => r.DocumentInfos?.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance) > 0)
            .WithMessage("No more than 1 business insurance document is allowed.");

        // Document required for "Armoured car guard"
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard))
            .WithMessage("Missing armoured car guard registrar document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) <= 10)
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard) && r.DocumentInfos?.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) > 0)
            .WithMessage("No more than 10 armoured car guard registrar document is allowed.");

        // Document required for "Security guard"
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityGuard) && r.UseDogs == true)
            .WithMessage("Missing security dog certificate document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate) < 2)
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityGuard)
                && r.UseDogs == true
                && r.DocumentInfos?.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate) > 0)
            .WithMessage("No more than 1 dog certificate is allowed.");
    }
}

public class BizLicAppSubmitRequestValidator : BizLicAppBaseValidator<BizLicAppSubmitRequest>
{
    public BizLicAppSubmitRequestValidator(IConfiguration configuration)
    {
        // General validations
        RuleFor(r => r.LatestApplicationId).NotEmpty();
        RuleFor(r => r.OriginalLicenceId).NotEmpty();
        RuleFor(r => r.PreviousDocumentIds)
            .Must(r => r != null && r.Any())
            .WithMessage("Missing previous documents.");
        RuleFor(r => r.BizTypeCode)
            .Must(r => r == BizTypeCode.NonRegisteredSoleProprietor || r == BizTypeCode.RegisteredSoleProprietor)
            .When(r => r.SoleProprietorSWLAppId != null);

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
    }
}
