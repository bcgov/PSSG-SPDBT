﻿using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;

namespace Spd.Manager.Licence;
public class BizLicenceAppBaseValidator<T> : AbstractValidator<T> where T : BizLicenceApp
{
    public BizLicenceAppBaseValidator()
    {
        Regex emailRegex = new(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", RegexOptions.NonBacktracking);

        RuleFor(r => r.NoBranding).NotEmpty();
        RuleFor(r => r.BizTypeCode).NotEmpty();
        RuleFor(r => r.UseDogs)
            .NotEmpty()
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityGuard));
        RuleFor(r => r.ApplicantIsBizManager)
            .NotEmpty()
            .When(r => r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.BizManagerContactInfo)
            .Must(r => r.GivenName.IsNullOrEmpty() != true &&
                r.Surname.IsNullOrEmpty() != true &&
                r.PhoneNumber.IsNullOrEmpty() != true &&
                r.EmailAddress.IsNullOrEmpty() != true && emailRegex.IsMatch(r.EmailAddress))
            .When(r => r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
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

        // Private investigator
        RuleFor(r => r.PrivateInvestigatorSwlInfo)
            .Must(r => r.LicenceId != null && r.LicenceId != Guid.Empty)
            .When(r => r.CategoryCodes.Contains(WorkerCategoryTypeCode.PrivateInvestigator) &&
                 r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor &&
                 r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor)
            .WithMessage("Missing private investigator information.");

        // Controlling members
        RuleFor(r => r.Members.SwlControllingMembers)
            .ForEach(r => r
                .Must(m => m.LicenceId != null && m.LicenceId != Guid.Empty))
            .When(r => r.Members != null && r.Members.SwlControllingMembers != null)
            .WithMessage("Missing licence Id in Controlling members (SWL)");

        RuleFor(r => r.Members.NonSwlControllingMembers)
            .ForEach(r => r
                .Must(m => m.Surname.IsNullOrEmpty() != true)
                .Must(m => m.EmailAddress != null ? emailRegex.IsMatch(m.EmailAddress) : true))
                .WithMessage("Missing surname in Controlling members (not SWL)")
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