using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Biz;

namespace Spd.Manager.Licence;
internal class BizControllingMemberEmployeeManager :
        IRequestHandler<GetBizControllerMembersQuery, ControllingMembers>,
        IRequestHandler<GetBizEmployeesQuery, IEnumerable<SwlContactInfo>>,
        IRequestHandler<UpsertBizControllerMembersCommand, Unit>,
        IRequestHandler<UpsertEmployeesCommand, Unit>,
        IBizControllingMemberEmployeeManager
{

    private readonly IBizRepository _bizRepository;
    private readonly IMapper _mapper;

    public BizControllingMemberEmployeeManager(
        IBizRepository bizRepository,
        IMapper mapper)
    {
        _mapper = mapper;
        _bizRepository = bizRepository;
    }

    public async Task<ControllingMembers> Handle(GetBizControllerMembersQuery cmd, CancellationToken ct)
    {
        return null;
    }

    public async Task<IEnumerable<SwlContactInfo>> Handle(GetBizEmployeesQuery query, CancellationToken ct)
    {
        return null;
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
