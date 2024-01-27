using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Tasks;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<CreateTaskCmd, task>()
         .ForMember(d => d.activityid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.subject, opt => opt.MapFrom(s => s.Subject))
         .ForMember(d => d.description, opt => opt.MapFrom(s => s.Description))
         .ForMember(d => d.prioritycode, opt => opt.MapFrom(s => s.TaskPriorityEnum))
         .ForMember(d => d.scheduledend, opt => opt.MapFrom(s => s.DueDateTime));
    }

    internal static int? GetPriority(TaskPriorityEnum? code)
    {
        if (code == null) return (int)TaskPriorityOptionSet.Normal;
        return (int)Enum.Parse<TaskPriorityOptionSet>(code.ToString());
    }

    internal static TaskPriorityEnum? GetTaskPriorityEnum(int? optionset)
    {
        if (optionset == null) return null;
        return Enum.Parse<TaskPriorityEnum>(Enum.GetName(typeof(TaskPriorityOptionSet), optionset));
    }
}

