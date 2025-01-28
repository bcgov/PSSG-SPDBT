using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public class GDSDTeamLicenceAppUpsertRequestValidator : GDSDTeamLicenceAppBaseValidator<GDSDTeamLicenceAppUpsertRequest>
{
    public GDSDTeamLicenceAppUpsertRequestValidator()
    {

    }
}

public class GDSDTeamLicenceAppAnonymousSubmitRequestValidator : GDSDTeamLicenceAppBaseValidator<GDSDTeamLicenceAppAnonymousSubmitRequest>
{
    public GDSDTeamLicenceAppAnonymousSubmitRequestValidator()
    {
    }
}

public class GDSDTeamLicenceAppBaseValidator<T> : AbstractValidator<T> where T : GDSDTeamLicenceAppBase
{
    public GDSDTeamLicenceAppBaseValidator()
    {
        RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.ArmouredVehiclePermit || t == ServiceTypeCode.BodyArmourPermit); //must be team, dog trainer or retired dog
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(r => r.Surname).MaximumLength(40).NotEmpty();
        RuleFor(r => r.LegalGivenName).MaximumLength(40);
        RuleFor(r => r.MiddleName).MaximumLength(40);
        RuleFor(r => r.DateOfBirth).NotNull().NotEmpty().Must(d => d > new DateOnly(1800, 1, 1));
        RuleFor(r => r.ContactPhoneNumber).MaximumLength(15).NotEmpty();
        RuleFor(r => r.ContactEmail).MaximumLength(75).When(r => r.ContactEmail != null);
        //mailing address
        RuleFor(r => r.MailingAddress.Province).NotEmpty().When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.City).NotEmpty().MaximumLength(100).When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.AddressLine1).NotEmpty().MaximumLength(100).When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.Country).NotEmpty().MaximumLength(100).When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.PostalCode).NotEmpty().MaximumLength(20).When(r => r.MailingAddress != null);

        RuleFor(r => r.DogInfoNewCreditSchool).NotEmpty().When(r => r.DogTrainedByAccreditSchool);
        RuleFor(r => r.DogInfoNewCreditSchool.DogName).NotEmpty().When(r => r.DogTrainedByAccreditSchool);

        //RuleFor(r => r.ExpiredLicenceId).NotEmpty().When(r => r.HasExpiredLicence == true);
        //RuleFor(r => r.HasCriminalHistory).NotEmpty();
        //RuleFor(r => r.HasBcDriversLicence).NotEmpty();
        //RuleFor(r => r.HairColourCode).NotEmpty();
        //RuleFor(r => r.EyeColourCode).NotEmpty();
        //RuleFor(r => r.Height).NotEmpty();
        //RuleFor(r => r.HeightUnitCode).NotEmpty();
        //RuleFor(r => r.Weight).NotEmpty();
        //RuleFor(r => r.WeightUnitCode).NotEmpty();
        //RuleFor(r => r.IsMailingTheSameAsResidential).NotEmpty();

        //RuleFor(r => r.IsCanadianCitizen).NotEmpty();

        //RuleFor(r => r.HasNewCriminalRecordCharge).NotNull()
        //    .When(r => r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update);
    }
}

