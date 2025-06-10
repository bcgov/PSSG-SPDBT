using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.MDRARegistration;
internal class MDRARegistrationRepository : IMDRARegistrationRepository
{
    protected readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public MDRARegistrationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        this._context = ctx.CreateChangeOverwrite();
        this._mapper = mapper;
    }

    public async Task<MDRARegistrationResp> CreateMDRARegistrationAsync(CreateMDRARegistrationCmd cmd, CancellationToken ct)
    {
        spd_orgregistration registration = _mapper.Map<spd_orgregistration>(cmd);
        _context.AddTospd_orgregistrations(registration);
        LinkType();
        LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, registration);
        await _context.SaveChangesAsync(ct);

        return new MDRARegistrationResp(registration.spd_orgregistrationid.Value);
    }

    public static void LinkTeam(DynamicsContext _context, string teamGuidStr, spd_orgregistration registration)
    {
        Guid teamGuid = Guid.Parse(teamGuidStr);
        team? serviceTeam = _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefault();
        _context.SetLink(registration, nameof(spd_orgregistration.owningteam), serviceTeam);
    }
}
