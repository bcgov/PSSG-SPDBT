using System.Net;

namespace Spd.Utilities.Shared.Exceptions
{
    public class OutOfRangeException : ApiException
    {

        public OutOfRangeException(HttpStatusCode statusCode, string message)
            : base(statusCode, message)
        {
        }

        public OutOfRangeException(HttpStatusCode statusCode, string message, Exception inner)
            : base(statusCode, message, inner)
        {
        }
    }
}

