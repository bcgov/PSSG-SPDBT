using AutoMapper;
using MediatR;
using Spd.Resource.Repository.BizContact;

namespace Spd.Manager.Licence;
internal class BizControllingMemberEmployeeManager :
        IRequestHandler<GetBizControllerMembersQuery, ControllingMembers>,
        IRequestHandler<GetBizEmployeesQuery, IEnumerable<SwlContactInfo>>,
        IRequestHandler<UpsertBizControllerMembersCommand, Unit>,
        IRequestHandler<UpsertEmployeesCommand, Unit>,
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

    public async Task<ControllingMembers> Handle(GetBizControllerMembersQuery qry, CancellationToken ct)
    {
        var contacts = await _bizContactRepository.GetBizAppContactsAsync(new BizContactQry(qry.BizId, qry.ApplicationId, BizContactRoleEnum.ControllingMember), ct);
        ControllingMembers controllingMembers = new();
        controllingMembers.SwlControllingMembers = contacts.Where(c => c.ContactId != null && c.LicenceId != null)
            .Select(c => new SwlContactInfo()
            {
                BizContactId = c.BizContactId,
                LicenceId = c.LicenceId,
                ContactId = c.ContactId,
            });
        controllingMembers.NonSwlControllingMembers = contacts.Where(c => c.ContactId != null && c.LicenceId != null)
            .Select(c => _mapper.Map<ContactInfo>(c));
        return controllingMembers;
    }

    public async Task<IEnumerable<SwlContactInfo>> Handle(GetBizEmployeesQuery qry, CancellationToken ct)
    {
        var employees = await _bizContactRepository.GetBizAppContactsAsync(new BizContactQry(qry.BizId, qry.ApplicationId, BizContactRoleEnum.Employee), ct);
        return employees.Where(c => c.ContactId != null && c.LicenceId != null)
            .Select(c => new SwlContactInfo()
            {
                BizContactId = c.BizContactId,
                LicenceId = c.LicenceId,
                ContactId = c.ContactId,
            });
    }

    public async Task<Unit> Handle(UpsertBizControllerMembersCommand query, CancellationToken ct)
    {
        return default;
    }

    public async Task<Unit> Handle(UpsertEmployeesCommand query, CancellationToken ct)
    {
        return default;

    }
}
