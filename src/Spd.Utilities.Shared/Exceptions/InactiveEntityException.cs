using System.Net;

namespace Spd.Utilities.Shared.Exceptions
{
    public class InactiveException : ApiException
    {

        public InactiveException(HttpStatusCode statusCode, string message)
            : base(statusCode, message)
        {
        }

        public InactiveException(HttpStatusCode statusCode, string message, Exception inner)
            : base(statusCode, message, inner)
        {
        }
    }
}

