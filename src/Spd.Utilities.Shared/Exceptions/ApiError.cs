namespace Spd.Utilities.Shared.Exceptions;

public class ApiError
{
    public string message { get; set; }
    public bool isError { get; set; }
    public string? detail { get; set; }

    public ApiError(string message, string? errorDetails = null)
    {
        isError = true;
        this.message = message;
        this.detail = errorDetails;
    }
}