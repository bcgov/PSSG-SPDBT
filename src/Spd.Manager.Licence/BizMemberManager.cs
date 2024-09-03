using AutoMapper;
using MediatR;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
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
        IRequestHandler<UpsertBizMembersCommand, Unit>,
        IRequestHandler<BizControllingMemberNewInviteCommand, ControllingMemberInvitesCreateResponse>,
        IRequestHandler<VerifyBizControllingMemberInviteCommand, ControllingMemberAppInviteVerifyResponse>,
        IBizMemberManager
{
    private readonly IBizLicApplicationRepository _bizLicApplicationRepository;
    private readonly IBizContactRepository _bizContactRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IBizRepository _bizRepository;
    private readonly IPersonLicApplicationRepository _personLicApplicationRepository;
    private readonly IControllingMemberInviteRepository _cmInviteRepository;

    public BizMemberManager(
        ILicenceRepository licenceRepository,
        ILicAppRepository licAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        IBizContactRepository bizContactRepository,
        IControllingMemberInviteRepository cmInviteRepository)
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
                new List<WorkerLicenceTypeEnum> { WorkerLicenceTypeEnum.SecurityBusinessLicence },
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
        BizContactResp contactResp = await _bizContactRepository.GetBizContactAsync(response.BizContactId, cancellationToken);
        if (contactResp.BizContactRoleCode != BizContactRoleEnum.ControllingMember)
            throw new ApiException(HttpStatusCode.InternalServerError, "The business contact is not controlling member ");
        response.ControllingMemberCrcAppId = contactResp.LatestControllingMemberCrcAppId;
        response.ControllingMemberCrcAppPortalStatusCode = contactResp.LatestControllingMemberCrcAppPortalStatusEnum == null ? null :
            Enum.Parse<ApplicationPortalStatusCode>(contactResp.LatestControllingMemberCrcAppPortalStatusEnum.Value.ToString());

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
        if (contactResp.BizContactRoleCode != BizContactRoleEnum.ControllingMember)
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot send out invitation for non-controlling member.");
        if (string.IsNullOrWhiteSpace(contactResp.EmailAddress))
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot send out invitation when there is no email address provided.");
        if (contactResp.LatestControllingMemberCrcAppPortalStatusEnum != null)
            throw new ApiException(HttpStatusCode.BadRequest, "This business contact already has a CRC application");
        //todo : how can we check if the CRC approved but it has been expired.

        var createCmd = _mapper.Map<ControllingMemberInviteCreateCmd>(contactResp);
        createCmd.CreatedByUserId = cmd.UserId;
        createCmd.HostUrl = cmd.HostUrl;
        await _cmInviteRepository.ManageAsync(createCmd, cancellationToken);

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
        members.NonSwlControllingMembers = bizMembers.Where(c => c.ContactId == null && c.LicenceId == null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.ControllingMember)
            .Select(c => _mapper.Map<NonSwlContactInfo>(c));
        members.Employees = bizMembers.Where(c => c.ContactId != null && c.LicenceId != null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.Employee)
            .Select(c => _mapper.Map<SwlContactInfo>(c));
        return members;
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