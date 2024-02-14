using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public class PersonalLicenceAppBaseValidator<T> : AbstractValidator<T> where T : PersonalLicenceAppBase
{
    public PersonalLicenceAppBaseValidator()
    {
        RuleFor(r => r.WorkerLicenceTypeCode).NotEmpty();
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(r => r.Surname).NotEmpty();
        RuleFor(r => r.DateOfBirth).NotEmpty();
        RuleFor(r => r.GenderCode).NotEmpty();
        RuleFor(r => r.LicenceTermCode).NotEmpty();
        RuleFor(r => r.HasExpiredLicence).NotEmpty();
        RuleFor(r => r.ExpiredLicenceNumber).NotEmpty().When(r => r.HasExpiredLicence == true);
        RuleFor(r => r.HasCriminalHistory).NotEmpty();
        RuleFor(r => r.HasBcDriversLicence).NotEmpty();
        RuleFor(r => r.HairColourCode).NotEmpty();
        RuleFor(r => r.EyeColourCode).NotEmpty();
        RuleFor(r => r.Height).NotEmpty();
        RuleFor(r => r.HeightUnitCode).NotEmpty();
        RuleFor(r => r.Weight).NotEmpty();
        RuleFor(r => r.WeightUnitCode).NotEmpty();
        RuleFor(r => r.HasCriminalHistory).NotEmpty();
        RuleFor(r => r.IsMailingTheSameAsResidential).NotEmpty();
        RuleFor(r => r.ContactPhoneNumber).MaximumLength(15).NotEmpty();
        RuleFor(r => r.ContactEmailAddress).MaximumLength(75).When(r => r.ContactEmailAddress != null);
        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotEmpty();
        RuleFor(r => r.PoliceOfficerRoleCode).NotEmpty().When(r => r.IsPoliceOrPeaceOfficer == true);
        RuleFor(r => r.OtherOfficerRole).NotEmpty()
            .When(r => r.IsPoliceOrPeaceOfficer != null && r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerRoleCode != null && r.PoliceOfficerRoleCode == PoliceOfficerRoleCode.Other);
        RuleFor(r => r.IsTreatedForMHC).NotEmpty();
        RuleFor(r => r.UseBcServicesCardPhoto).NotEmpty();
        RuleFor(r => r.IsCanadianCitizen).NotEmpty();
        //residential address
        RuleFor(r => r.ResidentialAddressData).NotEmpty().WithMessage("ResidentialAddress cannot be empty");
        RuleFor(r => r.ResidentialAddressData.Province).NotEmpty().When(r => r.ResidentialAddressData != null);
        RuleFor(r => r.ResidentialAddressData.City).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddressData != null);
        RuleFor(r => r.ResidentialAddressData.AddressLine1).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddressData != null);
        RuleFor(r => r.ResidentialAddressData.Country).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddressData != null);
        RuleFor(r => r.ResidentialAddressData.PostalCode).NotEmpty().MaximumLength(20).When(r => r.ResidentialAddressData != null);
        RuleFor(r => r.HasNewCriminalRecordCharge).NotNull()
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update);
        RuleFor(r => r.HasNewMentalHealthCondition).NotNull()
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update);

    }
}




