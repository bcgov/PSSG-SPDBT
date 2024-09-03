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
using Spd.Manager.Shared;
using Spd.Resource.Repository.Contact;

namespace Spd.Manager.Licence;
internal class ControllingMemberCrcAppManager : 
    LicenceAppManagerBase,
    IRequestHandler<ControllingMemberCrcAppNewCommand, ControllingMemberCrcAppCommandResponse>,
    IControllingMemberCrcAppManager
{
    private readonly IControllingMemberCrcRepository _controllingMemberCrcRepository;

    public ControllingMemberCrcAppManager(IMapper mapper, 
        IDocumentRepository documentRepository, 
        ILicenceFeeRepository feeRepository, 
        ILicenceRepository licenceRepository, 
        IMainFileStorageService mainFileService, 
        ITransientFileStorageService transientFileService,
        IControllingMemberCrcRepository controllingMemberCrcRepository,
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
    }
    #region anonymous new
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppNewCommand cmd, CancellationToken ct)
    {

        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateControllingMemberCrcAppCmd createApp = _mapper.Map<CreateControllingMemberCrcAppCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());

        var response = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(createApp, ct);
        
        await UploadNewDocsAsync(request.DocumentExpiredInfos, cmd.LicAppFileInfos, response.ControllingMemberCrcAppId, response.ContactId, null, null, null, null, null, ct);
        decimal cost = await CommitApplicationAsync(request, response.ControllingMemberCrcAppId, ct);

        return new ControllingMemberCrcAppCommandResponse
        {
            ControllingMemberAppId = response.ControllingMemberCrcAppId,
            Cost = cost
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
        decimal cost = await CommitApplicationAsync(cmd.ControllingMemberCrcAppUpsertRequest, cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId.Value, ct, false);
        return new ControllingMemberCrcAppCommandResponse { ControllingMemberAppId = response.ControllingMemberAppId, Cost = cost};
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        return null;
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

}
