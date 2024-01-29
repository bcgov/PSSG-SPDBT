﻿using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Tasks;
internal class TaskRepository : ITaskRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public TaskRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<TaskResp> ManageAsync(TaskCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            CreateTaskCmd c => await CreateTaskAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<TaskResp> CreateTaskAsync(CreateTaskCmd cmd, CancellationToken ct)
    {
        task t = _mapper.Map<task>(cmd);
        _context.AddTotasks(t);

        if (cmd.RegardingContactId != null)
        {
            contact? contact = _context.contacts.Where(c => c.contactid == cmd.RegardingContactId).FirstOrDefault();
            if (contact == null)
            {
                throw new ArgumentException($"cannot find contact for contactid = {cmd.RegardingContactId}.");
            }
            _context.SetLink(t, nameof(t.regardingobjectid_contact), contact);
        }

        if (cmd.RegardingCaseId != null)
        {
            incident? incident = _context.incidents.Where(c => c.incidentid == cmd.RegardingCaseId).FirstOrDefault();
            if (incident == null)
            {
                throw new ArgumentException($"cannot find contact for incidentid = {cmd.RegardingCaseId}.");
            }
            _context.SetLink(t, nameof(t.regardingobjectid_incident), incident);
        }

        if (cmd.AssignedTeamId != null)
        {
            team? serviceTeam = await _context.teams.Where(t => t.teamid == cmd.AssignedTeamId).FirstOrDefaultAsync(ct);
            _context.SetLink(t, nameof(t.ownerid), serviceTeam);
        }
        await _context.SaveChangesAsync(ct);
        return new TaskResp { TaskId = t.activityid ?? Guid.Empty };
    }
}
