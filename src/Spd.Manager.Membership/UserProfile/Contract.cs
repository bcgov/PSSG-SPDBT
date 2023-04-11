using MediatR;
using Spd.Resource.Organizations.User;

namespace Spd.Manager.Membership.UserProfile
{
    public interface IUserProfileManager
    {
        public Task<UserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken cancellationToken);
    }

    public record GetCurrentUserProfileQuery : IRequest<UserProfileResponse>;

    public class UserProfileResponse
    {
        public Guid UserGuid { get; set; } //from token
        public string? UserDisplayName { get; set; } //from token
        public Guid? OrgGuid { get; set; } //from token
        public string? OrgLegalName { get; set; } //from token
        public string? UserFirstName { get; set; } //from token
        public string? UserLastName { get; set; } //from token
        public string? UserEmail { get; set; } //from token
        public string? IdentityProvider { get; set; }
        public bool IsAuthenticated { get; set; }
        public IEnumerable<SpdUserInfo> SpdUserInfos { get; set; }=Array.Empty<SpdUserInfo>();
    }

    public record SpdUserInfo
    {
        public Guid? UserId { get; set; } = null;//from spd, portal user id
        public ContactRoleCode? ContactRoleCode { get; set; } = null;//from spd
        public Guid? OrgId { get; set; } = null;//from spd
        public string? OrgName { get; set; } = null;//from spd
        public OrgStatusCode OrgStatusCode { get; set; } = OrgStatusCode.NotFound;//from spd
    }

    public enum OrgStatusCode
    {
        NotFound,
        Valid,
        InRegistration,
        Inactive
    }
}
