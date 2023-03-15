using MediatR;

namespace Spd.Presentation.Screening
{
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;

        public UsersMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context, IMediator mediator)
        {
            var user = context.User;
            await next(context);
        }



    }
}
