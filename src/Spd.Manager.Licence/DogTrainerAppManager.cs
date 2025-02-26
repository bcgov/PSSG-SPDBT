using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Licence;
internal class DogTrainerAppManager :
        LicenceAppManagerBase,
        IRequestHandler<DogTrainerLicenceAppAnonymousSubmitCommand, DogTrainerAppCommandResponse>,
        IRequestHandler<DogTrainerLicenceAppRenewCommand, DogTrainerAppCommandResponse>,
        IRequestHandler<DogTrainerLicenceAppReplaceCommand, DogTrainerAppCommandResponse>,
        IDogTrainerAppManager
{
    private readonly IContactRepository _contactRepository;

    public DogTrainerAppManager(
        ILicenceRepository licenceRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        IContactRepository contactRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        ILicAppRepository licAppRepository)
        : base(mapper,
            documentUrlRepository,
            null,
            licenceRepository,
            mainFileStorageService,
            transientFileStorageService,
            licAppRepository)
    {
        _contactRepository = contactRepository;
    }

    #region anonymous
    public async Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppAnonymousSubmitCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public async Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppRenewCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public async Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppReplaceCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
    #endregion
}
