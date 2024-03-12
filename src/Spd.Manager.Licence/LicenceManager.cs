using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;

internal class LicenceManager :
        IRequestHandler<LicenceQuery, IEnumerable<LicenceResponse>>,
        IRequestHandler<LicencePhotoQuery, FileResponse>,
        ILicenceManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly ILogger<ILicenceManager> _logger;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public LicenceManager(
        ILicenceRepository licenceRepository,
        IDocumentRepository documentRepository,
        ILogger<ILicenceManager> logger,
        IFileStorageService fileStorageService,
        IMapper mapper)
    {
        _licenceRepository = licenceRepository;
        _documentRepository = documentRepository;
        _mapper = mapper;
        _logger = logger;
        _fileStorageService = fileStorageService;
    }

    public async Task<IEnumerable<LicenceResponse>> Handle(LicenceQuery query, CancellationToken cancellationToken)
    {
        var response = await _licenceRepository.QueryAsync(
            new LicenceQry
            {
                LicenceNumber = query.LicenceNumber,
                AccessCode = query.AccessCode
            }, cancellationToken);

        if (!response.Items.Any())
        {
            _logger.LogDebug("No licence found.");
            return null;
        }

        List<LicenceResponse> result = _mapper.Map<List<LicenceResponse>>(response.Items);
        return result;
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

        DocumentQry qry = new DocumentQry
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
}
