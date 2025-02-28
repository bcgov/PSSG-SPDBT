using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.DogTrainerApp;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class DogTrainerAppManager :
        LicenceAppManagerBase,
        IRequestHandler<DogTrainerLicenceAppAnonymousSubmitCommand, DogTrainerAppCommandResponse>,
        IRequestHandler<DogTrainerLicenceAppRenewCommand, DogTrainerAppCommandResponse>,
        IRequestHandler<DogTrainerLicenceAppReplaceCommand, DogTrainerAppCommandResponse>,
        IDogTrainerAppManager
{
    private readonly IContactRepository _contactRepository;
    private readonly IDogTrainerAppRepository _dogTrainerAppRepository;

    public DogTrainerAppManager(
        ILicenceRepository licenceRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        IContactRepository contactRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        ILicAppRepository licAppRepository,
        IDogTrainerAppRepository dogTrainerAppRepository)
        : base(mapper,
            documentUrlRepository,
            null,
            licenceRepository,
            mainFileStorageService,
            transientFileStorageService,
            licAppRepository)
    {
        _contactRepository = contactRepository;
        _dogTrainerAppRepository = dogTrainerAppRepository;
    }

    #region anonymous
    public async Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppAnonymousSubmitCommand cmd, CancellationToken ct)
    {
        DogTrainerRequest request = cmd.SubmitRequest;
        //ValidateFilesForNewApp(cmd);

        //save the application
        CreateDogTrainerAppCmd createApp = _mapper.Map<CreateDogTrainerAppCmd>(request);
        var response = await _dogTrainerAppRepository.CreateDogTrainerAppAsync(createApp, ct);
        await UploadNewDocsAsync(request.DocumentRelatedInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, ct);
        await _dogTrainerAppRepository.CommitDogTrainerAppAsync(new CommitDogTrainerAppCmd()
        {
            LicenceAppId = response.LicenceAppId,
            ApplicationStatusCode = Resource.Repository.ApplicationStatusEnum.Submitted
        }, ct);
        return new DogTrainerAppCommandResponse { LicenceAppId = response.LicenceAppId };
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

    private static void ValidateFilesForNewApp(DogTrainerLicenceAppAnonymousSubmitCommand cmd)
    {
        DogTrainerRequest request = cmd.SubmitRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;

        if (request.ServiceTypeCode == ServiceTypeCode.DogTrainerCertification) //both new, renew, replace need photo
        {
            if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "A photo that shows the applicant’s face is required.");
            }
        }

        if (request.ServiceTypeCode == ServiceTypeCode.DogTrainerCertification && request.ApplicationTypeCode == ApplicationTypeCode.New)
        {
            if (!fileInfos.Any(f => LicenceAppDocumentManager.ValidGovIssuedPhotoIdCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "A valid government issued photo identification is required.");
            }

        }

    }
}
