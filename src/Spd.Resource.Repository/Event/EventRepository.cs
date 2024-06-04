using AutoMapper;
using MediatR;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Event;
internal class EventRepository : IEventRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    public EventRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<EventResp?> GetAsync(Guid eventId, CancellationToken ct)
    {
        spd_eventqueue? eventQueue = await _context.GetEventById(eventId, ct);
        return _mapper.Map<EventResp>(eventQueue);
    }

    public async Task<Unit> ManageAsync(EventUpdateCmd cmd, CancellationToken ct)
    {
        spd_eventqueue? eventQueue = await _context.GetEventById(cmd.Id, ct);
        _mapper.Map<EventUpdateCmd, spd_eventqueue>(cmd, eventQueue);
        _context.UpdateObject(eventQueue);
        await _context.SaveChangesAsync(ct);
        return default;
    }
}


