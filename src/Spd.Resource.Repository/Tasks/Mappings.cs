using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.Tasks;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<CreateTaskCmd, task>()
         .ForMember(d => d.activityid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.subject, opt => opt.MapFrom(s => s.Subject))
         .ForMember(d => d.description, opt => opt.MapFrom(s => s.Description))
         .ForMember(d => d.prioritycode, opt => opt.MapFrom(s => GetPriority(s.TaskPriorityEnum)))
         .ForMember(d => d.scheduledend, opt => opt.MapFrom(s => s.DueDateTime));
    }

    private static int GetPriority(TaskPriority? code) => (int)code.ConvertEnum(TaskPriorityOptionSet.Normal);
}