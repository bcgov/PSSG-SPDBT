using FluentValidation;
using Spd.Manager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Manager.Licence;
public class ControllingMemberCrcAppValidator : AbstractValidator<ControllingMemberCrcAppSubmitRequest>
{
    public ControllingMemberCrcAppValidator()
    {
        RuleFor(r => r.ParentBizLicApplicationId).NotEmpty();
        RuleFor(r => r.Surname)
            .MaximumLength(40)
            .NotEmpty();
        RuleFor(r => r.GivenName)
            .MaximumLength(40);
        RuleFor(r => r.MiddleName1)
            .MaximumLength(40);
        RuleFor(r => r.MiddleName2)
            .MaximumLength(40);
        RuleFor(r => r.GenderCode).NotEmpty();
        RuleFor(r => r.DateOfBirth).NotEmpty();
        RuleFor(r => r.PhoneNumber)
            .MaximumLength(15);
        RuleFor(r => r.EmailAddress)
            .MaximumLength(75)
            .EmailAddress();
        RuleFor(r => r.ResidentialAddress).NotEmpty();
        RuleFor(r => r.ResidentialAddress.AddressLine1)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.AddressLine2)
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.City)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Province)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Country)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.PostalCode)
            .NotEmpty()
            .MaximumLength(20)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.HasCriminalHistory).NotEmpty();
        RuleFor(r => r.CriminalHistoryDetail)
            .NotEmpty()
            .MaximumLength(250)
            .When(r => r.HasCriminalHistory == true);
        RuleFor(r => r.HasBankruptcyHistory)
            .NotEmpty();
        RuleFor(r => r.BankruptcyHistoryDetail)
            .NotEmpty()
            .MaximumLength(250)
            .When(r => r.HasBankruptcyHistory == true);

        RuleFor(r => r.IsPoliceOrPeaceOfficer)
            .NotEmpty();
        RuleFor(r => r.PoliceOfficerRoleCode)
            .NotEmpty()
            .When(r => r.IsPoliceOrPeaceOfficer == true);
        RuleFor(r => r.OtherOfficerRole)
            .NotEmpty()
            .MaximumLength(50)
            .When(r => r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerRoleCode == PoliceOfficerRoleCode.Other);

        RuleFor(r => r.Aliases)
            .NotEmpty()
            .Must(r => r.Count() <= 3)
            .When(r => r.HasPreviousNames == true)
            .WithMessage("No more than 3 user entered aliases are allowed");

        RuleForEach(r => r.Aliases)
            .ChildRules(aliases =>
            {
                aliases.RuleFor(r => r.Surname)
                    .MaximumLength(40)
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

        RuleFor(r => r.IsTreatedForMHC).NotEmpty();
        RuleFor(r => r.IsCanadianCitizen).NotEmpty();
        RuleFor(r => r.BcDriversLicenceNumber)
            .MaximumLength(8)
            .When(r => r.HasBcDriversLicence == true);
        RuleFor(r => r.AgreeToCompleteAndAccurate).Equal(true);
    }
}