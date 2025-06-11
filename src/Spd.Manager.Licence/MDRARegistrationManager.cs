using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.MDRARegistration;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.Registration;
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
    private readonly IOrgRepository _orgRepository;
    private readonly IOrgRegistrationRepository _orgRegistrationRepository;

    public MDRARegistrationManager(IMapper mapper,
        IMDRARegistrationRepository repository,
        IDocumentRepository documentRepository,
        IOrgRepository orgRepository,
        IOrgRegistrationRepository orgRegistrationRepository)
    {
        this._mapper = mapper;
        this._repository = repository;
        this._documentRepository = documentRepository;
        this._orgRepository = orgRepository;
        this._orgRegistrationRepository = orgRegistrationRepository;
    }

    #region anonymous
    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationNewCommand cmd, CancellationToken ct)
    {
        MDRARegistrationCommandResponse response;
        if (cmd.SubmitRequest.RequireDuplicateCheck)
        {
            response = await CheckDuplicate(cmd.SubmitRequest, ct);
            if (response.HasPotentialDuplicate == true)
            {
                return response = new MDRARegistrationCommandResponse { HasPotentialDuplicate = true };
            }
        }
        ValidateFilesForNewApp(cmd);
        CreateMDRARegistrationCmd createCmd = _mapper.Map<CreateMDRARegistrationCmd>(cmd.SubmitRequest);
        MDRARegistrationResp resp = await _repository.CreateMDRARegistrationAsync(createCmd, ct);
        await UploadNewDocsAsync(cmd.LicAppFileInfos, resp.RegistrationId, ct);
        return new MDRARegistrationCommandResponse { OrgRegistrationId = resp.RegistrationId };
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

    private async Task<MDRARegistrationCommandResponse> CheckDuplicate(MDRARegistrationNewRequest request, CancellationToken cancellationToken)
    {
        MDRARegistrationCommandResponse resp = new MDRARegistrationCommandResponse();
        var searchOrgQry = _mapper.Map<SearchOrgQry>(request);
        bool hasDuplicateInOrg = await _orgRepository.CheckDuplicateAsync(searchOrgQry, cancellationToken);
        if (hasDuplicateInOrg)
        {
            resp.HasPotentialDuplicate = true;
            return resp;
        }

        var searchQry = _mapper.Map<SearchRegistrationQry>(request);
        bool hasDuplicateInOrgReg = await _orgRegistrationRepository.CheckDuplicateAsync(searchQry, cancellationToken);
        if (hasDuplicateInOrgReg)
        {
            resp.HasPotentialDuplicate = true;
        }

        return resp;
    }

    private static void ValidateFilesForNewApp(MDRARegistrationNewCommand cmd)
    {
        MDRARegistrationRequest request = cmd.SubmitRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;

        if (request.ApplicationTypeCode == ApplicationTypeCode.New) //both new and renew need biz licence Registry Document
        {
            if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BusinessLicenceDocuments))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Must provide copies of business licence registration documents.");
            }
        }
    }

    //upload file from cache to main bucket
    private async Task UploadNewDocsAsync(
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
