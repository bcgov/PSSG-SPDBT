using FluentValidation;
using Spd.Manager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Manager.Licence;
public class ControllingMemberCrcAppAnonymousSubmitRequestValidator : AbstractValidator<ControllingMemberCrcAppSubmitRequest>
{
    public ControllingMemberCrcAppAnonymousSubmitRequestValidator()
    {
        RuleFor(r => r.ParentBizLicApplicationId).NotEqual(Guid.Empty);
        RuleFor(r => r.WorkerLicenceTypeCode)
            .Equal(WorkerLicenceTypeCode.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC);
        RuleFor(r => r.Surname)
            .MaximumLength(40)
            .NotNull()
            .NotEmpty();
        RuleFor(r => r.GivenName)
            .MaximumLength(40);
        RuleFor(r => r.MiddleName1)
            .MaximumLength(40);
        RuleFor(r => r.MiddleName2)
            .MaximumLength(40);
        RuleFor(r => r.GenderCode)
            .NotNull()
            .NotEmpty();
        RuleFor(r => r.DateOfBirth).NotNull().NotEmpty();
        RuleFor(r => r.PhoneNumber)
            .MaximumLength(15);
        RuleFor(r => r.EmailAddress)
            .MaximumLength(75)
            .EmailAddress();
        RuleFor(r => r.ResidentialAddress).NotEmpty();
        RuleFor(r => r.ResidentialAddress.AddressLine1).NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.AddressLine2)
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.City)
            .NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Province)
            .NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Country)
            .NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.PostalCode)
            .NotNull()
            .NotEmpty()
            .MaximumLength(20)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.HasCriminalHistory).NotNull();
        RuleFor(r => r.CriminalHistoryDetail)
            .NotNull()
            .NotEmpty()
            .MaximumLength(250)
            .When(r => r.HasCriminalHistory == true);
        RuleFor(r => r.HasBankruptcyHistory).NotNull()
            .NotEmpty();
        RuleFor(r => r.BankruptcyHistoryDetail).NotNull()
            .NotEmpty()
            .MaximumLength(250)
            .When(r => r.HasBankruptcyHistory == true);

        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotNull();
        RuleFor(r => r.PoliceOfficerRoleCode)
            .NotNull()
            .NotEmpty()
            .When(r => r.IsPoliceOrPeaceOfficer == true);
        RuleFor(r => r.OtherOfficerRole)
            .NotNull()
            .NotEmpty()
            .MaximumLength(50)
            .When(r => r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerRoleCode == PoliceOfficerRoleCode.Other);

        RuleFor(r => r.Aliases)
            .NotNull()
            .NotEmpty()
            .Must(r => r.Count() <= 3)
            .When(r => r.HasPreviousNames == true)
            .WithMessage("No more than 3 user entered aliases are allowed");

        RuleForEach(r => r.Aliases)
            .ChildRules(aliases =>
            {
                aliases.RuleFor(r => r.Surname)
                    .MaximumLength(40)
                    .NotNull()
                    .NotEmpty()
                    .WithMessage("Surname name is required for all aliases.");
                aliases.RuleFor(r => r.GivenName)
                    .MaximumLength(40);
                aliases.RuleFor(r => r.MiddleName1)
                    .MaximumLength(40);
                aliases.RuleFor(r => r.MiddleName2)
                    .MaximumLength(40);
            })
            .When(r => r.Aliases != null && r.HasPreviousNames == true);

        RuleFor(r => r.IsTreatedForMHC).NotNull();
        RuleFor(r => r.IsCanadianCitizen).NotNull();
        RuleFor(r => r.BcDriversLicenceNumber)
            .NotNull()
            .NotEmpty()
            .MaximumLength(8)
            .When(r => r.HasBcDriversLicence == true);
        RuleFor(r => r.AgreeToCompleteAndAccurate).Equal(true);
        RuleFor(r => r.LicenceTermCode).NotNull();
        RuleFor(r => r.ApplicationTypeCode).NotNull();
    }
}
public class ControllingMemberCrcAppSubmitRequestValidator : AbstractValidator<ControllingMemberCrcAppUpsertRequest>
{
    public ControllingMemberCrcAppSubmitRequestValidator()
    {
        RuleFor(r => r.ParentBizLicApplicationId).NotEqual(Guid.Empty);
        RuleFor(r => r.WorkerLicenceTypeCode)
            .Equal(WorkerLicenceTypeCode.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC);
        RuleFor(r => r.Surname)
            .MaximumLength(40)
            .NotNull()
            .NotEmpty();
        RuleFor(r => r.GivenName)
            .MaximumLength(40);
        RuleFor(r => r.MiddleName1)
            .MaximumLength(40);
        RuleFor(r => r.MiddleName2)
            .MaximumLength(40);
        RuleFor(r => r.GenderCode)
            .NotNull()
            .NotEmpty();
        RuleFor(r => r.DateOfBirth).NotNull().NotEmpty();
        RuleFor(r => r.PhoneNumber)
            .MaximumLength(15);
        RuleFor(r => r.EmailAddress)
            .MaximumLength(75)
            .EmailAddress();
        RuleFor(r => r.ResidentialAddress).NotEmpty();
        RuleFor(r => r.ResidentialAddress.AddressLine1).NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.AddressLine2)
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.City)
            .NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Province)
            .NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Country)
            .NotNull()
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.PostalCode)
            .NotNull()
            .NotEmpty()
            .MaximumLength(20)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.HasCriminalHistory).NotNull();
        RuleFor(r => r.CriminalHistoryDetail)
            .NotNull()
            .NotEmpty()
            .MaximumLength(250)
            .When(r => r.HasCriminalHistory == true);
        RuleFor(r => r.HasBankruptcyHistory).NotNull()
            .NotEmpty();
        RuleFor(r => r.BankruptcyHistoryDetail).NotNull()
            .NotEmpty()
            .MaximumLength(250)
            .When(r => r.HasBankruptcyHistory == true);

        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotNull();
        RuleFor(r => r.PoliceOfficerRoleCode)
            .NotNull()
            .NotEmpty()
            .When(r => r.IsPoliceOrPeaceOfficer == true);
        RuleFor(r => r.OtherOfficerRole)
            .NotNull()
            .NotEmpty()
            .MaximumLength(50)
            .When(r => r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerRoleCode == PoliceOfficerRoleCode.Other);

        RuleFor(r => r.Aliases)
            .NotNull()
            .NotEmpty()
            .Must(r => r.Count() <= 3)
            .When(r => r.HasPreviousNames == true)
            .WithMessage("No more than 3 user entered aliases are allowed");

        RuleForEach(r => r.Aliases)
            .ChildRules(aliases =>
            {
                aliases.RuleFor(r => r.Surname)
                    .MaximumLength(40)
                    .NotNull()
                    .NotEmpty()
                    .WithMessage("Surname name is required for all aliases.");
                aliases.RuleFor(r => r.GivenName)
                    .MaximumLength(40);
                aliases.RuleFor(r => r.MiddleName1)
                    .MaximumLength(40);
                aliases.RuleFor(r => r.MiddleName2)
                    .MaximumLength(40);
            })
            .When(r => r.Aliases != null && r.HasPreviousNames == true);

        RuleFor(r => r.IsTreatedForMHC).NotNull();
        RuleFor(r => r.IsCanadianCitizen).NotNull();
        RuleFor(r => r.BcDriversLicenceNumber)
            .NotNull()
            .NotEmpty()
            .MaximumLength(8)
            .When(r => r.HasBcDriversLicence == true);
        RuleFor(r => r.AgreeToCompleteAndAccurate).Equal(true);
        RuleFor(r => r.LicenceTermCode).NotNull();
        RuleFor(r => r.ApplicationTypeCode).NotNull();
    }

}