using FluentValidation;
using Microsoft.Extensions.Configuration;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public class PermitAppAnonymousSubmitRequestValidator : PersonalLicenceAppBaseValidator<PermitAppAnonymousSubmitRequest>
{
    public PermitAppAnonymousSubmitRequestValidator(IConfiguration configuration)
    {
        RuleFor(r => r.WorkerLicenceTypeCode).Must(t => t == WorkerLicenceTypeCode.ArmouredVehiclePermit || t == WorkerLicenceTypeCode.BodyArmourPermit);
        RuleFor(r => r.OriginalApplicationId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.OriginalLicenceId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true).When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
        RuleFor(r => r.PermitOtherRequiredReason).NotEmpty()
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.Other) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.Other) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerName).NotEmpty()
            .MaximumLength(160)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorName).NotEmpty()
            .MaximumLength(100)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorPhoneNumber).NotEmpty()
            .MaximumLength(15)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit));
        RuleFor(r => r.SupervisorEmailAddress).NotEmpty()
            .MaximumLength(75)
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit));
        RuleFor(r => r.EmployerPrimaryAddress).NotNull()
            .When(r =>
            (r.ArmouredVehiclePermitReasonCodes != null && r.ArmouredVehiclePermitReasonCodes.Contains(ArmouredVehiclePermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit) ||
            (r.BodyArmourPermitReasonCodes != null && r.BodyArmourPermitReasonCodes.Contains(BodyArmourPermitReasonCode.MyEmployment) && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit));
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
            .When(r => r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit || r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit);
        RuleFor(r => r.IsCanadianResident).NotEmpty()
            .When(r => r.IsCanadianCitizen == false && (r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit || r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit));
        RuleFor(r => r.BodyArmourPermitReasonCodes).NotNull()
            .When(r => r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit);
        RuleFor(r => r.BodyArmourPermitReasonCodes.Count()).GreaterThan(0)
            .When(r => r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit && r.BodyArmourPermitReasonCodes != null);
        RuleFor(r => r.ArmouredVehiclePermitReasonCodes).NotNull()
            .When(r => r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit);
        RuleFor(r => r.ArmouredVehiclePermitReasonCodes.Count()).GreaterThan(0)
            .When(r => r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit && r.ArmouredVehiclePermitReasonCodes != null);
        RuleFor(r => r.LicenceTermCode).Must(t => t == LicenceTermCode.FiveYears)
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.New && r.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit);
    }

}


