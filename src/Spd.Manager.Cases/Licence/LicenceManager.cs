using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Search;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Resource.Applicants.Delegates;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Incident;
using Spd.Resource.Applicants.PortalUser;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases.Licence;
internal class LicenceManager :
        IRequestHandler<WorkerLicenceCreateCommand, WorkerLicenceCreateResponse>,
        ILicenceManager
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IDuplicateCheckEngine _duplicateCheckEngine;
    private readonly IIdentityRepository _identityRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IIncidentRepository _incidentRepository;
    private readonly ILogger<ILicenceManager> _logger;
    private readonly ISearchEngine _searchEngine;

    public LicenceManager(IApplicationRepository applicationRepository,
        IApplicationInviteRepository applicationInviteRepository,
        IOrgRepository orgRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDuplicateCheckEngine duplicateCheckEngine,
        ISearchEngine searchEngine,
        IIdentityRepository identityRepository,
        IDocumentRepository documentUrlRepository,
        IFileStorageService fileStorageService,
        IIncidentRepository incidentRepository,
        IDelegateRepository delegateRepository,
        IPortalUserRepository portalUserRepository,
        ILogger<ILicenceManager> logger)
    {
        _applicationRepository = applicationRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _duplicateCheckEngine = duplicateCheckEngine;
        _identityRepository = identityRepository;
        _documentRepository = documentUrlRepository;
        _fileStorageService = fileStorageService;
        _incidentRepository = incidentRepository;
        _searchEngine = searchEngine;
        _logger = logger;
    }

    public async Task<WorkerLicenceCreateResponse> Handle(WorkerLicenceCreateCommand request, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceCreateCommand={request}");

        return null;
    }
}
