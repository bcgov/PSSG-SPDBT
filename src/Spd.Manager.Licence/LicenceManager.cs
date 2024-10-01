using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;

internal class LicenceManager :
        IRequestHandler<LicenceByIdQuery, LicenceResponse>,
        IRequestHandler<LicenceQuery, LicenceResponse>,
        IRequestHandler<LicencePhotoQuery, FileResponse>,
        IRequestHandler<LicenceListQuery, IEnumerable<LicenceBasicResponse>>,
        ILicenceManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly IIncidentRepository _incidentRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly ILogger<ILicenceManager> _logger;
    private readonly IMainFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public LicenceManager(
        ILicenceRepository licenceRepository,
        IDocumentRepository documentRepository,
        ILogger<ILicenceManager> logger,
        IMainFileStorageService fileStorageService,
        IIncidentRepository incidentRepository,
        IMapper mapper)
    {
        _licenceRepository = licenceRepository;
        _documentRepository = documentRepository;
        _mapper = mapper;
        _logger = logger;
        _fileStorageService = fileStorageService;
        _incidentRepository = incidentRepository;
    }

    public async Task<LicenceResponse> Handle(LicenceByIdQuery query, CancellationToken cancellationToken)
    {
        var response = await _licenceRepository.GetAsync(query.LicenceId, cancellationToken);
        LicenceResponse lic = _mapper.Map<LicenceResponse>(response);

        await GetRationalDocumentsInfoAsync(lic, cancellationToken);
        await GetDogRestraintsDocumentsInfoAsync(lic, cancellationToken);

        return lic;
    }

    public async Task<LicenceResponse?> Handle(LicenceQuery query, CancellationToken cancellationToken)
    {
        LicenceListResp qryResponse = await _licenceRepository.QueryAsync(
                new LicenceQry
                {
                    LicenceNumber = query.LicenceNumber,
                    AccessCode = query.AccessCode,
                    IncludeInactive = true,
                }, cancellationToken);

        if (!qryResponse.Items.Any())
        {
            _logger.LogDebug("No licence found.");
            return null;
        }
        LicenceResp response = qryResponse.Items.OrderByDescending(i => i.CreatedOn).First();
        LicenceResponse lic = _mapper.Map<LicenceResponse>(response);
        await GetRationalDocumentsInfoAsync(lic, cancellationToken);
        await GetDogRestraintsDocumentsInfoAsync(lic, cancellationToken);

        return lic;
    }

    public async Task<IEnumerable<LicenceBasicResponse>> Handle(LicenceListQuery query, CancellationToken cancellationToken)
    {
        if (query.ApplicantId == null && query.BizId == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Applicant and Biz Id cannot both are null");
        if (query.ApplicantId != null && query.BizId != null)
            throw new ApiException(HttpStatusCode.BadRequest, "Applicant and Biz Id cannot both have value.");

        var response = await _licenceRepository.QueryAsync(
            new LicenceQry
            {
                ContactId = query.ApplicantId,
                AccountId = query.BizId,
                IncludeInactive = true
            }, cancellationToken);

        if (!response.Items.Any())
        {
            _logger.LogDebug("No licence found.");
            return Array.Empty<LicenceResponse>();
        }

        //only return expired and active ones
        return _mapper.Map<IEnumerable<LicenceBasicResponse>>(response.Items.Where(r => r.LicenceStatusCode == LicenceStatusEnum.Active || r.LicenceStatusCode == LicenceStatusEnum.Expired));
    }

    public async Task<FileResponse?> Handle(LicencePhotoQuery query, CancellationToken cancellationToken)
    {
        //find contact id through licenceId
        LicenceListResp lic = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = query.LicenceId }, cancellationToken);
        Guid? applicantId = lic.Items.FirstOrDefault()?.LicenceHolderId;
        if (applicantId == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "cannot find the licence holder.");
        }

        DocumentQry qry = new()
        {
            ApplicantId = applicantId,
            FileType = Enum.Parse<DocumentTypeEnum>(DocumentTypeEnum.Photograph.ToString()),
        };
        DocumentListResp docList = await _documentRepository.QueryAsync(qry, cancellationToken);
        if (docList == null || !docList.Items.Any())
            return new FileResponse();
        var docUrl = docList.Items.OrderByDescending(f => f.UploadedDateTime).FirstOrDefault();

        if (docUrl != null)
        {
            try
            {
                FileQueryResult fileResult = (FileQueryResult)await _fileStorageService.HandleQuery(
                    new FileQuery { Key = docUrl.DocumentUrlId.ToString(), Folder = docUrl.Folder },
                    cancellationToken);
                return new FileResponse
                {
                    Content = fileResult.File.Content,
                    ContentType = fileResult.File.ContentType,
                    FileName = fileResult.File.FileName
                };
            }
            catch
            {
                //todo: add more logging
                return new FileResponse(); //error in S3, probably cannot find the file
            }
        }
        return new FileResponse();
    }

    private async Task GetRationalDocumentsInfoAsync(LicenceResponse lic, CancellationToken cancellationToken)
    {
        if (lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit || lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit)
        {
            DocumentListResp? docResp = null;
            if (lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit)
                docResp = await _documentRepository.QueryAsync(
                        new DocumentQry() { LicenceId = lic.LicenceId, FileType = DocumentTypeEnum.ArmouredVehicleRationale },
                        cancellationToken);
            if (lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit)
                docResp = await _documentRepository.QueryAsync(
                    new DocumentQry() { LicenceId = lic.LicenceId, FileType = DocumentTypeEnum.BodyArmourRationale },
                    cancellationToken);
            lic.RationalDocumentInfos = _mapper.Map<IEnumerable<Document>>(docResp?.Items);
        }
    }

    private async Task GetDogRestraintsDocumentsInfoAsync(LicenceResponse lic, CancellationToken cancellationToken)
    {
        if (lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.SecurityBusinessLicence || lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence)
        {
            if (lic.UseDogs || lic.IsDogsPurposeDetectionDrugs || lic.IsDogsPurposeDetectionExplosives || lic.IsDogsPurposeProtection)
            {
                //get dog document expired date
                DocumentListResp docList = await _documentRepository.QueryAsync(
                        new DocumentQry()
                        {
                            ApplicantId = lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence ? lic.LicenceHolderId : null,
                            AccountId = lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.SecurityBusinessLicence ? lic.LicenceHolderId : null,
                            FileType = DocumentTypeEnum.DogCertificate
                        },
                        cancellationToken);
                lic.DogDocumentInfos = _mapper.Map<IEnumerable<Document>>(docList.Items);
            }
        }

        if (lic.WorkerLicenceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence && lic.CarryAndUseRestraints)
        {
            //get restraints document expired date
            DocumentListResp docList = await _documentRepository.QueryAsync(
                new DocumentQry()
                {
                    ApplicantId = lic.LicenceHolderId,
                    MultiFileTypes = new[] { DocumentTypeEnum.ASTCertificate, DocumentTypeEnum.UseForceEmployerLetter, DocumentTypeEnum.UseForceEmployerLetterASTEquivalent }
                },
                cancellationToken);
            lic.RestraintsDocumentInfos = _mapper.Map<IEnumerable<Document>>(docList.Items);
        }
    }
}
