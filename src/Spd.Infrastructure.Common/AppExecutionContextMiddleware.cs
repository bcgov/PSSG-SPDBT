using Microsoft.AspNetCore.Http;

namespace Spd.Infrastructure.Common
{
    public class AppExecutionContextMiddleware : IMiddleware
    {
        public Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if (AppExecutionContextHelper.Current == null)
            {
                AppExecutionContextHelper.SetContext(context.Request.Path, context.RequestServices, context.RequestAborted);
            }
            return next.Invoke(context);
        }
    }
}
