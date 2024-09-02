using System.Net;

namespace Spd.Utilities.Shared.Exceptions;

#pragma warning disable CA1032 // Implement standard exception constructors
#pragma warning disable RCS1194 // Implement exception constructors

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