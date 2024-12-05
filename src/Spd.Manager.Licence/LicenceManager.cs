using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Biz;
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
        IRequestHandler<LicenceListSearch, IEnumerable<LicenceBasicResponse>>,
        ILicenceManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly IIncidentRepository _incidentRepository;
    private readonly IBizRepository _bizRepository;
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
        IBizRepository bizRepository,
        IMapper mapper)
    {
        _licenceRepository = licenceRepository;
        _documentRepository = documentRepository;
        _mapper = mapper;
        _logger = logger;
        _fileStorageService = fileStorageService;
        _incidentRepository = incidentRepository;
        _bizRepository = bizRepository;
    }

    public async Task<LicenceResponse> Handle(LicenceByIdQuery query, CancellationToken cancellationToken)
    {
        var response = await _licenceRepository.GetAsync(query.LicenceId, cancellationToken);
        LicenceResponse lic = _mapper.Map<LicenceResponse>(response);

        await GetSoleProprietorInfoAsync(lic, response, cancellationToken);
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
        await GetSoleProprietorInfoAsync(lic, response, cancellationToken);
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
            return Array.Empty<LicenceBasicResponse>();
        }

        //only return expired and active ones
        return _mapper.Map<IEnumerable<LicenceBasicResponse>>(response.Items.Where(r => r.LicenceStatusCode == LicenceStatusEnum.Active || r.LicenceStatusCode == LicenceStatusEnum.Expired || r.LicenceStatusCode == LicenceStatusEnum.Preview));
    }

    public async Task<FileResponse?> Handle(LicencePhotoQuery query, CancellationToken cancellationToken)
    {
        //find contact id through licenceId
        LicenceResp lic = await _licenceRepository.GetAsync(query.LicenceId, cancellationToken);
        if (lic == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "cannot find the licence.");
        }
        if (lic.PhotoDocumentUrlId == null)
            throw new ApiException(HttpStatusCode.BadRequest, "the licence does not have photo");

        DocumentResp? docUrl = await _documentRepository.GetAsync((Guid)lic.PhotoDocumentUrlId, cancellationToken);
        if (docUrl == null)
            return new FileResponse();

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

    public Task<IEnumerable<LicenceBasicResponse>> Handle(LicenceListSearch search, CancellationToken cancellationToken)
    {
        if (search.ServiceTypeCode == ServiceTypeCode.SecurityWorkerLicence)
        {
            if (string.IsNullOrWhiteSpace(search.LicenceNumber) && string.IsNullOrWhiteSpace(search.FirstName) && string.IsNullOrWhiteSpace(search.LastName))
                throw new ApiException(HttpStatusCode.BadRequest, "Applicant and Biz Id cannot both are null");
        }

        if (search.ServiceTypeCode == ServiceTypeCode.SecurityBusinessLicence)
        {

        }

        //var response = await _licenceRepository.QueryAsync(
        //    new LicenceQry
        //    {
        //        ContactId = query.ApplicantId,
        //        AccountId = query.BizId,
        //        IncludeInactive = true
        //    }, cancellationToken);

        //if (!response.Items.Any())
        //{
        //    _logger.LogDebug("No licence found.");
        //    return Array.Empty<LicenceBasicResponse>();
        //}

        //only return expired and active ones
        return _mapper.Map<IEnumerable<LicenceBasicResponse>>(response.Items.Where(r => r.LicenceStatusCode == LicenceStatusEnum.Active || r.LicenceStatusCode == LicenceStatusEnum.Expired || r.LicenceStatusCode == LicenceStatusEnum.Preview));

    }

    private async Task GetSoleProprietorInfoAsync(LicenceResponse lic, LicenceResp licResp, CancellationToken cancellationToken)
    {
        if (licResp.ServiceTypeCode == ServiceTypeEnum.SecurityWorkerLicence && licResp.SoleProprietorOrgId != null)
        {
            var bizLicences = await _licenceRepository.QueryAsync(
                    new LicenceQry
                    {
                        AccountId = licResp.SoleProprietorOrgId,
                        IncludeInactive = false
                    }, cancellationToken);
            var bizLic = bizLicences.Items.OrderByDescending(i => i.CreatedOn).FirstOrDefault();
            lic.LinkedSoleProprietorLicenceId = bizLic?.LicenceId;
            lic.LinkedSoleProprietorExpiryDate = bizLic?.ExpiryDate;
        }
        if (licResp.ServiceTypeCode == ServiceTypeEnum.SecurityBusinessLicence &&
            (licResp.BizTypeCode == BizTypeEnum.NonRegisteredSoleProprietor || licResp.BizTypeCode == BizTypeEnum.RegisteredSoleProprietor))
        {
            BizResult? biz = await _bizRepository.GetBizAsync((Guid)lic.LicenceHolderId, cancellationToken);
            lic.LinkedSoleProprietorLicenceId = biz?.SoleProprietorSwlContactInfo?.LicenceId;
            lic.LinkedSoleProprietorExpiryDate = biz?.SoleProprietorSwlExpiryDate;
        }
    }

    private async Task GetRationalDocumentsInfoAsync(LicenceResponse lic, CancellationToken cancellationToken)
    {
        if (lic.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit || lic.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit)
        {
            DocumentListResp? docResp = null;
            if (lic.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit)
                docResp = await _documentRepository.QueryAsync(
                        new DocumentQry() { LicenceId = lic.LicenceId, FileType = DocumentTypeEnum.ArmouredVehicleRationale },
                        cancellationToken);
            if (lic.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit)
                docResp = await _documentRepository.QueryAsync(
                    new DocumentQry() { LicenceId = lic.LicenceId, FileType = DocumentTypeEnum.BodyArmourRationale },
                    cancellationToken);
            lic.RationalDocumentInfos = _mapper.Map<IEnumerable<Document>>(docResp?.Items);
        }
    }

    private async Task GetDogRestraintsDocumentsInfoAsync(LicenceResponse lic, CancellationToken cancellationToken)
    {
        if (lic.ServiceTypeCode == ServiceTypeCode.SecurityBusinessLicence || lic.ServiceTypeCode == ServiceTypeCode.SecurityWorkerLicence)
        {
            if (lic.UseDogs || lic.IsDogsPurposeDetectionDrugs || lic.IsDogsPurposeDetectionExplosives || lic.IsDogsPurposeProtection)
            {
                //get dog document expired date
                DocumentListResp docList = await _documentRepository.QueryAsync(
                        new DocumentQry()
                        {
                            ApplicantId = lic.ServiceTypeCode == ServiceTypeCode.SecurityWorkerLicence ? lic.LicenceHolderId : null,
                            AccountId = lic.ServiceTypeCode == ServiceTypeCode.SecurityBusinessLicence ? lic.LicenceHolderId : null,
                            FileType = DocumentTypeEnum.DogCertificate
                        },
                        cancellationToken);
                lic.DogDocumentInfos = _mapper.Map<IEnumerable<Document>>(docList.Items);
            }
        }

        if (lic.ServiceTypeCode == ServiceTypeCode.SecurityWorkerLicence && lic.CarryAndUseRestraints)
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
