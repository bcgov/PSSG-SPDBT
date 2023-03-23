using Microsoft.AspNetCore.Mvc;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Utilities.Shared
{
    [ApiController]
    [TypeFilter(typeof(ApiExceptionFilter))]
    public abstract class SpdControllerBase : ControllerBase
    {
    }
}
