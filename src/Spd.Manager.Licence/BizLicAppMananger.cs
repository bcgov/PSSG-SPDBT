using AutoMapper;
using MediatR;
using Spd.Resource.Repository.BizApplication;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class BizLicAppMananger :
        LicenceAppManagerBase,
        IRequestHandler<GetBizLicAppQuery, BizLicAppResponse>,
        IRequestHandler<BizLicAppUpsertCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppSubmitCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppReplaceCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppRenewCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppUpdateCommand, BizLicAppCommandResponse>,
        IBizLicAppManager
{
    private readonly IBizApplicationRepository _bizApplicationRepository;

    public BizLicAppMananger(
        ILicenceRepository licenceRepository,
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        IBizApplicationRepository bizApplicationRepository)
    : base(mapper, documentUrlRepository, feeRepository, licenceRepository, licenceAppRepository, mainFileStorageService, transientFileStorageService)
    {
        _bizApplicationRepository = bizApplicationRepository;
    }

    public async Task<BizLicAppResponse> Handle(GetBizLicAppQuery cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppUpsertCommand cmd, CancellationToken cancellationToken)
    {
        bool hasDuplicate = await HasDuplicates(cmd.BizLicAppUpsertRequest.BizId,
            Enum.Parse<WorkerLicenceTypeEnum>(cmd.BizLicAppUpsertRequest.WorkerLicenceTypeCode.ToString()),
            cmd.BizLicAppUpsertRequest.LicenceAppId,
            cancellationToken);

        if (hasDuplicate)
            throw new ApiException(HttpStatusCode.Forbidden, "Biz already has the same kind of licence or licence application");

        SaveBizLicApplicationCmd saveCmd = _mapper.Map<SaveBizLicApplicationCmd>(cmd.BizLicAppUpsertRequest);
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.BizLicAppUpsertRequest.DocumentInfos);
        var response = await _bizApplicationRepository.SaveBizLicApplicationAsync(saveCmd, cancellationToken);
        if (cmd.BizLicAppUpsertRequest.LicenceAppId == null)
            cmd.BizLicAppUpsertRequest.LicenceAppId = response.LicenceAppId;
        await UpdateDocumentsAsync(
            (Guid)cmd.BizLicAppUpsertRequest.LicenceAppId,
            (List<Document>?)cmd.BizLicAppUpsertRequest.DocumentInfos,
            cancellationToken);
        return _mapper.Map<BizLicAppCommandResponse>(response);
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppSubmitCommand cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppReplaceCommand cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppRenewCommand cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}