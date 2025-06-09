using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.DogBase;
using Spd.Resource.Repository.DogTrainerApp;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.Net;

namespace Spd.Manager.Licence;
internal class MDRARegistrationManager :
        LicenceAppManagerBase,
        IRequestHandler<DogTrainerLicenceAppAnonymousSubmitCommand, DogTrainerAppCommandResponse>,
        IRequestHandler<DogTrainerLicenceAppRenewCommand, DogTrainerAppCommandResponse>,
        IRequestHandler<DogTrainerLicenceAppReplaceCommand, DogTrainerAppCommandResponse>,
        IRequestHandler<GetDogTrainerAppQuery, DogTrainerAppResponse>,
        IDogTrainerAppManager
{
    private readonly IDogTrainerAppRepository _dogTrainerAppRepository;

    public DogTrainerAppManager(
        ILicenceRepository licenceRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
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
        _dogTrainerAppRepository = dogTrainerAppRepository;
    }

    #region anonymous
    public async Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppAnonymousSubmitCommand cmd, CancellationToken ct)
    {
        DogTrainerRequest request = cmd.SubmitRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateDogTrainerAppCmd createApp = _mapper.Map<CreateDogTrainerAppCmd>(request);
        var response = await _dogTrainerAppRepository.CreateDogTrainerAppAsync(createApp, ct);
        await UploadNewDocsAsync(request.DocumentRelatedInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, ct);
        await _dogTrainerAppRepository.CommitAppAsync(new CommitAppCmd()
        {
            LicenceAppId = response.LicenceAppId
        }, ct);
        return new DogTrainerAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<DogTrainerAppResponse> Handle(GetDogTrainerAppQuery request, CancellationToken ct)
    {
        var response = await _dogTrainerAppRepository.GetDogTrainerAppAsync(request.LicenceApplicationId, ct);
        DogTrainerAppResponse result = _mapper.Map<DogTrainerAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(request.LicenceApplicationId), ct);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();
        return result;
    }

    public async Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppRenewCommand cmd, CancellationToken ct)
    {
        LicenceResp? originalLic = await _licenceRepository.GetAsync(cmd.ChangeRequest.OriginalLicenceId, ct);
        if (originalLic == null || originalLic.ServiceTypeCode != ServiceTypeEnum.DogTrainerCertification)
            throw new ArgumentException("cannot find the licence that needs to be renewed.");

        //check Renew your existing certification even though it has been expired for 6 month
        DateOnly currentDate = DateOnlyHelper.GetCurrentPSTDate();
        if (currentDate > originalLic.ExpiryDate.AddMonths(Constants.GDSDRenewValidAfterExpirationInMonths))
            throw new ArgumentException($"the certification can only be renewed within {Constants.GDSDRenewValidAfterExpirationInMonths} months after expiry date.");

        CreateDogTrainerAppCmd createApp = _mapper.Map<CreateDogTrainerAppCmd>(cmd.ChangeRequest);
        var response = await _dogTrainerAppRepository.CreateDogTrainerAppAsync(createApp, ct);
        await UploadNewDocsAsync(cmd.ChangeRequest.DocumentRelatedInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, ct);
        //copying all old files to new application in PreviousFileIds 
        if (cmd.ChangeRequest.PreviousDocumentIds != null && cmd.ChangeRequest.PreviousDocumentIds.Any())
        {
            foreach (var docUrlId in cmd.ChangeRequest.PreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.ContactId),
                    ct);
            }
        }
        await _dogTrainerAppRepository.CommitAppAsync(new CommitAppCmd()
        {
            LicenceAppId = response.LicenceAppId
        }, ct);
        return new DogTrainerAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppReplaceCommand cmd, CancellationToken ct)
    {
        LicenceResp? originalLic = await _licenceRepository.GetAsync(cmd.ChangeRequest.OriginalLicenceId, ct);
        if (originalLic == null || originalLic.ServiceTypeCode != ServiceTypeEnum.DogTrainerCertification)
            throw new ArgumentException("cannot find the licence that needs to be replaced.");

        var existingFiles = await GetExistingFileInfo(cmd.ChangeRequest.PreviousDocumentIds, ct);
        CreateDogTrainerAppCmd createApp = _mapper.Map<CreateDogTrainerAppCmd>(cmd.ChangeRequest);
        var response = await _dogTrainerAppRepository.CreateDogTrainerAppAsync(createApp, ct);
        await UploadNewDocsAsync(cmd.ChangeRequest.DocumentRelatedInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, ct);
        //copying all old files to new application in PreviousFileIds 
        if (cmd.ChangeRequest.PreviousDocumentIds != null && cmd.ChangeRequest.PreviousDocumentIds.Any())
        {
            foreach (var docUrlId in cmd.ChangeRequest.PreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.ContactId),
                    ct);
            }
        }
        await _dogTrainerAppRepository.CommitAppAsync(new CommitAppCmd()
        {
            LicenceAppId = response.LicenceAppId
        }, ct);
        return new DogTrainerAppCommandResponse { LicenceAppId = response.LicenceAppId };
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
