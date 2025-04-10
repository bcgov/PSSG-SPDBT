using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Manager.ScheduleJob;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        configurationServices.Services.AddTransient<IScheduleJobManager, ScheduleJobManager>();
    }
}

