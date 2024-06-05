using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;

namespace Spd.Manager.Licence;
public class BizLicAppSubmitRequestValidator : AbstractValidator<BizLicAppUpsertRequest>
{
    public BizLicAppSubmitRequestValidator()
    {
        Regex emailRegex = new(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");

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
            .Must(r => r.GivenName.IsNullOrEmpty() != true && 
                r.Surname.IsNullOrEmpty() != true && 
                r.PhoneNumber.IsNullOrEmpty() != true &&
                r.EmailAddress.IsNullOrEmpty() != true && emailRegex.IsMatch(r.EmailAddress))
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
            .WithMessage("Missing business branding document.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r.Count(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) <= 10)
            .WithMessage("Maximum of 10 documents allowed for branding was exceded.")
            .When(r => r.DocumentInfos != null);

        // Document required for business insurance
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance))
            .WithMessage("Missing business insurance document.");

        // Document required for "Armoured car guard"
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard))
            .WithMessage("Missing armour car guard registrar document.");

        // Document required for "Security guard"
        RuleFor(r => r.DocumentInfos)
            .Must(r => r != null && r.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard))
            .WithMessage("Missing security dog certificate document.");

        // Private investigator
        RuleFor(r => r.PrivateInvestigatorSwlInfo)
            .Must(r => r.LicenceId != null && r.LicenceId != Guid.Empty)
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.PrivateInvestigator) &&
                (r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && 
                 r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor))
            .WithMessage("Missing private investigator information.");

        // Controlling members
        RuleFor(r => r.Members.SwlControllingMembers)
            .ForEach(r => r
                .Must(m => m.LicenceId != null && m.LicenceId != Guid.Empty))
            .When(r => r.Members != null && r.Members.SwlControllingMembers != null)
            .WithMessage("Missing infomration in Controlling members (SWL)");
        RuleFor(r => r.Members.SwlControllingMembers)
           .Must(r => r.Count() <= 20)
           .When(r => r.Members != null && r.Members.SwlControllingMembers != null)
           .WithMessage("No more than 20 Controlling members (SWL) are allowed");

        RuleFor(r => r.Members.NonSwlControllingMembers)
            .ForEach(r => r
                .Must(m => m.Surname.IsNullOrEmpty() != true)
                .Must(m => m.EmailAddress.IsNullOrEmpty() != true && emailRegex.IsMatch(m.EmailAddress)))
                .WithMessage("Missing information in Controlling members (not SWL)")
            .When(r => r.Members != null && r.Members.NonSwlControllingMembers != null);
        RuleFor(r => r.Members.NonSwlControllingMembers)
           .Must(r => r.Count() <= 20)
           .When(r => r.Members != null && r.Members.NonSwlControllingMembers != null)
           .WithMessage("No more than 20 Controlling members (not SWL) are allowed");

        //Employees
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
