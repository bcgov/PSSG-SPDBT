using AutoMapper;
using MediatR;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.Document;
using Spd.Manager.Licence;
using Spd.Utilities.Shared.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository;

namespace Spd.Manager.Licence;
internal class ControllingMemberCrcAppManager :
    LicenceAppManagerBase,
    IRequestHandler<ControllingMemberCrcAppNewCommand, ControllingMemberCrcAppCommandResponse>,
    IRequestHandler<ControllingMemberCrcUpsertCommand, ControllingMemberCrcAppCommandResponse>,
    IRequestHandler<ControllingMemberCrcSubmitCommand, ControllingMemberCrcAppCommandResponse>,
    IRequestHandler<GetControllingMemberCrcApplicationQuery, ControllingMemberCrcAppResponse>,
    IControllingMemberCrcAppManager
{
    private readonly IControllingMemberCrcRepository _controllingMemberCrcRepository;
    private readonly IApplicationInviteRepository _applicationInviteRepository;

    public ControllingMemberCrcAppManager(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceRepository licenceRepository,
        IMainFileStorageService mainFileService,
        ITransientFileStorageService transientFileService,
        IControllingMemberCrcRepository controllingMemberCrcRepository,
        IApplicationInviteRepository applicationInviteRepository,
        ILicAppRepository licAppRepository) : base(
            mapper,
            documentRepository,
            feeRepository,
            licenceRepository,
            mainFileService,
            transientFileService,
            licAppRepository)
    {
        _controllingMemberCrcRepository = controllingMemberCrcRepository;
        _applicationInviteRepository = applicationInviteRepository;
    }
    #region anonymous new
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppNewCommand cmd, CancellationToken ct)
    {
        ApplicationInviteResult? invite = null;
        //check if invite is still valid
        if (cmd.ControllingMemberCrcAppSubmitRequest?.InviteId != null)
        {
            var invites = await _applicationInviteRepository.QueryAsync(
                new ApplicationInviteQuery()
                {
                    FilterBy = new AppInviteFilterBy(null, null, AppInviteId: cmd.ControllingMemberCrcAppSubmitRequest.InviteId)
                }, ct);
            invite = invites.ApplicationInvites.FirstOrDefault();
            if (invite != null && (invite.Status == ApplicationInviteStatusEnum.Completed || invite.Status == ApplicationInviteStatusEnum.Cancelled || invite.Status == ApplicationInviteStatusEnum.Expired))
                throw new ArgumentException("Invalid Invite status.");
        }

        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateControllingMemberCrcAppCmd createApp = _mapper.Map<CreateControllingMemberCrcAppCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());

        var response = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(createApp, ct);

        await UploadNewDocsAsync(request.DocumentExpiredInfos, cmd.LicAppFileInfos, response.ControllingMemberCrcAppId, response.ContactId, null, null, null, null, null, ct);

        //
        await _licAppRepository.CommitLicenceApplicationAsync(response.ControllingMemberCrcAppId, ApplicationStatusEnum.Submitted, ct);

        //inactivate invite
        if (cmd.ControllingMemberCrcAppSubmitRequest?.InviteId != null)
        {
            await _applicationInviteRepository.ManageAsync(
                new ApplicationInviteUpdateCmd()
                {
                    ApplicationInviteId = (Guid)cmd.ControllingMemberCrcAppSubmitRequest.InviteId,
                    ApplicationInviteStatusEnum = ApplicationInviteStatusEnum.Completed
                }, ct);
        }
        return new ControllingMemberCrcAppCommandResponse
        {
            ControllingMemberAppId = response.ControllingMemberCrcAppId,
        };
    }
    #endregion
    #region authenticated
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcUpsertCommand cmd, CancellationToken ct)
    {
        SaveControllingMemberCrcAppCmd saveCmd = _mapper.Map<SaveControllingMemberCrcAppCmd>(cmd.ControllingMemberCrcAppUpsertRequest);

        //TODO: find the purpose, add related enums if needed (ask peggy)
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.ControllingMemberCrcAppUpsertRequest.DocumentInfos);
        saveCmd.WorkerLicenceTypeCode = WorkerLicenceTypeEnum.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC;
        var response = await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(saveCmd, ct);
        if (cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId == null)
            cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId = response.ControllingMemberCrcAppId;
        await UpdateDocumentsAsync(
            (Guid)cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId,
            (List<Document>?)cmd.ControllingMemberCrcAppUpsertRequest.DocumentInfos,
            ct);
        return _mapper.Map<ControllingMemberCrcAppCommandResponse>(response);
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcSubmitCommand cmd, CancellationToken ct)
    {
        var response = await this.Handle((ControllingMemberCrcUpsertCommand)cmd, ct);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync((Guid)cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId, ct);
        await _licAppRepository.CommitLicenceApplicationAsync(response.ControllingMemberAppId, ApplicationStatusEnum.Submitted, ct);

        return new ControllingMemberCrcAppCommandResponse { ControllingMemberAppId = response.ControllingMemberAppId };
    }
    #endregion
    private static void ValidateFilesForNewApp(ControllingMemberCrcAppNewCommand cmd)
    {
        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;
        if (request.IsPoliceOrPeaceOfficer == true &&
            !fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PoliceBackgroundLetterOfNoConflict file");
        }

        if (request.IsTreatedForMHC == true &&
            !fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing MentalHealthCondition file");
        }

        if (request.IsCanadianCitizen == true &&
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }

        if (request.IsCanadianCitizen == false &&
          !fileInfos.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian.");
        }

        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing ProofOfFingerprint file.");
        }
    }

    public async Task<ControllingMemberCrcAppResponse> Handle(GetControllingMemberCrcApplicationQuery query, CancellationToken ct)
    {
        var response = await _controllingMemberCrcRepository.GetCrcApplicationAsync(query.ControllingMemberApplicationId, ct);
        ControllingMemberCrcAppResponse result = _mapper.Map<ControllingMemberCrcAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.ControllingMemberApplicationId), ct);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();  // Exclude licence document type code that are not defined in the related dictionary
        return result;
    }
}
