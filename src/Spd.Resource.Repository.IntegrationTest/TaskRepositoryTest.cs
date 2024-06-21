using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;
public class TaskRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly ITaskRepository _taskRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public TaskRepositoryTest(IntegrationTestSetup testSetup)
    {
        _taskRepository = testSetup.ServiceProvider.GetService<ITaskRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
    }

    [Fact]
    public async Task CreateTaskAsync_Run_Correctly()
    {
        // Arrange
        Guid accountId = Guid.NewGuid();
        account account = new() { accountid = accountId };
        _context.AddToaccounts(account);
        await _context.SaveChangesAsync();

        CreateTaskCmd cmd = new CreateTaskCmd() { RegardingAccountId = accountId, DueDateTime = DateTimeOffset.Now };

        // Act
        var response = await _taskRepository.ManageAsync(cmd, CancellationToken.None);

        // Assert
        Assert.IsType<TaskResp>(response);
        Assert.NotEqual(Guid.Empty, response.TaskId);

        // Annihilate
        task? task = _context.tasks.Where(t => t.activityid == response.TaskId).FirstOrDefault();

        _context.DeleteObject(task);
        _context.DeleteObject(account);
        await _context.SaveChangesAsync();
    }
}
