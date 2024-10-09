using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public class PermitAppSubmitRequestValidator : PersonalLicenceAppBaseValidator<PermitAppUpsertRequest>
{
    public PermitAppSubmitRequestValidator()
    {
        RuleFor(r => r.ApplicantId).NotEqual(Guid.Empty);
        RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.ArmouredVehiclePermit || t == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true);
        RuleFor(r => r.PermitOtherRequiredReason).NotEmpty()
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerName).NotEmpty()
            .MaximumLength(160)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorName).NotEmpty()
            .MaximumLength(100)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorPhoneNumber).NotEmpty()
            .MaximumLength(30)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorEmailAddress).NotEmpty()
            .MaximumLength(75)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerPrimaryAddress).NotNull()
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerPrimaryAddress.AddressLine1)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.City).NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.Province).NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.Country).NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.PostalCode).NotEmpty()
            .MaximumLength(20)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.Rationale).NotEmpty()
            .MaximumLength(3000)
            .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.IsCanadianResident).NotEmpty()
            .When(r => r.IsCanadianCitizen == false && (r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.BodyArmourPermitReasonCodes).NotNull()
            .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.BodyArmourPermitReasonCodes.Count()).GreaterThan(0)
            .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit && r.BodyArmourPermitReasonCodes != null);
        RuleFor(r => r.ArmouredVehiclePermitReasonCodes).NotNull()
            .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit);
        RuleFor(r => r.ArmouredVehiclePermitReasonCodes.Count()).GreaterThan(0)
            .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit && r.ArmouredVehiclePermitReasonCodes != null);
        RuleFor(r => r.LicenceTermCode).Must(t => t == LicenceTermCode.FiveYears)
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.New && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.DocumentInfos)
            .Must(r => r.Any(f => LicenceAppDocumentManager.NonCanadianCitizenProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
            .When(r => r.IsCanadianResident != null && !r.IsCanadianResident.Value && r.IsCanadianCitizen != null && !r.IsCanadianCitizen.Value)
            .WithMessage("Missing proven file because you are not a resident.");
        RuleFor(r => r.DocumentInfos)
            .Must(r => r.Any(f => LicenceAppDocumentManager.CanadianResidencyProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
            .When(r => r.IsCanadianResident != null && r.IsCanadianResident.Value)
            .WithMessage("Missing proven file because you are not canadian.");
        RuleFor(r => r.DocumentInfos)
           .Must(r => r.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
           .When(r => r.IsCanadianCitizen != null && r.IsCanadianCitizen.Value)
           .WithMessage("Missing citizen proof file because you are canadian.");
    }
}

public class PermitAppAnonymousSubmitRequestValidator : PersonalLicenceAppBaseValidator<PermitAppSubmitRequest>
{
    public PermitAppAnonymousSubmitRequestValidator()
    {
        RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.ArmouredVehiclePermit || t == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.OriginalApplicationId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.OriginalLicenceId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true).When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
        RuleFor(r => r.PermitOtherRequiredReason).NotEmpty()
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.Other) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerName).NotEmpty()
            .MaximumLength(160)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorName).NotEmpty()
            .MaximumLength(100)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorPhoneNumber).NotEmpty()
            .MaximumLength(30)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorEmailAddress).NotEmpty()
            .MaximumLength(75)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerPrimaryAddress).NotNull()
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerPrimaryAddress.AddressLine1)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.City).NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.Province).NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.Country).NotEmpty()
            .MaximumLength(100)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.EmployerPrimaryAddress.PostalCode).NotEmpty()
            .MaximumLength(20)
            .When(r => r.EmployerPrimaryAddress != null);
        RuleFor(r => r.Rationale).NotEmpty()
            .MaximumLength(3000)
            .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.IsCanadianResident).NotEmpty()
            .When(r => r.IsCanadianCitizen == false && (r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit || r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit));
        RuleFor(r => r.BodyArmourPermitReasonCodes).NotNull()
            .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.BodyArmourPermitReasonCodes.Count()).GreaterThan(0)
            .When(r => r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit && r.BodyArmourPermitReasonCodes != null);
        RuleFor(r => r.ArmouredVehiclePermitReasonCodes).NotNull()
            .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit);
        RuleFor(r => r.ArmouredVehiclePermitReasonCodes.Count()).GreaterThan(0)
            .When(r => r.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit && r.ArmouredVehiclePermitReasonCodes != null);
        RuleFor(r => r.LicenceTermCode).Must(t => t == LicenceTermCode.FiveYears)
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.New && r.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit);
        RuleFor(r => r.CriminalChargeDescription)
            .NotEmpty()
            .MaximumLength(1000)
            .When(r => r.HasNewCriminalRecordCharge == true && r.ApplicationTypeCode == ApplicationTypeCode.Update);
    }

}


