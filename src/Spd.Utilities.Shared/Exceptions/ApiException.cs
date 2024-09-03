using System.Net;

namespace Spd.Utilities.Shared.Exceptions;

#pragma warning disable CA1032 // Implement standard exception constructors
#pragma warning disable RCS1194 // Implement exception constructors

public class ApiException : Exception
{
    private readonly HttpStatusCode statusCode;
    private readonly string? errorDetails;

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

    public ApiException(HttpStatusCode statusCode, string message, string errorDetails)
    : base(message)
    {
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
    }

    public HttpStatusCode StatusCode
    {
        get { return this.statusCode; }
    }

    public string? ErrorDetails
    {
        get { return this.errorDetails; }
    }
}