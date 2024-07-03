using FluentValidation;
using Microsoft.Extensions.Configuration;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Document;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;

public class WorkerLicenceAppUpsertRequestValidator : PersonalLicenceAppBaseValidator<WorkerLicenceAppUpsertRequest>
{
    public WorkerLicenceAppUpsertRequestValidator(IConfiguration configuration)
    {
        RuleFor(r => r.ApplicantId).NotEqual(Guid.Empty);
        //category
        RuleFor(r => r.CategoryCodes).NotEmpty().Must(d => d.Any() && d.Count() < 7);
        var invalidCategoryMatrix = configuration.GetSection("InvalidWorkerLicenceCategoryMatrix").Get<Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>>();
        if (invalidCategoryMatrix == null)
            throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "missing configuration for invalid worker licence category matrix");

        RuleFor(r => r.CategoryCodes).Must(c =>
        {
            foreach (var code in c)
            {
                var invalidCodes = invalidCategoryMatrix.GetValueOrDefault(code);
                if (invalidCodes != null)
                {
                    foreach (var cat in c)
                    {
                        if (cat != code)
                        {
                            if (invalidCodes.Contains(cat))
                            {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        })
        .When(c => c.CategoryCodes != null)
        .WithMessage("Some category cannot be in the same licence request.");

        RuleFor(r => r.DocumentInfos)
            .Must(r => r.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
            .When(r => r.IsCanadianCitizen != null && !r.IsCanadianCitizen.Value)
            .WithMessage("Missing proven file because you are not canadian.");

        RuleFor(r => r.DocumentInfos)
           .Must(r => r.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
           .When(r => r.IsCanadianCitizen != null && r.IsCanadianCitizen.Value)
           .WithMessage("Missing citizen proof file because you are canadian.");

        RuleFor(r => r.DocumentInfos)
            .Must(r => r.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
            .WithMessage("Missing ProofOfFingerprint file.");

        RuleFor(r => r).Custom((request, context) =>
        {
            foreach (WorkerCategoryTypeCode code in request.CategoryCodes)
            {
                if (!LicenceAppDocumentManager.WorkerCategoryTypeCode_NoNeedDocument.Contains(code))
                {
                    if (!request.DocumentInfos.Any(f => Mappings.GetDocumentType2Enum((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode) == Enum.Parse<DocumentTypeEnum>(code.ToString())))
                    {
                        context.AddFailure($"Missing file for {code}");
                    }
                }
            }
        });

        RuleFor(c => c.DocumentInfos).Must(d => d.Count() >= 1
            && d.Count(doc =>
                Mappings.GetDocumentType2Enum((LicenceDocumentTypeCode)doc.LicenceDocumentTypeCode) == DocumentTypeEnum.SecurityGuard) <= 10)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityGuard));

        RuleFor(c => c.DocumentInfos)
            .Must(d => d.Count(doc => doc.LicenceDocumentTypeCode == LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate) >= 1)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard));

        RuleFor(c => c.DocumentInfos)
            .Must(d => d.Count(doc => Mappings.GetDocumentType2Enum(doc.LicenceDocumentTypeCode.Value) == DocumentTypeEnum.SecurityAlarmInstaller) >= 1)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityAlarmInstaller));

        RuleFor(c => c.DocumentInfos)
            .Must(d => d.Count(doc => Mappings.GetDocumentType2Enum(doc.LicenceDocumentTypeCode.Value) == DocumentTypeEnum.Locksmith) >= 1)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.Locksmith));

        RuleFor(c => c.DocumentInfos)
            .Must(d => d.Count(doc => Mappings.GetDocumentType2Enum(doc.LicenceDocumentTypeCode.Value) == DocumentTypeEnum.PrivateInvestigatorUnderSupervision) >= 1)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision));

        RuleFor(c => c.DocumentInfos)
            .Must(d => d.Count(doc => Mappings.GetDocumentType2Enum(doc.LicenceDocumentTypeCode.Value) == DocumentTypeEnum.PrivateInvestigator) >= 2)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.PrivateInvestigator));

        RuleFor(c => c.DocumentInfos)
            .Must(d => d.Count(doc => Mappings.GetDocumentType2Enum(doc.LicenceDocumentTypeCode.Value) == DocumentTypeEnum.FireInvestigator) >= 2)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.FireInvestigator));

        RuleFor(c => c.DocumentInfos)
            .Must(d => d.Count(doc => Mappings.GetDocumentType2Enum(doc.LicenceDocumentTypeCode.Value) == DocumentTypeEnum.SecurityConsultant) >= 2)
            .When(c => c.CategoryCodes.Contains(WorkerCategoryTypeCode.SecurityConsultant));
    }
}

public class WorkerLicenceAppAnonymousSubmitRequestValidator : PersonalLicenceAppBaseValidator<WorkerLicenceAppSubmitRequest>
{
    public WorkerLicenceAppAnonymousSubmitRequestValidator(IConfiguration configuration)
    {
        //category
        RuleFor(r => r.CategoryCodes).NotEmpty().Must(d => d.Any() && d.Count() < 7);
        var invalidCategoryMatrix = configuration.GetSection("InvalidWorkerLicenceCategoryMatrix").Get<Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>>();
        if (invalidCategoryMatrix == null)
            throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "missing configuration for invalid worker licence category matrix");

        RuleFor(r => r.CategoryCodes).Must(c =>
        {
            foreach (var code in c)
            {
                var invalidCodes = invalidCategoryMatrix.GetValueOrDefault(code);
                if (invalidCodes != null)
                {
                    foreach (var cat in c)
                    {
                        if (cat != code)
                        {
                            if (invalidCodes.Contains(cat))
                            {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        })
        .When(c => c.CategoryCodes != null)
        .WithMessage("Some category cannot be in the same licence request.");

        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotEmpty();
        RuleFor(r => r.PoliceOfficerRoleCode).NotEmpty().When(r => r.IsPoliceOrPeaceOfficer == true);
        RuleFor(r => r.OtherOfficerRole).NotEmpty()
            .When(r => r.IsPoliceOrPeaceOfficer != null && r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerRoleCode != null && r.PoliceOfficerRoleCode == PoliceOfficerRoleCode.Other);
        RuleFor(r => r.IsTreatedForMHC).NotEmpty();
        RuleFor(r => r.LatestApplicationId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.OriginalLicenceId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
        RuleFor(r => r.HasNewMentalHealthCondition).NotNull()
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update);
        RuleFor(r => r.CriminalChargeDescription)
            .NotEmpty()
            .MaximumLength(1000)
            .When(r => r.HasNewCriminalRecordCharge == true && r.ApplicationTypeCode == ApplicationTypeCode.Update);
        RuleFor(r => r.AgreeToCompleteAndAccurate).NotEmpty().Equal(true).When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
    }
}


