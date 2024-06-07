using AutoMapper;
using Spd.Manager.Printing;
using Spd.Presentation.Dynamics.Models;

namespace Spd.Presentation.Dynamics.Controllers;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<PrintPreviewJobRequest, PrintJob>();
    }
}