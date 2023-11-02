using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager :
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceUpsertResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceResponse>,
        IRequestHandler<CreateLicenceAppFileCommand, IEnumerable<LicenceAppFileCreateResponse>>,
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

    public async Task<WorkerLicenceUpsertResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceUpsertCommand={cmd}");
        SaveLicenceApplicationCmd saveCmd = _mapper.Map<SaveLicenceApplicationCmd>(cmd.LicenceUpsertRequest);
        saveCmd.BcscGuid = cmd.BcscGuid;
        var response = await _licenceAppRepository.SaveLicenceApplicationAsync(saveCmd, ct);

        await RemoveDeletedFiles(cmd.LicenceUpsertRequest, ct);
        return _mapper.Map<WorkerLicenceUpsertResponse>(response);
    }

    public async Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct)
    {
        var response = await _licenceAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, ct);
        WorkerLicenceResponse result = _mapper.Map<WorkerLicenceResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), ct);
        var letterOfNoConflicts = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.LetterOfNoConflict).ToList();
        if (letterOfNoConflicts.Any())
        {
            result.PoliceOfficerDocument = new PoliceOfficerDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
                ExistingDocuments =
                    letterOfNoConflicts.Select(d => new ExistingDocument()
                    {
                        DocumentUrlId = d.DocumentUrlId,
                        UploadedDateTime = d.UploadedDateTime
                    }).ToList()
            };
        }
        var mentalHealths = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.MentalHealthConditionForm).ToList();
        if (mentalHealths.Any())
        {
            result.MentalHealthDocument = new MentalHealthDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.MentalHealthCondition,
                ExistingDocuments =
                    letterOfNoConflicts.Select(d => new ExistingDocument()
                    {
                        DocumentUrlId = d.DocumentUrlId,
                        UploadedDateTime = d.UploadedDateTime
                    }).ToList()
            };
        }
        //todo: add more doc
        return result;
    }

    private async Task RemoveDeletedFiles(WorkerLicenceApplicationUpsertRequest request, CancellationToken ct)
    {
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(request.LicenceApplicationId), ct);
        List<Guid> allValidDocGuids = new List<Guid>();
        if (request.AdditionalGovIdDocument?.ExistingDocuments.Count > 0)
        {
            allValidDocGuids.AddRange(request.AdditionalGovIdDocument.ExistingDocuments.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.BornInCanadaDocument?.ExistingDocuments.Count > 0)
        {
            allValidDocGuids.AddRange(request.BornInCanadaDocument.ExistingDocuments.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.FingerPrintProofDocument?.ExistingDocuments.Count > 0)
        {
            allValidDocGuids.AddRange(request.FingerPrintProofDocument.ExistingDocuments.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.IdPhotoDocument?.ExistingDocuments.Count > 0)
        {
            allValidDocGuids.AddRange(request.IdPhotoDocument.ExistingDocuments.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.MentalHealthDocument?.ExistingDocuments.Count > 0)
        {
            allValidDocGuids.AddRange(request.MentalHealthDocument.ExistingDocuments.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.PoliceOfficerDocument?.ExistingDocuments.Count > 0)
        {
            allValidDocGuids.AddRange(request.PoliceOfficerDocument.ExistingDocuments.Select(d => d.DocumentUrlId).ToArray());
        }
        foreach (WorkerLicenceAppCategoryData category in request.CategoryData)
        {
            foreach (Document d in category.Documents)
            {
                allValidDocGuids.AddRange(d.ExistingDocuments.Select(d => d.DocumentUrlId).ToArray());
            }
        }
        var shouldDeleteDocs = existingDocs.Items.Where(i => !allValidDocGuids.Contains(i.DocumentUrlId)).ToList();
        foreach (DocumentResp doc in shouldDeleteDocs)
        {
            await _documentRepository.ManageAsync(new RemoveDocumentCmd(doc.DocumentUrlId), ct);
        }
    }

}
