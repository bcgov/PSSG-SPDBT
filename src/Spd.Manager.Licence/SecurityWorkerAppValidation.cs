using FluentValidation;
using Microsoft.Extensions.Configuration;
using Spd.Manager.Shared;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;

public class WorkerLicenceAppSubmitRequestValidator : PersonalLicenceAppBaseValidator<WorkerLicenceAppSubmitRequest>
{
    public WorkerLicenceAppSubmitRequestValidator(IConfiguration configuration)
    {
        RuleFor(r => r.LicenceAppId).NotEmpty();
        //RuleFor(r => r.PoliceOfficerDocument).NotEmpty().When(r => r.IsPoliceOrPeaceOfficer == true);
        //RuleFor(r => r.PoliceOfficerDocument.LicenceDocumentTypeCode)
        //    .Must(c => c == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict)
        //    .When(r => r.IsPoliceOrPeaceOfficer != null && r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerDocument != null);

        ////mental health
        //RuleFor(r => r.MentalHealthDocument).NotEmpty().When(r => r.IsTreatedForMHC == true);
        //RuleFor(r => r.MentalHealthDocument.LicenceDocumentTypeCode)
        //    .Must(c => c == LicenceDocumentTypeCode.MentalHealthCondition)
        //    .When(r => r.IsTreatedForMHC == true && r.MentalHealthDocument != null);

        //citizenship
        //RuleFor(r => r.CitizenshipDocument).NotEmpty();
        //RuleFor(r => r.CitizenshipDocument.LicenceDocumentTypeCode)
        //    .Must(c => PersonalLicenceAppManager.WorkProofCodes.Contains(c))
        //    .When(r => r.CitizenshipDocument != null && r.IsCanadianCitizen != null && r.IsCanadianCitizen == false);
        //RuleFor(r => r.CitizenshipDocument.LicenceDocumentTypeCode)
        //    .Must(c => PersonalLicenceAppManager.CitizenshipProofCodes.Contains(c))
        //    .When(r => r.CitizenshipDocument != null && r.IsCanadianCitizen != null && r.IsCanadianCitizen == true);
        //RuleFor(r => r.CitizenshipDocument.ExpiryDate)
        //    .NotEmpty()
        //    .Must(d => d > DateOnly.FromDateTime(DateTime.Now))
        //    .When(r => r.CitizenshipDocument != null && r.IsCanadianCitizen == false && (r.CitizenshipDocument.LicenceDocumentTypeCode == LicenceDocumentTypeCode.WorkPermit || r.CitizenshipDocument.LicenceDocumentTypeCode == LicenceDocumentTypeCode.StudyPermit));

        ////additional gov id
        //RuleFor(r => r.AdditionalGovIdDocument)
        //    .NotEmpty()
        //    .When(r => r.CitizenshipDocument != null && (r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.CanadianPassport && r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.PermanentResidentCard));
        //RuleFor(r => r.AdditionalGovIdDocument)
        //    .Must(c => PersonalLicenceAppManager.GetDocumentType1Enum(c.LicenceDocumentTypeCode) == DocumentTypeEnum.AdditionalGovIdDocument)
        //    .When(r => r.AdditionalGovIdDocument != null && r.CitizenshipDocument != null && (r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.CanadianPassport && r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.PermanentResidentCard));

        //fingerprint
        //RuleFor(r => r.FingerprintProofDocument).NotEmpty();
        //RuleFor(r => r.FingerprintProofDocument.LicenceDocumentTypeCode)
        //    .Must(c => c == LicenceDocumentTypeCode.ProofOfFingerprint)
        //    .When(r => r.FingerprintProofDocument != null);

        //photo
        //RuleFor(r => r.IdPhotoDocument).NotEmpty().When(r => r.UseBcServicesCardPhoto != null && r.UseBcServicesCardPhoto == false);
        //RuleFor(r => r.IdPhotoDocument.LicenceDocumentTypeCode)
        //    .Must(c => c == LicenceDocumentTypeCode.PhotoOfYourself)
        //    .When(r => r.UseBcServicesCardPhoto == false && r.IdPhotoDocument != null);

        //category
        //RuleFor(r => r.CategoryData).NotEmpty().Must(d => d.Count() > 0 && d.Count() < 7);
        //var invalidCategoryMatrix = configuration.GetSection("InvalidWorkerLicenceCategoryMatrix").Get<Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>>();
        //if (invalidCategoryMatrix == null)
        //    throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "missing configuration for invalid worker licence category matrix");

        //RuleForEach(r => r.CategoryData).SetValidator(new WorkerLicenceAppCategoryDataValidator());
        //RuleFor(r => r.CategoryData).Must(c =>
        //{
        //    foreach (var catData in c)
        //    {
        //        var invalidCodes = invalidCategoryMatrix.GetValueOrDefault(catData.WorkerCategoryTypeCode);
        //        if (invalidCodes != null)
        //        {
        //            foreach (var cat in c)
        //            {
        //                if (cat.WorkerCategoryTypeCode != catData.WorkerCategoryTypeCode)
        //                {
        //                    if (invalidCodes.Contains(cat.WorkerCategoryTypeCode))
        //                    {
        //                        return false;
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    return true;
        //})
        //.When(c => c.CategoryData != null);
    }
}
//public class WorkerLicenceAppCategoryDataValidator : AbstractValidator<WorkerLicenceAppCategoryData>
//{
//    public WorkerLicenceAppCategoryDataValidator()
//    {
//        //RuleFor(c => c.Documents).Must(d => d.Count() >= 1
//        //    && d.Any(doc =>
//        //        PersonalLicenceAppManager.GetDocumentType1Enum(doc.LicenceDocumentTypeCode) == Resource.Applicants.Document.DocumentTypeEnum.SecurityGuard
//        //        && doc.DocumentResponses.Count() > 0
//        //        && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityGuard);

//        //RuleFor(c => c.Documents).Must(d => d == null || d.Count() == 0)
//        //    .When(c => PersonalLicenceAppManager.WorkerCategoryTypeCode_NoNeedDocument.Contains(c.WorkerCategoryTypeCode));

//        //RuleFor(c => c.Documents).Must(d => d.Count() == 1
//        //    && d.Any(doc => (doc.LicenceDocumentTypeCode == LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.ArmouredCarGuard);

//        //RuleFor(c => c.Documents).Must(d => d.Count() == 1
//        //    && d.Any(doc =>
//        //        PersonalLicenceAppManager.GetDocumentType1Enum(doc.LicenceDocumentTypeCode) == DocumentTypeEnum.SecurityAlarmInstaller
//        //        && doc.DocumentResponses.Count() > 0
//        //        && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityAlarmInstaller);

//        //RuleFor(c => c.Documents).Must(d => d.Count() == 1
//        //    && d.Any(doc =>
//        //        PersonalLicenceAppManager.GetDocumentType1Enum(doc.LicenceDocumentTypeCode) == DocumentTypeEnum.Locksmith
//        //        && doc.DocumentResponses.Count() > 0
//        //        && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.Locksmith);

//        //RuleFor(c => c.Documents).Must(d => d.Count() == 1
//        //    && d.Any(
//        //        doc => PersonalLicenceAppManager.GetDocumentType1Enum(doc.LicenceDocumentTypeCode) == DocumentTypeEnum.PrivateInvestigatorUnderSupervision
//        //        && doc.DocumentResponses.Count() > 0
//        //        && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);

//        //RuleFor(c => c.Documents).Must(d => d.Count() == 2
//        //    && d.Any(doc =>
//        //        PersonalLicenceAppManager.GetDocumentType1Enum(doc.LicenceDocumentTypeCode) == DocumentTypeEnum.PrivateInvestigator
//        //        && doc.DocumentResponses.Count() > 0
//        //        && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.PrivateInvestigator);

//        //RuleFor(c => c.Documents).Must(d => d.Count() == 2
//        //    && d.Any(doc =>
//        //        PersonalLicenceAppManager.GetDocumentType1Enum(doc.LicenceDocumentTypeCode) == DocumentTypeEnum.FireInvestigator
//        //        && doc.DocumentResponses.Count() > 0
//        //        && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.FireInvestigator);

//        //RuleFor(c => c.Documents).Must(d => d.Count() == 2
//        //    && d.Any(doc =>
//        //        PersonalLicenceAppManager.GetDocumentType1Enum(doc.LicenceDocumentTypeCode) == DocumentTypeEnum.SecurityConsultant
//        //        && doc.DocumentResponses.Count() > 0
//        //        && doc.DocumentResponses.Count() <= 10))
//        //    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityConsultant);
//    }
//}

//public class AnonymousWorkerLicenceSubmitCommandValidator : AbstractValidator<AnonymousWorkerLicenceSubmitCommand>
//{
//    public AnonymousWorkerLicenceSubmitCommandValidator(IValidator<WorkerLicenceAppAnonymousSubmitRequest> anonymousWslSubmitValidator)
//    {
//        RuleFor(r => r.LicenceAnonymousRequest)
//            .Custom((request, context) =>
//            {
//                var result = anonymousWslSubmitValidator.Validate(request);
//                if (!(result.IsValid))
//                {
//                    foreach (var error in result.Errors)
//                    {
//                        context.AddFailure(error);
//                    }
//                }
//            });

//        RuleFor(r => r.UploadFileRequests)
//            .Must(r => r.Any(f => f.FileTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
//            .When(r => r.LicenceAnonymousRequest.IsPoliceOrPeaceOfficer != null && r.LicenceAnonymousRequest.IsPoliceOrPeaceOfficer.Value)
//            .WithMessage("Missing PoliceBackgroundLetterOfNoConflict file.");

//        RuleFor(r => r.UploadFileRequests)
//            .Must(r => r.Any(f => f.FileTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
//            .When(r => r.LicenceAnonymousRequest.IsTreatedForMHC != null && r.LicenceAnonymousRequest.IsTreatedForMHC.Value)
//            .WithMessage("Missing MentalHealthCondition file.");

//        RuleFor(r => r.UploadFileRequests)
//            .Must(r => r.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains(f.FileTypeCode)))
//            .When(r => r.LicenceAnonymousRequest.IsCanadianCitizen != null && !r.LicenceAnonymousRequest.IsCanadianCitizen.Value)
//            .WithMessage("Missing proven file because you are not canadian.");

//        RuleFor(r => r.UploadFileRequests)
//           .Must(r => r.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.FileTypeCode)))
//           .When(r => r.LicenceAnonymousRequest.IsCanadianCitizen != null && r.LicenceAnonymousRequest.IsCanadianCitizen.Value)
//           .WithMessage("Missing citizen proof file because you are canadian.");

//        RuleFor(r => r.UploadFileRequests)
//            .Must(r => r.Any(f => f.FileTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
//            .WithMessage("Missing ProofOfFingerprint file.");

//        RuleFor(r => r.UploadFileRequests)
//          .Must(r => r.Any(f => f.FileTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
//          .When(r => r.LicenceAnonymousRequest.UseBcServicesCardPhoto != null && !r.LicenceAnonymousRequest.UseBcServicesCardPhoto.Value)
//          .WithMessage("Missing PhotoOfYourself file.");

//        RuleFor(r => r).Custom((request, context) =>
//        {
//            foreach (WorkerCategoryTypeCode code in request.LicenceAnonymousRequest.CategoryCodes)
//            {
//                if (!LicenceAppDocumentManager.WorkerCategoryTypeCode_NoNeedDocument.Contains(code))
//                {
//                    if (!request.UploadFileRequests.Any(f => Mappings.GetDocumentType1Enum(f.FileTypeCode) == Enum.Parse<DocumentTypeEnum>(code.ToString())))
//                    {
//                        context.AddFailure($"Missing file for {code}");
//                    }
//                }
//            }
//        });
//    }
//}

public class WorkerLicenceAppAnonymousSubmitRequestValidator : PersonalLicenceAppBaseValidator<WorkerLicenceAppAnonymousSubmitRequest>
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
        RuleFor(r => r.OriginalApplicationId).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.New);
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


