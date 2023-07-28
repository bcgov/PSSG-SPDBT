using MediatR;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Manager.Membership.OrgUser;
using Spd.Utilities.Shared.ManagerContract;

namespace Spd.Manager.Membership.UserProfile
{
    public interface IUserProfileManager
    {
        public Task<OrgUserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken ct);
        public Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct);
    }

    #region UserProfile
    public record GetCurrentUserProfileQuery(PortalUserIdentity PortalUserIdentity) : IRequest<OrgUserProfileResponse>;

    public class OrgUserProfileResponse
    {
        public Guid? UserGuid { get; set; }//from token
        public string? UserDisplayName { get; set; } //from token
        public IdentityProviderTypeCode? IdentityProviderType { get; set; }
        public IEnumerable<UserInfo> UserInfos { get; set; } = Array.Empty<UserInfo>();
    }

    public enum IdentityProviderTypeCode
    {
        BusinessBceId,
        BcServicesCard,
        Idir,
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
        public Guid? OrgRegistrationId { get; set; } = null;
        public OrgRegistrationStatusCode? OrgRegistrationStatusCode { get; set; } = null;
        public string? OrgName { get; set; }
        public Guid? UserGuid { get; set; }
        public UserInfoMsgTypeCode? UserInfoMsgType { get; set; }
    }

    public enum UserInfoMsgTypeCode
    {
        REGISTRATION_NOT_APPROVED,
        ACCOUNT_NOT_MATCH_RECORD,
        NO_ACTIVE_ACCOUNT_FOR_ORG
    }

    public record OrgSettings
    {
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode LicenseesNeedVulnerableSectorScreening { get; set; }
        public bool GenericUploadEnabled { get; set; }
    }

    public class PortalUserIdentity
    {
        public string? BCeIDUserName { get; set; }
        public string? DisplayName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PreferredUserName { get; set; }
        public Guid? UserGuid { get; set; }
        public Guid BizGuid { get; set; }
        public string? BizName { get; set; }
        public string? Issuer { get; set; }
        public bool? EmailVerified { get; set; }
        public string? Email { get; set; }
    }
    #endregion

    #region ApplicantProfile
    public record GetApplicantProfileQuery(string BcscSub) : IRequest<ApplicantProfileResponse>;
    public class ApplicantProfileResponse
    {
        public Guid ApplicantId { get; set; } //which is contact id in db
        public string? FirstName { get; set; } // which is contact firstname
        public string? LastName { get; set; } // which is contact lastname
    }
    #endregion

    #region IdirUserProfile
    public class IdirUserProfileResponse
    {
        public Guid OrgId { get; set; } //would be hardcoded bcgov id.
        public string? UserGuid { get; set; }//from token
        public string? UserDisplayName { get; set; } //from token
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? IdirUserName { get; set; }
        public IdentityProviderTypeCode? IdentityProviderType { get; set; }
    }
    #endregion
}
