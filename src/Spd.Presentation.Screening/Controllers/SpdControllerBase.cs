using Microsoft.AspNetCore.Mvc;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    [TypeFilter(typeof(ApiExceptionFilter))]
    public abstract class SpdControllerBase : ControllerBase
    {
    }
}
