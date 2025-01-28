using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public class GDSDTeamLicenceAppUpsertRequestValidator : GDSDTeamLicenceAppBaseValidator<GDSDTeamLicenceAppUpsertRequest>
{
    public GDSDTeamLicenceAppUpsertRequestValidator()
    {
        //RuleFor(r => r.ApplicantId).NotEqual(Guid.Empty);
        //RuleFor(r => r.DateOfBirth).Must(d => d > new DateOnly(1800, 1, 1)).When(d => d.DateOfBirth != null);
        //RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.ArmouredVehiclePermit || t == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true);
        //RuleFor(r => r.PermitOtherRequiredReason).NotEmpty()
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.EmployerName).NotEmpty()
        //    .MaximumLength(160)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.SupervisorName).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.SupervisorPhoneNumber)
        //    .NotEmpty()
        //    .MaximumLength(30)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.SupervisorEmailAddress).NotEmpty()
        //    .MaximumLength(75)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.EmployerPrimaryAddress).NotNull()
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.EmployerPrimaryAddress.AddressLine1)
        //    .NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.City).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.Province).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.Country).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.PostalCode).NotEmpty()
        //    .MaximumLength(20)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.Rationale).NotEmpty()
        //    .MaximumLength(3000)
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.IsCanadianResident).NotEmpty()
        //    .When(r => r.IsCanadianCitizen == false && (r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.BodyArmourPermitReasonCodes).NotNull()
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.BodyArmourPermitReasonCodes.Count()).GreaterThan(0)
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit && r.BodyArmourPermitReasonCodes != null);
        //RuleFor(r => r.ArmouredVehiclePermitReasonCodes).NotNull()
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit);
        //RuleFor(r => r.ArmouredVehiclePermitReasonCodes.Count()).GreaterThan(0)
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit && r.ArmouredVehiclePermitReasonCodes != null);
        //RuleFor(r => r.LicenceTermCode).Must(t => t == LicenceTermCode.FiveYears)
        //    .When(r => r.ApplicationTypeCode == ApplicationTypeCode.New && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.DocumentInfos)
        //    .Must(r => r.Any(f => LicenceAppDocumentManager.NonCanadianCitizenProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
        //    .When(r => r.IsCanadianResident != null && !r.IsCanadianResident.Value && r.IsCanadianCitizen != null && !r.IsCanadianCitizen.Value)
        //    .WithMessage("Missing proven file because you are not a resident.");
        //RuleFor(r => r.DocumentInfos)
        //    .Must(r => r.Any(f => LicenceAppDocumentManager.CanadianResidencyProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
        //    .When(r => r.IsCanadianResident != null && r.IsCanadianResident.Value)
        //    .WithMessage("Missing proven file because you are not canadian.");
        //RuleFor(r => r.DocumentInfos)
        //   .Must(r => r.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
        //   .When(r => r.IsCanadianCitizen != null && r.IsCanadianCitizen.Value)
        //   .WithMessage("Missing citizen proof file because you are canadian.");
    }
}

public class GDSDTeamLicenceAppAnonymousSubmitRequestValidator : GDSDTeamLicenceAppBaseValidator<GDSDTeamLicenceAppAnonymousSubmitRequest>
{
    public GDSDTeamLicenceAppAnonymousSubmitRequestValidator()
    {
        //RuleFor(r => r.DateOfBirth).Must(d => d > new DateOnly(1800, 1, 1)).When(d => d.DateOfBirth != null);
        //RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.ArmouredVehiclePermit || t == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.OriginalApplicationId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        //RuleFor(r => r.OriginalLicenceId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        //RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true).When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
        //RuleFor(r => r.PermitOtherRequiredReason).NotEmpty()
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.EmployerName).NotEmpty()
        //    .MaximumLength(160)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.SupervisorName).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.SupervisorPhoneNumber)
        //    .NotEmpty()
        //    .MaximumLength(30)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.SupervisorEmailAddress).NotEmpty()
        //    .MaximumLength(75)
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.EmployerPrimaryAddress).NotNull()
        //    .When(r =>
        //    (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
        //    (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.EmployerPrimaryAddress.AddressLine1)
        //    .NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.City).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.Province).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.Country).NotEmpty()
        //    .MaximumLength(100)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.EmployerPrimaryAddress.PostalCode).NotEmpty()
        //    .MaximumLength(20)
        //    .When(r => r.EmployerPrimaryAddress != null);
        //RuleFor(r => r.Rationale).NotEmpty()
        //    .MaximumLength(3000)
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.IsCanadianResident).NotEmpty()
        //    .When(r => r.IsCanadianCitizen == false && (r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        //RuleFor(r => r.BodyArmourPermitReasonCodes).NotNull()
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.BodyArmourPermitReasonCodes.Count()).GreaterThan(0)
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit && r.BodyArmourPermitReasonCodes != null);
        //RuleFor(r => r.ArmouredVehiclePermitReasonCodes).NotNull()
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit);
        //RuleFor(r => r.ArmouredVehiclePermitReasonCodes.Count()).GreaterThan(0)
        //    .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit && r.ArmouredVehiclePermitReasonCodes != null);
        //RuleFor(r => r.LicenceTermCode).Must(t => t == LicenceTermCode.FiveYears)
        //    .When(r => r.ApplicationTypeCode == ApplicationTypeCode.New && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        //RuleFor(r => r.CriminalChargeDescription)
        //    .NotEmpty()
        //    .MaximumLength(1000)
        //    .When(r => r.HasNewCriminalRecordCharge == true && r.ApplicationTypeCode == ApplicationTypeCode.Update);
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

