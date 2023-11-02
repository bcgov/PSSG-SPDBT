using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager :
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceResponse>,
        IRequestHandler<CreateLicenceAppDocumentCommand, IEnumerable<LicenceAppDocumentResponse>>,
        ILicenceManager
{
    private readonly ILicenceApplicationRepository _licenceAppRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IDuplicateCheckEngine _duplicateCheckEngine;
    private readonly IDocumentRepository _documentRepository;
    private readonly ILogger<ILicenceManager> _logger;

    public LicenceManager(ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDuplicateCheckEngine duplicateCheckEngine,
        IDocumentRepository documentUrlRepository,
        ILogger<ILicenceManager> logger)
    {
        _licenceAppRepository = licenceAppRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _duplicateCheckEngine = duplicateCheckEngine;
        _documentRepository = documentUrlRepository;
        _logger = logger;
    }

    public async Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceUpsertCommand={cmd}");
        SaveLicenceApplicationCmd saveCmd = _mapper.Map<SaveLicenceApplicationCmd>(cmd.LicenceUpsertRequest);
        saveCmd.BcscGuid = cmd.BcscGuid;
        var response = await _licenceAppRepository.SaveLicenceApplicationAsync(saveCmd, ct);

        await RemoveDeletedFiles(cmd.LicenceUpsertRequest, ct);
        return _mapper.Map<WorkerLicenceAppUpsertResponse>(response);
    }

    public async Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct)
    {
        var response = await _licenceAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, ct);
        WorkerLicenceResponse result = _mapper.Map<WorkerLicenceResponse>(response);
        await GetDocuments(query.LicenceApplicationId, result, ct);
        return result;
    }

    private async Task RemoveDeletedFiles(WorkerLicenceAppUpsertRequest request, CancellationToken ct)
    {
        if (request.LicenceAppId == null) { return; }
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(request.LicenceAppId), ct);
        List<Guid> allValidDocGuids = new List<Guid>();
        if (request.AdditionalGovIdDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.AdditionalGovIdDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.BornInCanadaDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.BornInCanadaDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.FingerPrintProofDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.FingerPrintProofDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.IdPhotoDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.IdPhotoDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.MentalHealthDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.MentalHealthDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.PoliceOfficerDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.PoliceOfficerDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        foreach (WorkerLicenceAppCategoryData category in request.CategoryData)
        {
            foreach (Document d in category.Documents)
            {
                allValidDocGuids.AddRange(d.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
            }
        }
        var shouldDeleteDocs = existingDocs.Items.Where(i => !allValidDocGuids.Contains(i.DocumentUrlId)).ToList();
        foreach (DocumentResp doc in shouldDeleteDocs)
        {
            await _documentRepository.ManageAsync(new RemoveDocumentCmd(doc.DocumentUrlId), ct);
        }
    }

    private async Task GetDocuments(Guid LicenceAppId, WorkerLicenceResponse result, CancellationToken ct)
    {
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(LicenceAppId), ct);
        var letterOfNoConflicts = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.LetterOfNoConflict).ToList();
        if (letterOfNoConflicts.Any())
        {
            result.PoliceOfficerDocument = new PoliceOfficerDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(letterOfNoConflicts)
            };
        }
        var mentalHealths = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.MentalHealthConditionForm).ToList();
        if (mentalHealths.Any())
        {
            result.MentalHealthDocument = new MentalHealthDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.MentalHealthCondition,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(mentalHealths)
            };
        }
        var fingerprints = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.FingerprintsPkg).ToList();
        if (fingerprints.Any())
        {
            result.FingerPrintProofDocument = new FingerprintProofDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(fingerprints)
            };
        }

        var bornInCanadas = existingDocs.Items.Where(d =>
            d.DocumentType == DocumentTypeEnum.BirthCertificate ||
            d.DocumentType == DocumentTypeEnum.Passport ||
            d.DocumentType == DocumentTypeEnum.CanadianNativeStatusCard).ToList();
        //todo: add more documentType condition here when we get the DocumentTypeEnum sorted out.
        if (bornInCanadas.Any())
        {
            result.BornInCanadaDocument = new BornInCanadaDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)bornInCanadas.First().DocumentType),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(bornInCanadas)
            };
        }

        var govIdDocs = existingDocs.Items.Where(d =>
            d.DocumentType == DocumentTypeEnum.DriverLicense ||
            d.DocumentType == DocumentTypeEnum.CanadianFirearmsLicense ||
            d.DocumentType == DocumentTypeEnum.BCServicesCard ||
            d.DocumentType == DocumentTypeEnum.CanadianNativeStatusCard ||
            d.DocumentType == DocumentTypeEnum.GovtIssuedPhotoID).ToList();
        if (govIdDocs.Any())
        {
            result.AdditionalGovIdDocument = new AdditionalGovIdDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)govIdDocs.First().DocumentType),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(govIdDocs)
            };
        }

        var idPhoto = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.Photograph).ToList();
        if (idPhoto.Any())
        {
            result.IdPhotoDocument = new IdPhotoDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(idPhoto)
            };
        }
    }
}
