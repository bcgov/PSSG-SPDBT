using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.MDRARegistration;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class MDRARegistrationManager :
        IRequestHandler<MDRARegistrationNewCommand, MDRARegistrationCommandResponse>,
        IRequestHandler<MDRARegistrationRenewCommand, MDRARegistrationCommandResponse>,
        IRequestHandler<MDRARegistrationUpdateCommand, MDRARegistrationCommandResponse>,
        IMDRARegistrationManager
{
    private readonly IMapper _mapper;
    private readonly IMDRARegistrationRepository _repository;
    private readonly IDocumentRepository _documentRepository;

    public MDRARegistrationManager(IMapper mapper,
        IMDRARegistrationRepository repository,
        IDocumentRepository documentRepository)
    {
        this._mapper = mapper;
        this._repository = repository;
        this._documentRepository = documentRepository;
    }

    #region anonymous
    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationNewCommand cmd, CancellationToken ct)
    {
        //ValidateFilesForNewApp(cmd);
        CreateMDRARegistrationCmd createCmd = _mapper.Map<CreateMDRARegistrationCmd>(cmd.SubmitRequest);
        MDRARegistrationResp respone = await _repository.CreateMDRARegistrationAsync(createCmd, ct);
        await UploadNewDocsAsync(cmd.LicAppFileInfos, respone.RegistrationId, ct);
        return new MDRARegistrationCommandResponse { OrgRegistrationId = respone.RegistrationId };
    }

    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationRenewCommand cmd, CancellationToken ct)
    {
        return new MDRARegistrationCommandResponse { OrgRegistrationId = Guid.Empty };
    }

    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationUpdateCommand cmd, CancellationToken ct)
    {
        return new MDRARegistrationCommandResponse { OrgRegistrationId = Guid.Empty };
    }
    #endregion

    private static void ValidateFilesForNewApp(MDRARegistrationNewCommand cmd)
    {
        MDRARegistrationRequest request = cmd.SubmitRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;

        if (request.ApplicationTypeCode == ApplicationTypeCode.New) //both new and renew need biz licence Registry Document
        {
            if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.CorporateRegistryDocument))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Must provide copies of business licence registration documents.");
            }
        }
    }

    //upload file from cache to main bucket
    protected async Task UploadNewDocsAsync(
        IEnumerable<LicAppFileInfo> newFileInfos,
        Guid? orgRegistrationId,
        CancellationToken ct)
    {
        if (newFileInfos != null && newFileInfos.Any())
        {
            foreach (LicAppFileInfo licAppFile in newFileInfos)
            {
                SpdTempFile? tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                CreateDocumentCmd? fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                fileCmd.OrgRegistrationId = orgRegistrationId;
                await _documentRepository.ManageAsync(fileCmd, ct);
            }
        }
    }
}
