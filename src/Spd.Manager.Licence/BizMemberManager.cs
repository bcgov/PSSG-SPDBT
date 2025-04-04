﻿using AutoMapper;
using MediatR;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.ControllingMemberInvite;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class BizMemberManager :
        LicenceAppManagerBase,
        IRequestHandler<GetBizMembersQuery, Members>,
        IRequestHandler<GetNonSwlBizMemberCommand, NonSwlContactInfo>,
        IRequestHandler<UpsertBizMembersCommand, Unit>,
        IRequestHandler<BizControllingMemberNewInviteCommand, ControllingMemberInvitesCreateResponse>,
        IRequestHandler<VerifyBizControllingMemberInviteCommand, ControllingMemberAppInviteVerifyResponse>,
        IRequestHandler<CreateBizEmployeeCommand, BizMemberResponse>,
        IRequestHandler<CreateBizSwlControllingMemberCommand, BizMemberResponse>,
        IRequestHandler<CreateBizNonSwlControllingMemberCommand, BizMemberResponse>,
        IRequestHandler<UpdateBizNonSwlControllingMemberCommand, BizMemberResponse>,
        IRequestHandler<DeleteBizMemberCommand, Unit>,
        IBizMemberManager
{
    private readonly IBizLicApplicationRepository _bizLicApplicationRepository;
    private readonly IBizContactRepository _bizContactRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IBizRepository _bizRepository;
    private readonly IPersonLicApplicationRepository _personLicApplicationRepository;
    private readonly IControllingMemberInviteRepository _cmInviteRepository;
    private readonly IControllingMemberCrcRepository _cmCrcRepository;

    public BizMemberManager(
        ILicenceRepository licenceRepository,
        ILicAppRepository licAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        IBizContactRepository bizContactRepository,
        IControllingMemberInviteRepository cmInviteRepository,
        IControllingMemberCrcRepository cmCrcRepository)
    : base(mapper,
        documentUrlRepository,
        feeRepository,
        licenceRepository,
        mainFileStorageService,
        transientFileStorageService,
        licAppRepository)
    {
        _bizContactRepository = bizContactRepository;
        _cmInviteRepository = cmInviteRepository;
        _cmCrcRepository = cmCrcRepository;
    }

    public async Task<ControllingMemberAppInviteVerifyResponse> Handle(VerifyBizControllingMemberInviteCommand cmd, CancellationToken cancellationToken)
    {
        ControllingMemberInviteVerifyResp resp = await _cmInviteRepository.VerifyControllingMemberInviteAsync(new ControllingMemberInviteVerifyCmd(cmd.InviteEncryptedCode), cancellationToken);

        var response = _mapper.Map<ControllingMemberAppInviteVerifyResponse>(resp);

        //get biz app id
        IEnumerable<LicenceAppListResp> list = await _licAppRepository.QueryAsync(
            new LicenceAppQuery(
                null,
                resp.BizId,
                new List<ServiceTypeEnum> { ServiceTypeEnum.SecurityBusinessLicence },
                new List<ApplicationPortalStatusEnum>
                {
                    ApplicationPortalStatusEnum.Draft,
                    ApplicationPortalStatusEnum.Incomplete,
                    ApplicationPortalStatusEnum.VerifyIdentity,
                    ApplicationPortalStatusEnum.AwaitingPayment
                }),
            cancellationToken);
        LicenceAppListResp? app = list.Where(a => a.ApplicationTypeCode != ApplicationTypeEnum.Replacement)
            .OrderByDescending(a => a.CreatedOn)
            .FirstOrDefault();
        response.BizLicAppId = app?.LicenceAppId;

        //get existing controlling member crc app
        BizContactResp? contactResp = await _bizContactRepository.GetBizContactAsync(response.BizContactId, cancellationToken);
        if (contactResp == null || contactResp.BizContactRoleCode != BizContactRoleEnum.ControllingMember)
            throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");
        _mapper.Map<BizContactResp, ControllingMemberAppInviteVerifyResponse>(contactResp, response);

        return response;
    }

    public async Task<ControllingMemberInvitesCreateResponse> Handle(BizControllingMemberNewInviteCommand cmd, CancellationToken cancellationToken)
    {
        //check if bizContact already has invitation
        //todo: probably we do not need to check this. it should allow user to send out invite multiple times.
        //var existingInvites = await _cmInviteRepository.QueryAsync(new ControllingMemberInviteQuery(cmd.BizContactId), cancellationToken);
        //if (existingInvites.Any(i => i.Status == Resource.Repository.ApplicationInviteStatusEnum.Sent))
        //    throw new ApiException(HttpStatusCode.BadRequest, "There is already an invite sent out.");

        //get info from bizContactId
        BizContactResp contactResp = await _bizContactRepository.GetBizContactAsync(cmd.BizContactId, cancellationToken);
        if (contactResp == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot find the non-swl controlling member.");
        if (contactResp.BizContactRoleCode != BizContactRoleEnum.ControllingMember)
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot send out invitation for non-swl controlling member.");
        if (cmd.InviteTypeCode != ControllingMemberAppInviteTypeCode.CreateShellApp && string.IsNullOrWhiteSpace(contactResp.EmailAddress))
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot send out invitation when there is no email address provided.");

        if (cmd.InviteTypeCode == ControllingMemberAppInviteTypeCode.CreateShellApp)
        {
            var createShellApp = _mapper.Map<SaveControllingMemberCrcAppCmd>(contactResp);
            //get biz app id
            IEnumerable<LicenceAppListResp> list = await _licAppRepository.QueryAsync(
                new LicenceAppQuery(
                    null,
                    contactResp.BizId,
                    new List<ServiceTypeEnum> { ServiceTypeEnum.SecurityBusinessLicence },
                    new List<ApplicationPortalStatusEnum>
                    {
                        ApplicationPortalStatusEnum.Draft,
                        ApplicationPortalStatusEnum.Incomplete,
                        ApplicationPortalStatusEnum.VerifyIdentity,
                        ApplicationPortalStatusEnum.AwaitingPayment
                    }),
                cancellationToken);
            LicenceAppListResp? app = list.Where(a => a.ApplicationTypeCode != ApplicationTypeEnum.Replacement)
                .OrderByDescending(a => a.CreatedOn)
                .FirstOrDefault();
            createShellApp.ParentBizLicApplicationId = app?.LicenceAppId;
            await _cmCrcRepository.CreateControllingMemberCrcApplicationAsync(createShellApp, cancellationToken);
        }
        else
        {
            var createCmd = _mapper.Map<ControllingMemberInviteCreateCmd>(contactResp);
            createCmd.CreatedByUserId = cmd.UserId;
            createCmd.HostUrl = cmd.HostUrl;
            createCmd.InviteTypeCode = Enum.Parse<ControllingMemberAppInviteTypeEnum>(cmd.InviteTypeCode.ToString());
            await _cmInviteRepository.ManageAsync(createCmd, cancellationToken);
        }
        return new ControllingMemberInvitesCreateResponse(cmd.BizContactId) { CreateSuccess = true };
    }

    public async Task<Members> Handle(GetBizMembersQuery qry, CancellationToken ct)
    {
        var bizMembers = await _bizContactRepository.QueryBizContactsAsync(new BizContactQry(qry.BizId, null), ct);
        Members members = new();
        members.SwlControllingMembers = bizMembers.Where(c => c.ContactId != null && c.LicenceId != null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.ControllingMember)
            .Select(c => new SwlContactInfo()
            {
                BizContactId = c.BizContactId,
                LicenceId = c.LicenceId,
                ContactId = c.ContactId,
            });
        members.NonSwlControllingMembers = bizMembers.Where(c => c.LicenceId == null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.ControllingMember)
            .Select(c => _mapper.Map<NonSwlContactInfo>(c));
        members.Employees = bizMembers.Where(c => c.ContactId != null && c.LicenceId != null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.Employee && !c.PositionCodes.Any(c => c == PositionEnum.PrivateInvestigatorManager))
            .Select(c => _mapper.Map<SwlContactInfo>(c));
        return members;
    }

    public async Task<BizMemberResponse> Handle(CreateBizEmployeeCommand cmd, CancellationToken ct)
    {
        BizContact bizContact = _mapper.Map<BizContact>(cmd.Employee);
        bizContact.BizContactRoleCode = BizContactRoleEnum.Employee;
        bizContact.BizId = cmd.BizId;
        Guid? bizContactId = await _bizContactRepository.ManageBizContactsAsync(new BizContactCreateCmd(bizContact), ct);
        return new BizMemberResponse(bizContactId);
    }
    public async Task<BizMemberResponse> Handle(CreateBizSwlControllingMemberCommand cmd, CancellationToken ct)
    {
        BizContact bizContact = _mapper.Map<BizContact>(cmd.SwlControllingMember);
        bizContact.BizContactRoleCode = BizContactRoleEnum.ControllingMember;
        bizContact.BizId = cmd.BizId;
        Guid? bizContactId = await _bizContactRepository.ManageBizContactsAsync(new BizContactCreateCmd(bizContact), ct);
        return new BizMemberResponse(bizContactId);
    }
    public async Task<BizMemberResponse> Handle(CreateBizNonSwlControllingMemberCommand cmd, CancellationToken ct)
    {
        BizContact bizContact = _mapper.Map<BizContact>(cmd.NonSwlControllingMember);
        bizContact.BizContactRoleCode = BizContactRoleEnum.ControllingMember;
        bizContact.BizId = cmd.BizId;
        Guid? bizContactId = await _bizContactRepository.ManageBizContactsAsync(new BizContactCreateCmd(bizContact), ct);
        return new BizMemberResponse(bizContactId);
    }
    public async Task<Unit> Handle(DeleteBizMemberCommand cmd, CancellationToken ct)
    {
        await _bizContactRepository.ManageBizContactsAsync(new BizContactDeleteCmd(cmd.BizContactId), ct);
        return default;
    }
    public async Task<BizMemberResponse> Handle(UpdateBizNonSwlControllingMemberCommand cmd, CancellationToken ct)
    {
        BizContact bizContact = _mapper.Map<BizContact>(cmd.NonSwlControllingMember);
        bizContact.BizContactRoleCode = BizContactRoleEnum.ControllingMember;
        bizContact.BizId = cmd.BizId;
        Guid? bizContactId = await _bizContactRepository.ManageBizContactsAsync(new BizContactUpdateCmd(cmd.BizContactId, bizContact), ct);
        return new BizMemberResponse(bizContactId);
    }
    public async Task<Unit> Handle(UpsertBizMembersCommand cmd, CancellationToken ct)
    {
        await UpdateMembersAsync(cmd.Members, cmd.BizId, ct);
        if (cmd.LicAppFileInfos.Any(f => f.LicenceDocumentTypeCode != LicenceDocumentTypeCode.CorporateRegistryDocument))
            throw new ApiException(HttpStatusCode.BadRequest, "Can only Upload Corporate Registry Document for management of controlling member.");

        if (cmd.LicAppFileInfos != null && cmd.LicAppFileInfos.Any())
        {
            foreach (LicAppFileInfo licAppFile in cmd.LicAppFileInfos)
            {
                SpdTempFile? tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                CreateDocumentCmd? fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                fileCmd.AccountId = cmd.BizId;
                fileCmd.ApplicationId = cmd.ApplicationId;
                fileCmd.TempFile = tempFile;
                //create bcgov_documenturl and file
                await _documentRepository.ManageAsync(fileCmd, ct);
            }
        }
        return default;
    }

    public async Task<NonSwlContactInfo> Handle(GetNonSwlBizMemberCommand cmd, CancellationToken ct)
    {
        var result = await _bizContactRepository.GetBizContactAsync(cmd.BizContactId, ct);
        if (result == null) throw new ApiException(HttpStatusCode.BadRequest, $"bizContact with id {cmd.BizContactId} not found");
        return _mapper.Map<NonSwlContactInfo>(result);
    }

    private async Task<Unit> UpdateMembersAsync(Members members, Guid bizId, CancellationToken ct)
    {
        List<BizContactResp> contacts = _mapper.Map<List<BizContactResp>>(members.NonSwlControllingMembers);
        contacts.AddRange(_mapper.Map<IList<BizContactResp>>(members.SwlControllingMembers));
        IList<BizContactResp> employees = _mapper.Map<IList<BizContactResp>>(members.Employees);
        foreach (var e in employees)
        {
            e.BizContactRoleCode = BizContactRoleEnum.Employee;
        }
        contacts.AddRange(employees);
        BizContactUpsertCmd upsertCmd = new(bizId, contacts);
        await _bizContactRepository.ManageBizContactsAsync(upsertCmd, ct);
        return default;
    }
}