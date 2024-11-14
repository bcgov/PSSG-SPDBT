using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Incident;
internal class IncidentRepository : IIncidentRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public IncidentRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<IncidentListResp> QueryAsync(IncidentQry qry, CancellationToken ct)
    {
        IQueryable<incident> incidents = _context.incidents
            .Expand(i => i.spd_incident_spd_licencecondition);

        if (!qry.IncludeInactive)
            incidents = incidents.Where(i => i.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.IncidentId != null)
            incidents = incidents.Where(i => i.incidentid == qry.IncidentId);

        if (qry.ApplicationId != null)
            incidents = incidents.Where(i => i._spd_applicationid_value == qry.ApplicationId);

        if (qry.CaseNumber != null)
            incidents = incidents.Where(i => i.ticketnumber == qry.CaseNumber);

        var result = await incidents.GetAllPagesAsync(ct);
        result = result.OrderByDescending(a => a.createdon);
        return new IncidentListResp
        {
            Items = _mapper.Map<IEnumerable<IncidentResp>>(result)
        };
    }

    public async Task<IncidentResp> ManageAsync(IncidentCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            UpdateIncidentCmd c => await UpdateIncidentAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<IncidentResp> UpdateIncidentAsync(UpdateIncidentCmd cmd, CancellationToken ct)
    {
        var incident = await _context.incidents
            .Where(i => i._spd_applicationid_value == cmd.ApplicationId)
            .OrderByDescending(i => i.createdon)
            .FirstOrDefaultAsync(ct);

        if (incident == null) { return null; }

        incident.statuscode = (int)Enum.Parse<CaseStatusOptionSet>(cmd.CaseStatus.ToString());
        incident.spd_substatusreasondetail = (int)Enum.Parse<CaseSubStatusOptionSet>(cmd.CaseSubStatus.ToString());
        _context.UpdateObject(incident);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<IncidentResp>(incident);
    }

}

