using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.TempFileStorage;
using System.Collections.Immutable;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager
{
    public async Task<IEnumerable<LicenceAppFileCreateResponse>> Handle(CreateLicenceAppFileCommand command, CancellationToken ct)
    {
        DocumentTypeEnum docEnum = GetDocumentTypeEnum(command.Request.LicenceDocumentTypeCode);
        LicenceApplicationResp app = await _licenceAppRepository.GetLicenceApplicationAsync(command.ApplicationId, ct);
        if (app == null)
            throw new ArgumentException("Invalid application Id");

        //mark all existing file type files deleted.
        var docList = await _documentRepository.QueryAsync(new DocumentQry(command.ApplicationId, FileType: docEnum), ct);
        foreach (var doc in docList.Items)
        {
            await _documentRepository.ManageAsync(new RemoveDocumentCmd(doc.DocumentUrlId), ct);
        }

        Guid? contactId = app.ContactId;
        //put file to cache
        IList<DocumentResp> docResps = new List<DocumentResp>();
        foreach (var file in command.Request.Files)
        {
            string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(file), ct);
            SpdTempFile spdTempFile = new()
            {
                TempFileKey = fileKey,
                ContentType = file.ContentType,
                FileName = file.FileName,
                FileSize = file.Length,
            };

            //create bcgov_documenturl and file
            var docResp = await _documentRepository.ManageAsync(new CreateDocumentCmd
            {
                TempFile = spdTempFile,
                ApplicationId = command.ApplicationId,
                DocumentType = docEnum,
                SubmittedByApplicantId = contactId
            }, ct);
            docResps.Add(docResp);
        }

        return _mapper.Map<IEnumerable<LicenceAppFileCreateResponse>>(docResps);
    }

    private DocumentTypeEnum GetDocumentTypeEnum(LicenceDocumentTypeCode licenceDocumentTypeCode)
    {
        var keyExisted = LicenceDocumentDictionary.TryGetValue(licenceDocumentTypeCode, out DocumentTypeEnum docTypeEnum);
        if (!keyExisted)
        {
            throw new ArgumentException("Invalid licenceDocumentTypeCode");
        };
        return docTypeEnum;
    }

    private static readonly ImmutableDictionary<LicenceDocumentTypeCode, DocumentTypeEnum> LicenceDocumentDictionary = new Dictionary<LicenceDocumentTypeCode, DocumentTypeEnum>()
    {
        {LicenceDocumentTypeCode.BcServicesCard, DocumentTypeEnum.BCServicesCard},
        {LicenceDocumentTypeCode.BirthCertificate, DocumentTypeEnum.BirthCertificate},
        {LicenceDocumentTypeCode.CanadianCitizenship, DocumentTypeEnum.CanadianCitizenship},
        {LicenceDocumentTypeCode.CanadianPassport, DocumentTypeEnum.Passport},
        {LicenceDocumentTypeCode.CertificateOfIndianStatus, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.DriverLicense},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthConditionForm},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.PermanentResidenceCard},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.LetterOfNoConflict},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.FingerprintsPkg},
    }.ToImmutableDictionary();

}
