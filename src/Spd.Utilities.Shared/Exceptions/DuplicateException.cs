using System.Net;

namespace Spd.Utilities.Shared.Exceptions
{
    public class DuplicateException : ApiException
    {

        public DuplicateException(HttpStatusCode statusCode, string message)
            : base(statusCode, message)
        {
        }

        public DuplicateException(HttpStatusCode statusCode, string message, Exception inner)
            : base(statusCode, message, inner)
        {
        }
    }
}

