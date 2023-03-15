using System.Security.Claims;

namespace Spd.Presentation.Screening.Services
{
    public interface IUserService
    {
        Task<ClaimsPrincipal> GetPrincipal(ClaimsPrincipal sourcePrincipal = null);
    }

    public class UserService : IUserService
    {

        private readonly IHttpContextAccessor httpContext;

        private ClaimsPrincipal currentPrincipal => httpContext.HttpContext?.User;
        private readonly Func<ClaimsPrincipal, string> getCurrentUserName = principal => principal.FindFirstValue("bceid_username");

        private static Func<string, string> generateCacheKeyName = userName => $"_userprincipal_{userName}";

        public UserService(IHttpContextAccessor httpContext)
        {
            this.httpContext = httpContext;
        }

        public async Task<ClaimsPrincipal> GetPrincipal(ClaimsPrincipal sourcePrincipal = null)
        {
            if (sourcePrincipal == null) sourcePrincipal = currentPrincipal;
            var userName = getCurrentUserName(sourcePrincipal);
            return null;
            //return new ClaimsPrincipal(new ClaimsIdentity(sourcePrincipal.Identity, sourcePrincipal.Claims.Concat(essClaims)));
        }
    }
}
