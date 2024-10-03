using FluentValidation;
using System.Text.RegularExpressions;

namespace Spd.Manager.Licence;
public class BizLicAppBaseValidator<T> : AbstractValidator<T> where T : BizLicenceApp
{
    public BizLicAppBaseValidator()
    {
        Regex emailRegex = new(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", RegexOptions.NonBacktracking);

        RuleFor(r => r.NoBranding).NotEmpty();
        RuleFor(r => r.BizTypeCode).NotEmpty();
        RuleFor(r => r.UseDogs)
            .NotEmpty()
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityGuard));
        RuleFor(r => r.ApplicantContactInfo.Surname)
            .NotEmpty()
            .When(r => r.ApplicantContactInfo != null && r.ApplicantIsBizManager == false);
        RuleFor(r => r.ApplicantContactInfo.PhoneNumber)
            .NotEmpty()
            .When(r => r.ApplicantContactInfo != null && r.ApplicantIsBizManager == false);
        RuleFor(r => r.ApplicantContactInfo.EmailAddress)
            .NotEmpty()
            .EmailAddress()
            .When(r => r.ApplicantContactInfo != null && r.ApplicantIsBizManager == false);
        RuleFor(r => r.WorkerLicenceTypeCode).NotEmpty();
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(r => r.LicenceTermCode)
            .NotEmpty()
            .Must(r => r == Shared.LicenceTermCode.OneYear || r == Shared.LicenceTermCode.TwoYears || r == Shared.LicenceTermCode.ThreeYears);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true);

        // Parent/child categories
        //RuleFor(r => r.CategoryCodes)
        //    .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmSales) &&
        //        r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor) &&
        //        r.Contains(WorkerCategoryTypeCode.SecurityAlarmResponse) &&
        //        r.Contains(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller) &&
        //        r.Contains(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller))
        //    .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityAlarmInstaller));
        //RuleFor(r => r.CategoryCodes)
        //    .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor))
        //    .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityAlarmResponse));
        //RuleFor(r => r.CategoryCodes)
        //    .Must(r => r.Contains(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller))
        //    .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.Locksmith));
        //RuleFor(r => r.CategoryCodes)
        //    .Must(r => r.Contains(WorkerCategoryTypeCode.SecurityAlarmMonitor) &&
        //        r.Contains(WorkerCategoryTypeCode.SecurityAlarmResponse))
        //    .When(r => r.CategoryCodes.Any(c => c == WorkerCategoryTypeCode.SecurityGuard));

        // Private investigator
        RuleFor(r => r.PrivateInvestigatorSwlInfo)
            .Must(r => r.ContactId != null && r.ContactId != Guid.Empty &&
                 r.LicenceId != null && r.LicenceId != Guid.Empty &&
                 !string.IsNullOrEmpty(r.Surname))
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.PrivateInvestigator) &&
                 r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor &&
                 r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor)
            .WithMessage("Missing private investigator information.");
    }
}
