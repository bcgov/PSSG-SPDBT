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
        RuleFor(r => r.Surname).NotEmpty();
        RuleFor(r => r.GenderCode).NotEmpty();
        RuleFor(r => r.DateOfBirth).NotEmpty();
        RuleFor(r => r.PhoneNumber).NotEmpty();
        RuleFor(r => r.EmailAddress).NotEmpty().EmailAddress();
        RuleFor(r => r.ResidentialAddress).NotEmpty();
        RuleFor(r => r.ResidentialAddress.AddressLine1)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.City).NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Province).NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Country).NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.PostalCode).NotEmpty()
            .MaximumLength(20)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.HasCriminalHistory).NotEmpty();
        RuleFor(r => r.CriminalHistoryDetail)
            .NotEmpty()
            .MaximumLength(1000)
            .When(r => r.HasCriminalHistory == true);
        RuleFor(r => r.HasBankruptcyHistory).NotEmpty();
        RuleFor(r => r.BankruptcyHistoryDetail)
            .NotEmpty()
            .MaximumLength(1000)
            .When(r => r.HasBankruptcyHistory == true);

        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotEmpty();
        RuleFor(r => r.PoliceOfficerRoleCode)
            .NotEmpty()
            .When(r => r.IsPoliceOrPeaceOfficer == true);
        RuleFor(r => r.OtherOfficerRole)
            .NotEmpty()
            .MaximumLength(50)
            .When(r => r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerRoleCode == PoliceOfficerRoleCode.Other);

        RuleFor(r => r.Aliases)
            .NotEmpty()
            .Must(r => r.Count() <= Constants.MaximumNumberOfUserEnteredAliases)
            .When(r => r.HasPreviousNames == true)
            .WithMessage("No more than 10 user entered aliases are allowed");

        RuleForEach(r => r.Aliases)
            .ChildRules(aliases =>
            {
                aliases.RuleFor(alias => alias.Surname)
                    .NotEmpty()
                    .WithMessage("Surname name is required for all aliases.");
            })
            .When(r => r.Aliases != null && r.HasPreviousNames == true);

        RuleFor(r => r.IsTreatedForMHC).NotEmpty();
        RuleFor(r => r.IsCanadianCitizen).NotEmpty();
        RuleFor(r => r.BcDriversLicenceNumber)
            .MaximumLength(7)
            .When(r => r.HasBcDriversLicence == true);
        RuleFor(r => r.AgreeToCompleteAndAccurate).Equal(true);
    }
}