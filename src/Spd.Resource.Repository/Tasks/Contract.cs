namespace Spd.Resource.Repository.Tasks;

public partial interface ITaskRepository
{
    public Task<TaskResp> ManageAsync(TaskCmd cmd, CancellationToken ct);
}

public abstract record TaskCmd;
public record CreateTaskCmd : TaskCmd
{
    public string Subject { get; set; } = null!;
    public string Description { get; set; } = null!;
    public TaskPriority TaskPriorityEnum { get; set; }
    public DateTimeOffset DueDateTime { get; set; }
    public Guid? RegardingContactId { get; set; }
    public Guid? RegardingCaseId { get; set; }
    public Guid? RegardingAccountId { get; set; }
    public Guid? AssignedTeamId { get; set; }
    public Guid? LicenceId { get; set; }
}
public record TaskResp()
{
    public Guid TaskId { get; set; }
}

public record TaskListResp
{
    public IEnumerable<TaskResp> TaskResps { get; set; } = Array.Empty<TaskResp>();
}

public enum TaskPriority
{
    Low,
    Normal,
    High
}