using AutoMapper;
using MediatR;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.Event;
internal class EventRepository : IEventRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<IEventRepository> _logger;

    public EventRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<IEventRepository> logger)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<EventResp?> GetAsync(Guid eventId, CancellationToken ct)
    {
        spd_eventqueue? eventQueue = await _context.GetEventById(eventId, ct);
        return _mapper.Map<EventResp>(eventQueue);
    }

    public async Task<IEnumerable<EventResp>?> QueryAsync(EventQuery qry, CancellationToken ct)
    {
        IQueryable<spd_eventqueue> eventQueues = _context.spd_eventqueues;
        if (qry.EventStatusReasonEnum != null)
        {
            int status = (int)SharedMappingFuncs.GetOptionset<EventStatusReasonEnum, EventStatusReasonOptionSet>(qry.EventStatusReasonEnum);
            eventQueues = eventQueues.Where(i => i.statuscode == status);
        }

        if (qry.CutOffDateTime != null)
            eventQueues = eventQueues.Where(e => e.spd_eventdate < qry.CutOffDateTime);

        if (qry.EventTypeEnums != null && qry.EventTypeEnums.Any())
        {
            int?[] types = qry.EventTypeEnums.Select(e => (int?)SharedMappingFuncs.GetOptionset<EventTypeEnum, EventTypeOptionSet>(e)).ToArray();
            var predicate = PredicateBuilder.BuildOrPredicate<spd_eventqueue, int?>("spd_eventtype", types);
            eventQueues = eventQueues.Where(predicate);
        }
        var eventQueuesList = eventQueues.ToList();

        return _mapper.Map<IEnumerable<EventResp>>(eventQueuesList);
    }

    public async Task<Unit> ManageAsync(EventUpdateCmd cmd, CancellationToken ct)
    {
        spd_eventqueue? eventQueue = await _context.GetEventById(cmd.Id, ct);
        _mapper.Map<EventUpdateCmd, spd_eventqueue>(cmd, eventQueue);
        _context.UpdateObject(eventQueue);
        await _context.SaveChangesAsync(ct);
        return default;
    }
    public async Task<Unit> ManageInBatchAsync(List<EventUpdateCmd> cmds, CancellationToken ct)
    {
        try
        {
            foreach (var cmd in cmds)
            {
                spd_eventqueue? eventQueue = await _context.spd_eventqueues
                    .Where(l => l.spd_eventqueueid == cmd.Id)
                    .FirstOrDefaultAsync(ct);
                _mapper.Map<EventUpdateCmd, spd_eventqueue>(cmd, eventQueue);
                _context.UpdateObject(eventQueue);
            }
            await _context.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset, ct);
        }
        catch (Exception e)
        {
            _logger.LogError(e.ToString());
        }
        return default;
    }
}