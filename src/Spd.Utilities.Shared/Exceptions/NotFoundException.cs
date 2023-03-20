using System.Net;

namespace Spd.Utilities.Shared.Exceptions
{
    public class NotFoundException : ApiException
    {

        public NotFoundException(HttpStatusCode statusCode, string message)
                : base(statusCode, message)
        {
        }

        public NotFoundException(HttpStatusCode statusCode, string message, Exception inner)
                : base(statusCode, message, inner)
        {
        }
    }
}

