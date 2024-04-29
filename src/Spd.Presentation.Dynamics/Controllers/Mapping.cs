using AutoMapper;
using Spd.Manager.Printing;
using Spd.Presentation.Dynamics.Models;

namespace Spd.Presentation.Dynamics.Controllers;

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<PrintJobRequest, PrintJob>();
    }
}