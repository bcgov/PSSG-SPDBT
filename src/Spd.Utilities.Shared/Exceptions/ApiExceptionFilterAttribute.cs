using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;

namespace Spd.Utilities.Shared.Exceptions;

public sealed class ApiExceptionFilterAttribute([NotNull] ILogger<ApiExceptionFilterAttribute> logger) : ExceptionFilterAttribute
{
    public override void OnException(ExceptionContext context)
    {
        ApiError apiError;
        if (context.Exception is ApiException ex)
        {
            // handle explicit 'known' API errors
            context.Exception = null;
            apiError = new ApiError(ex.Message, ex.ErrorDetails);
            context.HttpContext.Response.StatusCode = (int)ex.StatusCode;
        }
        else if (context.Exception is UnauthorizedAccessException)
        {
            apiError = new ApiError("Unauthorized Access");
            context.HttpContext.Response.StatusCode = 401;

            // handle logging here
        }
        else
        {
            // Unhandled errors
            var msg = context.Exception.GetBaseException().Message;
            string? stack = context.Exception?.StackTrace;
            apiError = new ApiError(msg);
            string? innerExpMsg = context.Exception?.InnerException?.Message;
            if (innerExpMsg == null)
                apiError.detail = stack ?? string.Empty;
            else
                apiError.detail = innerExpMsg + ";" + stack;
            context.HttpContext.Response.StatusCode = 500;
            // handle logging here
            Logger.LogError(context.Exception, "Exception");
        }

        // always return a JSON result
        context.Result = new JsonResult(apiError);

        base.OnException(context);
    }

    public ILogger<ApiExceptionFilterAttribute> Logger => logger;
}