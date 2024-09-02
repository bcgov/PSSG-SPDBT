using Microsoft.AspNetCore.Mvc;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Utilities.Shared
{
    [ApiController]
    [TypeFilter(typeof(ApiExceptionFilterAttribute))]
    public abstract class SpdControllerBase : ControllerBase
    {
    }
}
