using FluentValidation;

namespace Spd.Manager.Licence;
public class BizLicAppSubmitRequestValidator : AbstractValidator<BizLicAppUpsertRequest>
{
    public BizLicAppSubmitRequestValidator()
    {
        // General validations
        RuleFor(r => r.BizId).NotEqual(Guid.Empty);
        RuleFor(r => r.HasExpiredLicence).NotEmpty();
        RuleFor(r => r.ExpiredLicenceId)
            .NotEmpty()
            .When(r => r.HasExpiredLicence == true);
        RuleFor(r => r.NoBranding).NotEmpty();
        RuleFor(r => r.UseDogs).NotEmpty();
        RuleFor(r => r.ApplicantIsBizManager).NotEmpty();
        RuleFor(r => r.BizManagerContactInfo)
            .NotEmpty()
            .When(r => r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.ApplicantContactInfo)
            .NotEmpty()
            .When(r => r.ApplicantIsBizManager == false);
        RuleFor(r => r.WorkerLicenceTypeCode).NotEmpty();
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(r => r.BizTypeCode).NotEmpty();
        RuleFor(r => r.LicenceTermCode)
            .NotEmpty()
            .Must(r => r == Shared.LicenceTermCode.OneYear || r == Shared.LicenceTermCode.TwoYears || r == Shared.LicenceTermCode.ThreeYears);

        // Parent/child categories
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmSales) && 
                r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor) && 
                r.Contains(WorkerCategoryTypeCode.SecurityAlarmResponse) && 
                r.Contains(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller) && 
                r.Contains(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityAlarmInstaller));
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor) &&
                r.Contains(WorkerCategoryTypeCode.SecurityAlarmResponse))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityAlarmResponse));
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.Locksmith));
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor) &&
                r.Contains(WorkerCategoryTypeCode.SecurityAlarmResponse))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityGuard));
        
        // Documents required for branding
        RuleFor(r => r)
            .Must(r => r.DocumentInfos != null && 
                r.DocumentInfos.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) &&
                r.DocumentInfos.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) <= 10)
            .When(r => r.NoBranding == false)
            .WithMessage("Missing business branding document.");
        RuleFor(r => r)
            .Must(r => r.DocumentInfos != null &&
                r.DocumentInfos.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) <= 10)
            .When(r => r.NoBranding == false)
            .WithMessage("Maximum of 10 documents allowed for branding was exceded.");

        // Document required for business insurance
        RuleFor(r => r)
            .Must(r => r.DocumentInfos != null &&
                r.DocumentInfos.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance))
            .WithMessage("Missing business insurance document.");

        // Document required for "Armoured car guard"
        RuleFor(r => r)
            .Must(r => r.DocumentInfos != null &&
                r.DocumentInfos.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard))
            .WithMessage("Missing armour car guard registrar document.");

        // Document required for "Security guard"
        RuleFor(r => r)
            .Must(r => r.DocumentInfos != null &&
                r.DocumentInfos.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard))
            .WithMessage("Missing security dog certificate document.");

        // Prviate investigator
        RuleFor(r => r.PrivateInvestigatorSwlInfo)
            .NotEmpty()
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.PrivateInvestigator) &&
                (r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && 
                 r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor))
            .WithMessage("Missing private investigator information.");

    }
}
