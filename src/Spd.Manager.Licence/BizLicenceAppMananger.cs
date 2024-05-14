using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Licence;
internal class BizLicenceAppMananger :
        LicenceAppManagerBase,
        IRequestHandler<GetBizLicAppQuery, BizLicAppResponse>,
        IRequestHandler<BizLicAppUpsertCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppSubmitCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppReplaceCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppRenewCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppUpdateCommand, BizLicAppCommandResponse>,
        IBizLicAppManager
{
    public BizLicenceAppMananger(
        ILicenceRepository licenceRepository,
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService)
    : base(mapper, documentUrlRepository, feeRepository, licenceRepository, licenceAppRepository, mainFileStorageService, transientFileStorageService)
    {

    }

    public async Task<BizLicAppResponse> Handle(GetBizLicAppQuery cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppUpsertCommand cmd, CancellationToken cancellationToken)
    {
        // * hasDuplicate?

        SaveLicenceApplicationCmd saveCmd = _mapper.Map<SaveLicenceApplicationCmd>(cmd.BizLicAppUpsertRequest);
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.BizLicAppUpsertRequest.DocumentInfos);
        var response = await _licenceAppRepository.SaveLicenceApplicationAsync(saveCmd, cancellationToken);
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