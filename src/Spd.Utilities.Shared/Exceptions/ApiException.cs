using System.Net;

namespace Spd.Utilities.Shared.Exceptions
{
    public class ApiException : Exception
    {
        private readonly HttpStatusCode statusCode;

        public ApiException(HttpStatusCode statusCode, string message, Exception ex)
            : base(message, ex)
        {
            this.statusCode = statusCode;
        }

        public ApiException(HttpStatusCode statusCode, string message)
            : base(message)
        {
            this.statusCode = statusCode;
        }

        public ApiException(HttpStatusCode statusCode)
        {
            this.statusCode = statusCode;
        }

        public HttpStatusCode StatusCode
        {
            get { return this.statusCode; }
        }
    }
}
