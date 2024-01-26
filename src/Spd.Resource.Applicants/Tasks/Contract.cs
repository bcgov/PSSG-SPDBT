namespace Spd.Resource.Applicants.Tasks;
public partial interface ITaskRepository
{
    public Task<TaskResp> ManageAsync(TaskCmd query, CancellationToken cancellationToken);
}

public abstract record TaskCmd;
public record CreateTaskCmd : TaskCmd
{
    public string Subject { get; set; }
    public string Description { get; set; }
    public TaskPriorityEnum TaskPriorityEnum { get; set; }
    public DateOnly DueDate { get; set; }
    public Guid? RegardingContactId { get; set; }
    public Guid? RegardingCaseId { get; set; }
    public Guid? TeamId { get; set; }
}
public record TaskResp()
{
    public Guid TaskId { get; set; }
}

public record TaskListResp
{
    public IEnumerable<TaskResp> TaskResps { get; set; } = Array.Empty<TaskResp>();
}

public enum TaskPriorityEnum
{
    Low,
    Normal,
    High
}



