using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public class BizLicenceAppSubmitRequestValidator : AbstractValidator<BizLicenceAppSubmitRequest>
{
    public BizLicenceAppSubmitRequestValidator()
    {
        RuleFor(r => r.ExpiredLicenceNumber)
            .NotEmpty()
            .When(r => r.HasExpiredLicence == true);
        RuleFor(r => r.BusinessTypeCode).NotEmpty().IsInEnum();
        RuleFor(r => r.SecurityWorkerInfo.GivenName)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.SecurityWorkerInfo != null);
        RuleFor(r => r.SecurityWorkerInfo.Surname)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.SecurityWorkerInfo != null);
        RuleFor(r => r.SecurityWorkerInfo.MiddleName1)
            .MaximumLength(40)
            .When(r => r.SecurityWorkerInfo != null);
        RuleFor(r => r.SecurityWorkerInfo.MiddleName2)
            .MaximumLength(40)
            .When(r => r.SecurityWorkerInfo != null);
        RuleFor(r => r.SecurityWorkerInfo.PhoneNumber)
            .NotEmpty()
            .MaximumLength(15)
            .When(r => r.SecurityWorkerInfo != null);
        RuleFor(r => r.SecurityWorkerInfo.EmailAddress)
            .NotEmpty()
            .MaximumLength(75)
            .EmailAddress()
            .When(r => r.SecurityWorkerInfo != null);
        RuleFor(r => r)
            .Must(r => r.LegalBusinessName == r.SecurityWorkerInfo.GivenName)
            .When(r => r.SecurityWorkerInfo != null && r.BusinessTypeCode == BusinessTypeCode.NonRegisteredSoleProprietor || r.BusinessTypeCode == BusinessTypeCode.RegisteredSoleProprietor)
            .WithMessage("The name of your business must be your name, as it appears on your security worker licence");
        RuleFor(r => r.PhoneNumber).NotEmpty().MaximumLength(15);
        RuleFor(r => r.EmailAddress).NotEmpty().MaximumLength(75).EmailAddress();
        RuleFor(r => r.DocumentsBranding)
            .NotEmpty()
            .Must(r => r.Count() <= Constants.MaximumNumberOfUserEnteredAliases)
            .WithMessage("No more than 10 documents are allowed for branding");
        RuleFor(r => r.Insurnace)
            .NotEmpty();
        RuleFor(r => r.CategoryCodes)
            .NotEmpty();
        RuleFor(r => r.DocumentsRegistrar)
            .NotEmpty()
            .When(r => r.CategoryCodes.Any(c => c.Equals(WorkerCategoryTypeCode.ArmouredCarGuard)));
        RuleFor(r => r.PrivateInvestigatorInfo.GivenName)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.PrivateInvestigatorInfo != null && r.CategoryCodes.Any(c => c.Equals(WorkerCategoryTypeCode.PrivateInvestigator)));
        RuleFor(r => r.PrivateInvestigatorInfo.Surname)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.PrivateInvestigatorInfo != null && r.CategoryCodes.Any(c => c.Equals(WorkerCategoryTypeCode.PrivateInvestigator)));
        RuleFor(r => r.PrivateInvestigatorInfo.MiddleName1)
            .MaximumLength(40)
            .When(r => r.PrivateInvestigatorInfo != null && r.CategoryCodes.Any(c => c.Equals(WorkerCategoryTypeCode.PrivateInvestigator)));
        RuleFor(r => r.PrivateInvestigatorInfo.MiddleName2)
            .MaximumLength(40)
            .When(r => r.PrivateInvestigatorInfo != null && r.CategoryCodes.Any(c => c.Equals(WorkerCategoryTypeCode.PrivateInvestigator)));
        RuleFor(r => r.PrivateInvestigatorInfo.ManagerLicenceNumber)
            .NotEmpty()
            .MaximumLength(10)
            .When(r => r.PrivateInvestigatorInfo != null && r.CategoryCodes.Any(c => c.Equals(WorkerCategoryTypeCode.PrivateInvestigator)));
        RuleFor(r => r.SecurityDogCertificate)
            .NotEmpty()
            .When(r => r.UseDogs == true);
        RuleFor(r => r.LicenceTermCode)
            .NotEmpty()
            .IsInEnum()
            .Must(r => r == LicenceTermCode.OneYear || r == LicenceTermCode.TwoYears || r == LicenceTermCode.ThreeYears);
        RuleFor(r => r.BusinessManagerInfo.GivenName)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.BusinessManagerInfo != null);
        RuleFor(r => r.BusinessManagerInfo.Surname)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.BusinessManagerInfo != null);
        RuleFor(r => r.BusinessManagerInfo.MiddleName1)
            .MaximumLength(40)
            .When(r => r.BusinessManagerInfo != null);
        RuleFor(r => r.BusinessManagerInfo.MiddleName2)
            .MaximumLength(40)
            .When(r => r.BusinessManagerInfo != null);
        RuleFor(r => r.BusinessManagerInfo.PhoneNumber)
            .NotEmpty()
            .MaximumLength(15)
            .When(r => r.BusinessManagerInfo != null);
        RuleFor(r => r.BusinessManagerInfo.EmailAddress)
            .NotEmpty()
            .MaximumLength(75)
            .EmailAddress()
            .When(r => r.BusinessManagerInfo != null);

        RuleFor(r => r.OtherContactInfo.GivenName)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.OtherContactInfo != null && r.BusinessManagerInfo?.IsBusinessManager == false);
        RuleFor(r => r.OtherContactInfo.Surname)
            .NotEmpty()
            .MaximumLength(40)
            .When(r => r.OtherContactInfo != null && r.BusinessManagerInfo?.IsBusinessManager == false);
        RuleFor(r => r.OtherContactInfo.MiddleName1)
            .MaximumLength(40)
            .When(r => r.OtherContactInfo != null && r.BusinessManagerInfo?.IsBusinessManager == false);
        RuleFor(r => r.OtherContactInfo.MiddleName2)
            .MaximumLength(40)
            .When(r => r.OtherContactInfo != null && r.BusinessManagerInfo?.IsBusinessManager == false);
        RuleFor(r => r.OtherContactInfo.PhoneNumber)
            .NotEmpty()
            .MaximumLength(15)
            .When(r => r.OtherContactInfo != null && r.BusinessManagerInfo?.IsBusinessManager == false);
        RuleFor(r => r.OtherContactInfo.EmailAddress)
            .NotEmpty()
            .MaximumLength(75)
            .EmailAddress()
            .When(r => r.OtherContactInfo != null && r.BusinessManagerInfo?.IsBusinessManager == false);

    }
}
