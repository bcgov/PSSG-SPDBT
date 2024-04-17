using AutoMapper;

namespace Spd.Presentation.Dynamics;

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<PrintJobRequest, Spd.Manager.Common.PrintJob>();
    }
}