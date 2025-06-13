using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

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

    public async Task<MDRARegistrationCmdResp> CreateMDRARegistrationAsync(CreateMDRARegistrationCmd cmd, CancellationToken ct)
    {
        spd_orgregistration registration = _mapper.Map<spd_orgregistration>(cmd);
        _context.AddTospd_orgregistrations(registration);
        LinkType(_context, registration);
        LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, registration);

        List<spd_address> addrs = _mapper.Map<List<spd_address>>(cmd);
        foreach (spd_address addr in addrs)
        {
            _context.AddTospd_addresses(addr);
            _context.SetLink(addr, nameof(addr.spd_OrgRegistrationId), registration);
        }
        await _context.SaveChangesAsync(ct);

        return new MDRARegistrationCmdResp(registration.spd_orgregistrationid.Value);
    }

    public async Task<MDRARegistrationResp> GetMDRARegistrationAsync(Guid registrationId, CancellationToken ct)
    {
        spd_orgregistration? registration = await _context.GetOrgRegistrationById(registrationId, ct);
        if (registration == null)
            throw new ApiException(HttpStatusCode.BadRequest, $"No registration found for id = {registrationId}");
        var resp = _mapper.Map<MDRARegistrationResp>(registration);
        //todo: get branches
        return resp;
    }

    private static void LinkTeam(DynamicsContext _context, string teamGuidStr, spd_orgregistration registration)
    {
        Guid teamGuid = Guid.Parse(teamGuidStr);
        team? serviceTeam = _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefault();
        _context.SetLink(registration, nameof(spd_orgregistration.owningteam), serviceTeam);
    }

    private static void LinkType(DynamicsContext _context, spd_orgregistration registration)
    {
        spd_organizationtype? type = _context.LookupOrganizationType("MetalDealerRecycler");
        _context.SetLink(registration, nameof(spd_orgregistration.spd_OrganizationTypeId), type);
    }
}
