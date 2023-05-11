using MediatR;
using Spd.Manager.Membership.Org;
using Spd.Manager.Membership.OrgUser;
using Spd.Manager.Membership.Shared;
using Spd.Resource.Organizations.User;
using System.ComponentModel;

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
        public string? IdentityProvider { get; set; }
        public IEnumerable<UserInfo> UserInfos { get; set; } = Array.Empty<UserInfo>();
    }

    public record UserInfo
    {
        public Guid UserId { get; set; }//from spd, portal user id
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Email { get; set; }
        public ContactAuthorizationTypeCode? ContactAuthorizationTypeCode { get; set; } = null;//from spd
        public OrgSettings? OrgSettings { get; set; }
        public Guid? OrgId { get; set; }
        public Guid? OrgRegistrationId { get; set; }
        public OrgRegistrationStatusCode OrgRegistrationStatusCode { get; set; }
        public string? OrgName { get; set; }
        public Guid? UserGuid { get; set; }
    }

    public record OrgSettings
    {
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode LicenseesNeedVulnerableSectorScreening { get; set; }   
        public bool GenericUploadEnabled { get; set; }
    }

    public enum OrgRegistrationStatusCode
    {
        ApplicationSubmitted,
        InProgress,
        Complete
    }
}
