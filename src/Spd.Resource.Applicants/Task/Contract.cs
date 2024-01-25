namespace Spd.Resource.Applicants.Task;
public partial interface ITaskRepository
{
    public Task<TaskListResp> QueryAsync(TaskQry query, CancellationToken cancellationToken);
}


public record TaskQry
{

};

public record TaskResp()
{

}

public record TaskListResp
{
    public IEnumerable<TaskResp> TaskResps { get; set; } = Array.Empty<TaskResp>();
}


