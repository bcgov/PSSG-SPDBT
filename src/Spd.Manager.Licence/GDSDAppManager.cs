using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.GDSDApp;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

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
    private readonly IGDSDAppRepository _gdsdRepository;

    public GDSDAppManager(
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
    public async Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppAnonymousSubmitCommand cmd, CancellationToken ct)
    {
        GDSDTeamLicenceAppAnonymousSubmitRequest request = cmd.SubmitRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateGDSDAppCmd createApp = _mapper.Map<CreateGDSDAppCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());
        var response = await _gdsdRepository.CreateGDSDAppAsync(createApp, ct);
        await UploadNewDocsAsync(request.DocumentRelatedInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, ct);
        await _gdsdRepository.CommitGDSDAppAsync(new CommitGDSDAppCmd()
        {
            LicenceAppId = response.LicenceAppId,
            ApplicationStatusCode = Resource.Repository.ApplicationStatusEnum.Submitted
        }, ct);
        return new GDSDAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }
    #endregion

    #region auth
    public Task<GDSDTeamLicenceAppResponse> Handle(GDSDTeamLicenceApplicationQuery query, CancellationToken ct)
    {
        return Task.FromResult<GDSDTeamLicenceAppResponse>(null);
    }
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppUpsertCommand cmd, CancellationToken ct)
    {
        SaveGDSDAppCmd saveCmd = _mapper.Map<SaveGDSDAppCmd>(cmd.UpsertRequest);
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.UpsertRequest.DocumentInfos);
        //var response = await _gdsdRepository.SaveGDSDAppAsync(saveCmd, cancellationToken);
        //if (cmd.PermitUpsertRequest.LicenceAppId == null)
        //    cmd.PermitUpsertRequest.LicenceAppId = response.LicenceAppId;
        //await UpdateDocumentsAsync(
        //    (Guid)cmd.PermitUpsertRequest.LicenceAppId,
        //    (List<Document>?)cmd.PermitUpsertRequest.DocumentInfos,
        //    cancellationToken);
        //return _mapper.Map<GDSDAppCommandResponse>(response);
        return null;
    }

    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppSubmitCommand command, CancellationToken ct)
    {
        return Task.FromResult<GDSDAppCommandResponse>(null);
    }
    #endregion

    private static void ValidateFilesForNewApp(GDSDTeamLicenceAppAnonymousSubmitCommand cmd)
    {
        GDSDTeamLicenceAppAnonymousSubmitRequest request = cmd.SubmitRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;

        if (request.ServiceTypeCode == ServiceTypeCode.GDSDTeamCertification) //both new and renew need photo
        {
            if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "A photo that shows the applicant’s face is required.");
            }
        }

        if (request.ServiceTypeCode == ServiceTypeCode.GDSDTeamCertification && request.ApplicationTypeCode == ApplicationTypeCode.New)
        {
            if (!fileInfos.Any(f => LicenceAppDocumentManager.ValidGovIssuedPhotoIdCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "A valid government issued photo identification is required.");
            }
            if (request.IsDogTrainedByAccreditedSchool == true)
            {
                //dog is trained by accredited school
                if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, "An identification card issued by an accredited training school is required.");
                }
            }
            else
            {
                //dog is trained by non-accredited school
                if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, "Medical Form Confirming Requirement for Guide Dog or Service completed by a Canadian or U.S. physician or nurse practitioner is required.");
                }
                if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, "Written confirmation from a Canadian or U.S. veterinarian or equivalent that your dog has been spayed or neutered is required.");
                }
            }
        }

    }
}
