using AutoMapper;
using MediatR;
using Spd.Resource.Repository.BizContact;

namespace Spd.Manager.Licence;
internal class BizControllingMemberEmployeeManager :
        IRequestHandler<GetBizMembersQuery, Members>,
        IRequestHandler<UpsertBizMembersCommand, Unit>,
        IBizControllingMemberEmployeeManager
{

    private readonly IBizContactRepository _bizContactRepository;
    private readonly IMapper _mapper;

    public BizControllingMemberEmployeeManager(
        IBizContactRepository bizContactRepository,
        IMapper mapper)
    {
        _mapper = mapper;
        _bizContactRepository = bizContactRepository;
    }

    public async Task<Members> Handle(GetBizMembersQuery qry, CancellationToken ct)
    {
        var bizMembers = await _bizContactRepository.GetBizAppContactsAsync(new BizContactQry(qry.BizId, qry.ApplicationId), ct);
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
            .Select(c => _mapper.Map<ContactInfo>(c));
        members.Employees = bizMembers.Where(c => c.ContactId != null && c.LicenceId != null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.Employee)
            .Select(c => _mapper.Map<SwlContactInfo>(c));
        return members;
    }

    public async Task<Unit> Handle(UpsertBizMembersCommand cmd, CancellationToken ct)
    {
        List<BizContactResp> contacts = _mapper.Map<List<BizContactResp>>(cmd.Members.NonSwlControllingMembers);
        contacts.AddRange(_mapper.Map<IList<BizContactResp>>(cmd.Members.SwlControllingMembers));
        IList<BizContactResp> employees = _mapper.Map<IList<BizContactResp>>(cmd.Members.Employees);
        foreach (var e in employees)
        {
            e.BizContactRoleCode = BizContactRoleEnum.Employee;
        }
        contacts.AddRange(employees);
        BizContactUpsertCmd upsertCmd = new(
            cmd.BizId,
            cmd.ApplicationId,
            contacts);
        await _bizContactRepository.ManageBizContactsAsync(upsertCmd, ct);
        return default;
    }
}
