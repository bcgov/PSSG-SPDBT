using System.Net;

namespace Spd.Utilities.Shared.Exceptions;

#pragma warning disable CA1032 // Implement standard exception constructors
#pragma warning disable RCS1194 // Implement exception constructors

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