using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class PermitAppManager :
        LicenceAppManagerBase,
        IRequestHandler<GetPermitApplicationQuery, PermitLicenseAppResponse>,
        IRequestHandler<AnonymousPermitAppNewCommand, PermitAppCommandResponse>,
        IRequestHandler<AnonymousPermitAppReplaceCommand, PermitAppCommandResponse>,
        IRequestHandler<AnonymousPermitAppRenewCommand, PermitAppCommandResponse>,
        IRequestHandler<AnonymousPermitAppUpdateCommand, PermitAppCommandResponse>,
        IPermitAppManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly IContactRepository _contactRepository;

    public PermitAppManager(
        ILicenceRepository licenceRepository,
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IContactRepository contactRepository) : base(mapper, documentUrlRepository, feeRepository, licenceAppRepository)
    {
        _licenceRepository = licenceRepository;
        _contactRepository = contactRepository;
    }

    #region anonymous

    public async Task<PermitLicenseAppResponse> Handle(GetPermitApplicationQuery query, CancellationToken cancellationToken)
    {
        var response = await _licenceAppRepository.GetLicenceApplicationAsync(query.LicenseApplicationId, cancellationToken);
        PermitLicenseAppResponse result = _mapper.Map<PermitLicenseAppResponse>(response);        //PermitLicenseAppResponse
        //var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenseApplicationId), cancellationToken);
        //result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items);
        return result;
    }

    public async Task<PermitAppCommandResponse> Handle(AnonymousPermitAppNewCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        ValidateFilesForNewApp(cmd);
        //save the application
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
        await UploadNewDocsAsync(request, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, cancellationToken);
        decimal? cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);
        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<PermitAppCommandResponse> Handle(AnonymousPermitAppReplaceCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Replacement)
            throw new ArgumentException("should be a replacement request");

        //validation: check if original licence meet replacement condition.
        LicenceListResp licences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, cancellationToken);
        if (licences == null || !licences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be replaced.");
        if (DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays) > licences.Items.First().ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException("the licence cannot be replaced because it will expired soon or already expired");

        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

        //add photo file copying here.
        if (cmd.LicenceAnonymousRequest.OriginalApplicationId == null)
            throw new ArgumentException("replacement request must have original application id");
        var photos = await _documentRepository.QueryAsync(
            new DocumentQry(
                ApplicationId: cmd.LicenceAnonymousRequest.OriginalApplicationId,
                FileType: DocumentTypeEnum.Photograph),
            cancellationToken);
        if (photos.Items.Any())
        {
            foreach (var photo in photos.Items)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(photo.DocumentUrlId, response.LicenceAppId, response.ContactId),
                    cancellationToken);
            }
        }

        await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);
        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<PermitAppCommandResponse> Handle(AnonymousPermitAppRenewCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Renewal)
            throw new ArgumentException("should be a renewal request");

        //validation: check if original licence meet replacement condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be renewed.");
        LicenceResp originalLic = originalLicences.Items.First();
        if (originalLic.LicenceTermCode == LicenceTermEnum.NinetyDays)
        {
            if (DateTime.UtcNow > originalLic.ExpiryDate.AddDays(-Constants.LicenceWith90DaysRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
                && DateTime.UtcNow < originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
                throw new ArgumentException($"the licence can only be renewed within {Constants.LicenceWith90DaysRenewValidBeforeExpirationInDays} days of the expiry date.");
        }
        else
        {
            if (DateTime.UtcNow < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
                || DateTime.UtcNow > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
                throw new ArgumentException($"the licence can only be renewed within {Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays} days of the expiry date.");
        }

        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

        //copying all old files to new application in PreviousFileIds 
        if (cmd.LicenceAnonymousRequest.PreviousDocumentIds != null && cmd.LicenceAnonymousRequest.PreviousDocumentIds.Any())
        {
            foreach (var docUrlId in cmd.LicenceAnonymousRequest.PreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.ContactId),
                    cancellationToken);
            }
        }

        //todo: update all expiration date : for some doc type, some file got updated, some are still old files, and expiration data changed.
        bool hasSwl90DayLicence = originalLic.LicenceTermCode == LicenceTermEnum.NinetyDays &&
            originalLic.WorkerLicenceTypeCode == WorkerLicenceTypeEnum.SecurityWorkerLicence;

        await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken, hasSwl90DayLicence);

        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<PermitAppCommandResponse> Handle(AnonymousPermitAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("should be a update request");

        //validation: check if original licence meet update condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be updated.");
        LicenceResp originalLic = originalLicences.Items.First();
        if (DateTime.UtcNow.AddDays(Constants.LicenceUpdateValidBeforeExpirationInDays) > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException($"can't request an update within {Constants.LicenceUpdateValidBeforeExpirationInDays} days of expiry date.");

        LicenceApplicationResp originalApp = await _licenceAppRepository.GetLicenceApplicationAsync((Guid)cmd.LicenceAnonymousRequest.OriginalApplicationId, cancellationToken);
        ChangeSpec changes = await MakeChanges(originalApp, request, originalLic, cancellationToken);

        LicenceApplicationCmdResp? createLicResponse = null;
        if ((request.Reprint != null && request.Reprint.Value))
        {
            CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
            createLicResponse = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

            await CommitApplicationAsync(request, createLicResponse.LicenceAppId, cancellationToken);
        }
        else
        {
            //update contact directly
            await _contactRepository.ManageAsync(_mapper.Map<UpdateContactCmd>(request), cancellationToken);
        }
        await UploadNewDocsAsync(request,
            cmd.LicAppFileInfos,
            createLicResponse?.LicenceAppId,
            originalApp.ContactId,
            changes.PeaceOfficerStatusChangeTaskId,
            changes.MentalHealthStatusChangeTaskId,
            cancellationToken);
        return new PermitAppCommandResponse() { LicenceAppId = createLicResponse?.LicenceAppId };
    }

    #endregion

    private static void ValidateFilesForNewApp(AnonymousPermitAppNewCommand cmd)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;

        if (request.IsCanadianCitizen == false && request.IsCanadianResident == true)
        {
            if (!fileInfos.Any(f => LicenceAppDocumentManager.CanadianResidencyProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian but you are a resident in canada.");
            }
        }

        if (request.IsCanadianCitizen == false && request.IsCanadianResident == false)
        {
            if (!fileInfos.Any(f => LicenceAppDocumentManager.NonCanadiaCitizenProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian but you are not a resident in canada.");
            }
        }

        if (request.IsCanadianCitizen == true &&
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }

        if (request.UseBcServicesCardPhoto == false && !fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PhotoOfYourself file");
        }
    }

    private async Task<ChangeSpec> MakeChanges(LicenceApplicationResp originalApp, PermitAppAnonymousSubmitRequest newApp, LicenceResp originalLic, CancellationToken ct)
    {
        //todo: add code according to spec
        ChangeSpec changes = new ChangeSpec();

        return changes;
    }

    private sealed record ChangeSpec
    {
        public bool PeaceOfficerStatusChanged { get; set; } //task
        public Guid? PeaceOfficerStatusChangeTaskId { get; set; }
        public bool MentalHealthStatusChanged { get; set; } //task
        public Guid? MentalHealthStatusChangeTaskId { get; set; }
        public bool CriminalHistoryChanged { get; set; } //task
        public Guid? CriminalHistoryStatusChangeTaskId { get; set; }
    }
}
