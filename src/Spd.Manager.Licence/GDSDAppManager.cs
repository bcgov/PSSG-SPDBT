using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Licence;
internal class GDSDAppManager :
        LicenceAppManagerBase,
        IRequestHandler<GDSDTeamLicenceApplicationQuery, GDSDTeamLicenceAppResponse>,
        IRequestHandler<GDSDTeamLicenceAppUpsertCommand, GDSDAppCommandResponse>,
        IRequestHandler<GDSDTeamLicenceAppSubmitCommand, GDSDAppCommandResponse>,
        IRequestHandler<GDSDTeamLicenceAppAnonymousSubmitCommand, GDSDAppCommandResponse>,
        IGDSDAppManager
{
    private readonly IContactRepository _contactRepository;

    public GDSDAppManager(
        ILicenceRepository licenceRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IContactRepository contactRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        ILicAppRepository licAppRepository)
        : base(mapper,
            documentUrlRepository,
            feeRepository,
            licenceRepository,
            mainFileStorageService,
            transientFileStorageService,
            licAppRepository)
    {
        _contactRepository = contactRepository;
    }

    //anonymous
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppAnonymousSubmitCommand command, CancellationToken ct)
    {
        return null;
    }

    //auth
    public Task<GDSDTeamLicenceAppResponse> Handle(GDSDTeamLicenceApplicationQuery query, CancellationToken ct)
    {
        return null;
    }
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppUpsertCommand command, CancellationToken ct)
    {
        return null;
    }
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppSubmitCommand command, CancellationToken ct)
    {
        return null;
    }

}
