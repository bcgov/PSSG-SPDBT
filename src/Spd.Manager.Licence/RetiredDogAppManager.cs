using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.DogBase;
using Spd.Resource.Repository.GDSDApp;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.Net;

namespace Spd.Manager.Licence;
internal class RetiredDogAppManager :
        LicenceAppManagerBase,
        IRequestHandler<RetiredDogLicenceApplicationQuery, RetiredDogLicenceAppResponse>,
        IRequestHandler<RetiredDogLicenceAppUpsertCommand, RetiredDogAppCommandResponse>,
        IRequestHandler<RetiredDogLicenceAppSubmitCommand, RetiredDogAppCommandResponse>,
        IRequestHandler<RetiredDogLicenceAppAnonymousSubmitCommand, RetiredDogAppCommandResponse>,
        IRequestHandler<RetiredDogLicenceAppRenewCommand, RetiredDogAppCommandResponse>,
        IRequestHandler<RetiredDogLicenceAppReplaceCommand, RetiredDogAppCommandResponse>,
        IRetiredDogAppManager
{
    private readonly IContactRepository _contactRepository;
    private readonly IGDSDAppRepository _gdsdRepository;

    public RetiredDogAppManager(
        ILicenceRepository licenceRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        IContactRepository contactRepository,
        IGDSDAppRepository gdsdRepository,
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
        _gdsdRepository = gdsdRepository;
    }

    #region anonymous
    public async Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppAnonymousSubmitCommand cmd, CancellationToken ct)
    {
        RetiredDogLicenceAppAnonymousSubmitRequest request = cmd.SubmitRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateGDSDAppCmd createApp = _mapper.Map<CreateGDSDAppCmd>(request);
        var response = await _gdsdRepository.CreateGDSDAppAsync(createApp, ct);
        await UploadNewDocsAsync(request.DocumentRelatedInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, ct);
        await _gdsdRepository.CommitAppAsync(new CommitAppCmd()
        {
            LicenceAppId = response.LicenceAppId
        }, ct);
        return new RetiredDogAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }
    #endregion

    #region auth
    public async Task<RetiredDogLicenceAppResponse> Handle(RetiredDogLicenceApplicationQuery query, CancellationToken ct)
    {
        var resp = await _gdsdRepository.GetGDSDAppAsync(query.LicenceApplicationId, ct);
        RetiredDogLicenceAppResponse result = _mapper.Map<RetiredDogLicenceAppResponse>(resp);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), ct);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();
        return result;

    }
    public async Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppUpsertCommand cmd, CancellationToken ct)
    {
        SaveGDSDAppCmd saveCmd = _mapper.Map<SaveGDSDAppCmd>(cmd.UpsertRequest);
        var response = await _gdsdRepository.SaveGDSDAppAsync(saveCmd, ct);
        if (cmd.UpsertRequest.LicenceAppId == null)
            cmd.UpsertRequest.LicenceAppId = response.LicenceAppId;
        await UpdateDocumentsAsync(
            (Guid)cmd.UpsertRequest.LicenceAppId,
            (List<Document>?)cmd.UpsertRequest.DocumentInfos,
            ct);
        return _mapper.Map<RetiredDogAppCommandResponse>(response);
    }

    public async Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppSubmitCommand cmd, CancellationToken ct)
    {
        var response = await this.Handle((RetiredDogLicenceAppUpsertCommand)cmd, ct);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync((Guid)cmd.UpsertRequest.LicenceAppId, ct);
        await _gdsdRepository.CommitAppAsync(new CommitAppCmd()
        {
            LicenceAppId = (Guid)cmd.UpsertRequest.LicenceAppId
        }, ct);
        return new RetiredDogAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppRenewCommand cmd, CancellationToken ct)
    {
        LicenceResp? originalLic = await _licenceRepository.GetAsync(cmd.ChangeRequest.OriginalLicenceId, ct);
        if (originalLic == null || originalLic.ServiceTypeCode != ServiceTypeEnum.RetiredServiceDogCertification)
            throw new ArgumentException("cannot find the licence that needs to be renewed.");

        //check Renew your existing certification even though it has been expired for 6 month
        DateOnly currentDate = DateOnlyHelper.GetCurrentPSTDate();
        if (currentDate > originalLic.ExpiryDate.AddMonths(Constants.GDSDRenewValidAfterExpirationInMonths))
            throw new ArgumentException($"the certification can only be renewed within {Constants.GDSDRenewValidAfterExpirationInMonths} months after expiry date.");

        var existingFiles = await GetExistingFileInfo(cmd.ChangeRequest.PreviousDocumentIds, ct);
        CreateGDSDAppCmd createApp = _mapper.Map<CreateGDSDAppCmd>(cmd.ChangeRequest);
        var response = await _gdsdRepository.CreateGDSDAppAsync(createApp, ct);
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
        await _gdsdRepository.CommitAppAsync(new CommitAppCmd()
        {
            LicenceAppId = response.LicenceAppId
        }, ct);
        return new RetiredDogAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppReplaceCommand cmd, CancellationToken ct)
    {
        LicenceResp? originalLic = await _licenceRepository.GetAsync(cmd.ChangeRequest.OriginalLicenceId, ct);
        if (originalLic == null || originalLic.ServiceTypeCode != ServiceTypeEnum.RetiredServiceDogCertification)
            throw new ArgumentException("cannot find the licence that needs to be replaced.");

        var existingFiles = await GetExistingFileInfo(cmd.ChangeRequest.PreviousDocumentIds, ct);
        CreateGDSDAppCmd createApp = _mapper.Map<CreateGDSDAppCmd>(cmd.ChangeRequest);
        var response = await _gdsdRepository.CreateGDSDAppAsync(createApp, ct);
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
        await _gdsdRepository.CommitAppAsync(new CommitAppCmd()
        {
            LicenceAppId = response.LicenceAppId
        }, ct);
        return new RetiredDogAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }
    #endregion

    private static void ValidateFilesForNewApp(RetiredDogLicenceAppAnonymousSubmitCommand cmd)
    {
        RetiredDogLicenceAppAnonymousSubmitRequest request = cmd.SubmitRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;

        if (request.ServiceTypeCode == ServiceTypeCode.RetiredServiceDogCertification) //both new and renew need photo
        {
            if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "A photo that shows the applicant's face is required.");
            }
        }

        if (request.ServiceTypeCode == ServiceTypeCode.RetiredServiceDogCertification && request.ApplicationTypeCode == ApplicationTypeCode.New)
        {
            if (!fileInfos.Any(f => LicenceAppDocumentManager.ValidGovIssuedPhotoIdCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "A valid government issued photo identification is required.");
            }

        }

    }
}
