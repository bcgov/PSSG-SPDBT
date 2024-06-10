using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;

namespace Spd.Manager.Licence;
public class BizLicAppSubmitRequestValidator : AbstractValidator<BizLicAppUpsertRequest>
{
    public BizLicAppSubmitRequestValidator()
    {
        Regex emailRegex = new(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", RegexOptions.NonBacktracking);

        // General validations
        RuleFor(r => r.BizId).NotEqual(Guid.Empty);
        RuleFor(r => r.HasExpiredLicence).NotEmpty();
        RuleFor(r => r.ExpiredLicenceId)
            .NotEmpty()
            .When(r => r.HasExpiredLicence == true);
        RuleFor(r => r.NoBranding).NotEmpty();
        RuleFor(r => r.UseDogs)
            .NotEmpty()
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityGuard));
        RuleFor(r => r.ApplicantIsBizManager).NotEmpty();
        RuleFor(r => r.BizManagerContactInfo)
            .Must(r => r.GivenName.IsNullOrEmpty() != true && 
                r.Surname.IsNullOrEmpty() != true && 
                r.PhoneNumber.IsNullOrEmpty() != true &&
                r.EmailAddress.IsNullOrEmpty() != true && emailRegex.IsMatch(r.EmailAddress))
            .When(r => r.BizManagerContactInfo != null);
        RuleFor(r => r.ApplicantContactInfo)
            .Must(r => r.GivenName.IsNullOrEmpty() != true &&
                r.Surname.IsNullOrEmpty() != true &&
                r.PhoneNumber.IsNullOrEmpty() != true &&
                r.EmailAddress.IsNullOrEmpty() != true && emailRegex.IsMatch(r.EmailAddress))
            .When(r => r.ApplicantIsBizManager == false);
        RuleFor(r => r.WorkerLicenceTypeCode).NotEmpty();
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(r => r.LicenceTermCode)
            .NotEmpty()
            .Must(r => r == Shared.LicenceTermCode.OneYear || r == Shared.LicenceTermCode.TwoYears || r == Shared.LicenceTermCode.ThreeYears);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true);

        // Parent/child categories
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmSales) && 
                r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor) && 
                r.Contains(WorkerCategoryTypeCode.SecurityAlarmResponse) && 
                r.Contains(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller) && 
                r.Contains(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityAlarmInstaller));
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityAlarmResponse));
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.Locksmith));
        RuleFor(r => r.CategoryCodes)
            .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor) &&
                r.Contains(WorkerCategoryTypeCode.SecurityAlarmResponse))
            .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityGuard));

        // Documents required for branding
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding))
            .When(r => r.NoBranding == false)
            .WithMessage("Missing business branding document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) <= 10)
            .When(r => r.NoBranding == false && r.DocumentInfos?.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) > 0)
            .WithMessage("Maximum of 10 documents allowed for branding was exceded.");

        // Document required for business insurance
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance))
            .WithMessage("Missing business insurance document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance) < 2)
            .When(r => r.DocumentInfos?.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate) > 0)
            .WithMessage("No more than 1 business insurance document is allowed.");

        // Document required for "Armoured car guard"
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard))
            .WithMessage("Missing armoured car guard registrar document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) == 1)
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard) && r.DocumentInfos?.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) > 0)
            .WithMessage("No more than 1 armoured car guard registrar document is allowed.");

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

        // Private investigator
        RuleFor(r => r.PrivateInvestigatorSwlInfo)
            .Must(r => r.LicenceId != null && r.LicenceId != Guid.Empty)
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.PrivateInvestigator))
            .WithMessage("Missing private investigator information.");

        // Controlling members
        RuleFor(r => r.Members.SwlControllingMembers)
            .ForEach(r => r
                .Must(m => m.LicenceId != null && m.LicenceId != Guid.Empty))
            .When(r => r.Members != null && r.Members.SwlControllingMembers != null)
            .WithMessage("Missing infomration in Controlling members (SWL)");
        
        RuleFor(r => r.Members.NonSwlControllingMembers)
            .ForEach(r => r
                .Must(m => m.Surname.IsNullOrEmpty() != true)
                .Must(m => m.EmailAddress.IsNullOrEmpty() != true && emailRegex.IsMatch(m.EmailAddress)))
                .WithMessage("Missing information in Controlling members (not SWL)")
            .When(r => r.Members != null && r.Members.NonSwlControllingMembers != null);
        
        RuleFor(r => r.Members)
            .Must(r => r.SwlControllingMembers.Count() + r.NonSwlControllingMembers.Count() <= 20)
            .When(r => r.Members != null && r.Members.SwlControllingMembers != null && r.Members.NonSwlControllingMembers != null);

        // Employees
        RuleFor(r => r.Members.Employees)
            .ForEach(r => r
                .Must(m => m.LicenceId != null && m.LicenceId != Guid.Empty))
            .When(r => r.Members != null && r.Members.Employees != null)
            .WithMessage("Missing information in employees");
        RuleFor(r => r.Members.Employees)
            .Must(r => r.Count() <= 20)
            .When(r => r.Members != null && r.Members.Employees != null)
            .WithMessage("No more than 20 employees are allowed");
    }
}
