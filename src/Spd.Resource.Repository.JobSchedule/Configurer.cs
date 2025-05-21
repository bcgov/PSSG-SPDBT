using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;
using Spd.Resource.Repository.JobSchedule.Org;
using Spd.Resource.Repository.JobSchedule.ScheduleJobSession;
using Spd.Utilities.Hosting;

namespace Spd.Resource.Repository.JobSchedule;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        configurationServices.Services.AddTransient<IScheduleJobSessionRepository, ScheduleJobSessionRepository>();
        configurationServices.Services.AddTransient<IOrgRepository, OrgRepository>();
        configurationServices.Services.AddTransient<IGeneralizeScheduleJobRepository, GeneralizeScheduleJobRepository>();
    }
}