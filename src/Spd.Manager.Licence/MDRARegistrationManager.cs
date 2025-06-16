using AutoMapper;
using MediatR;
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
        IRequestHandler<GetMDRARegistrationIdQuery, Guid?>,
        IRequestHandler<GetMDRARegistrationQuery, MDRARegistrationResponse>,
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
        bool? hasSilentDuplicate = null;
        if (cmd.SubmitRequest.RequireDuplicateCheck)
        {
            bool hasDuplicate;
            (hasDuplicate, hasSilentDuplicate) = await CheckDuplicate(cmd.SubmitRequest, ct);
            if (hasDuplicate)
            {
                return response = new MDRARegistrationCommandResponse { HasPotentialDuplicate = true };
            }
        }
        ValidateFiles(cmd.LicAppFileInfos);
        CreateMDRARegistrationCmd createCmd = _mapper.Map<CreateMDRARegistrationCmd>(cmd.SubmitRequest);
        createCmd.HasPotentialDuplicate = cmd.SubmitRequest.HasPotentialDuplicate == true || hasSilentDuplicate == true;
        MDRARegistrationCmdResp resp = await _repository.CreateMDRARegistrationAsync(createCmd, ct);
        await UploadNewDocsAsync(cmd.LicAppFileInfos, resp.RegistrationId, ct);
        return new MDRARegistrationCommandResponse { RegistrationId = resp.RegistrationId };
    }

    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationRenewCommand cmd, CancellationToken ct)
    {
        MDRARegistrationCommandResponse response;
        ValidateFiles(cmd.LicAppFileInfos);
        CreateMDRARegistrationCmd createCmd = _mapper.Map<CreateMDRARegistrationCmd>(cmd.ChangeRequest);
        MDRARegistrationCmdResp resp = await _repository.CreateMDRARegistrationAsync(createCmd, ct);
        await UploadNewDocsAsync(cmd.LicAppFileInfos, resp.RegistrationId, ct);
        return new MDRARegistrationCommandResponse { RegistrationId = resp.RegistrationId };
    }

    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationUpdateCommand cmd, CancellationToken ct)
    {
        MDRARegistrationCommandResponse response;
        ValidateFiles(cmd.LicAppFileInfos);
        CreateMDRARegistrationCmd createCmd = _mapper.Map<CreateMDRARegistrationCmd>(cmd.ChangeRequest);
        MDRARegistrationCmdResp resp = await _repository.CreateMDRARegistrationAsync(createCmd, ct);
        await UploadNewDocsAsync(cmd.LicAppFileInfos, resp.RegistrationId, ct);
        return new MDRARegistrationCommandResponse { RegistrationId = resp.RegistrationId };
    }

    public async Task<Guid?> Handle(GetMDRARegistrationIdQuery cmd, CancellationToken ct)
    {
        OrgQryResult org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(cmd.BizId), ct);
        return org.OrgResult.OrgRegistrationId;
    }

    public async Task<MDRARegistrationResponse> Handle(GetMDRARegistrationQuery query, CancellationToken ct)
    {
        MDRARegistrationResp registration = await _repository.GetMDRARegistrationAsync(query.BizRegistrationId, ct);
        return _mapper.Map<MDRARegistrationResponse>(registration);
    }
    #endregion

    private async Task<(bool HasPotentialDuplicate, bool HasSilentPotentialDuplicate)> CheckDuplicate(MDRARegistrationRequest request, CancellationToken cancellationToken)
    {
        bool hasPotentialDuplicate = false;
        bool hasSilentPotentialDuplicate = false;
        var searchQry = _mapper.Map<SearchRegistrationQry>(request);
        hasPotentialDuplicate = await _orgRegistrationRepository.CheckDuplicateAsync(searchQry, cancellationToken);

        var searchOrgQry = _mapper.Map<SearchOrgQry>(request);
        hasSilentPotentialDuplicate = await _orgRepository.CheckDuplicateAsync(searchOrgQry, cancellationToken);

        return (hasPotentialDuplicate, hasSilentPotentialDuplicate);
    }

    private static void ValidateFiles(IEnumerable<LicAppFileInfo> fileInfos)
    {
        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BusinessLicenceDocuments))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Must provide copies of business licence registration documents.");
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
                fileCmd.TempFile = tempFile;
                fileCmd.OrgRegistrationId = orgRegistrationId;
                await _documentRepository.ManageAsync(fileCmd, ct);
            }
        }
    }
}
