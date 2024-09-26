using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Licence;
internal class BizLicenceManager :
        IRequestHandler<BizLicenceReplaceCommand, BizLicenceCommandResponse>,
        IRequestHandler<BizLicenceRenewCommand, BizLicenceCommandResponse>,
        IRequestHandler<BizLicenceUpdateCommand, BizLicenceCommandResponse>,
        IBizLicenceManager
{
    private readonly ILicenceRepository licenceRepository;
    private readonly IMapper mapper;
    private readonly IDocumentRepository documentUrlRepository;
    private readonly ILicenceFeeRepository feeRepository;
    private readonly IMainFileStorageService mainFileStorageService;
    private readonly ITaskRepository taskRepository;
    private readonly IBizRepository bizRepository;

    public BizLicenceManager(
        ILicenceRepository licenceRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        ITaskRepository taskRepository,
        IBizRepository bizRepository)
    {
        this.licenceRepository = licenceRepository;
        this.mapper = mapper;
        this.documentUrlRepository = documentUrlRepository;
        this.feeRepository = feeRepository;
        this.mainFileStorageService = mainFileStorageService;
        this.taskRepository = taskRepository;
        this.bizRepository = bizRepository;
    }

    public async Task<BizLicenceCommandResponse> Handle(BizLicenceReplaceCommand cmd, CancellationToken cancellationToken)
    {
        return null;
    }

    public async Task<BizLicenceCommandResponse> Handle(BizLicenceRenewCommand cmd, CancellationToken cancellationToken)
    {

        return null;
    }

    public async Task<BizLicenceCommandResponse> Handle(BizLicenceUpdateCommand cmd, CancellationToken cancellationToken)
    {
        return null;
    }
}