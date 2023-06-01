using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace Spd.Utilities.Shared.Exceptions
{
    public class ApiExceptionFilter : ExceptionFilterAttribute
    {
        private ILogger<ApiExceptionFilter> _Logger;

        public ApiExceptionFilter(ILogger<ApiExceptionFilter> logger)
        {
            _Logger = logger;
        }

        public override void OnException(ExceptionContext context)
        {
            ApiError apiError = null;
            if (context.Exception is ApiException)
            {
                
                // handle explicit 'known' API errors
                var ex = context.Exception as ApiException;
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
                _Logger.LogError(context.Exception, "Exception");
            }

            // always return a JSON result
            context.Result = new JsonResult(apiError);

            base.OnException(context);
        }
    }
}
