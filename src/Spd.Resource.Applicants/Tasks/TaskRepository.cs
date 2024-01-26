using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Tasks;
internal class TaskRepository : ITaskRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public TaskRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache)
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
        await _context.SaveChangesAsync(ct);
        return null;
    }
}
