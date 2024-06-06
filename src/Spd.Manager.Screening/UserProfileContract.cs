using MediatR;
using Spd.Manager.Shared;
using Spd.Utilities.LogonUser;

namespace Spd.Manager.Screening
{
    public interface IUserProfileManager
    {
        public Task<OrgUserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken ct);
        public Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct);
        public Task<ApplicantProfileResponse> Handle(ManageApplicantProfileCommand request, CancellationToken ct); //used for worker licensing portal
        public Task<IdirUserProfileResponse?> Handle(GetIdirUserProfileQuery request, CancellationToken ct); //used for query idir user if user is already existing in spd
        public Task<IdirUserProfileResponse> Handle(ManageIdirUserCommand command, CancellationToken ct); //used for whoami, which will register idir user to spd.
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
        public string? OrgRegistrationNumber { get; set; } = null;
        public string? OrgName { get; set; }
        public Guid? UserGuid { get; set; }
        public UserInfoMsgTypeCode? UserInfoMsgType { get; set; }
        public bool IsFirstTimeLogin { get; set; } = false;
    }

    public enum UserInfoMsgTypeCode
    {
        REGISTRATION_DENIED,
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
        public string? Email { get; set; }
        public GenderCode? Gender { get; set; }
        public string Sub { get; set; } = null!;
        public DateOnly BirthDate { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public IdentityProviderTypeCode IdentityProviderTypeCode { get; set; } = IdentityProviderTypeCode.BcServicesCard;
        public Address? ResidentialAddress { get; set; }
    }
    public record ManageApplicantProfileCommand(BcscIdentityInfo BcscIdentityInfo) : IRequest<ApplicantProfileResponse>;
    public record Address
    {
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? Province { get; set; }
    }
    #endregion

    #region IdirUserProfile

    public record GetIdirUserProfileQuery(IdirUserIdentity IdirUserIdentity) : IRequest<IdirUserProfileResponse>;
    public record ManageIdirUserCommand(IdirUserIdentity IdirUserIdentity) : IRequest<IdirUserProfileResponse>;

    public class IdirUserProfileResponse
    {
        public Guid OrgId { get; set; } //would be user's ministry from Idir.
        public string OrgName { get; set; }
        public Guid? UserId { get; set; }
        public string? UserGuid { get; set; }//from token
        public string? UserDisplayName { get; set; } //from token
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? IdirUserName { get; set; }
        public IdentityProviderTypeCode? IdentityProviderType { get; set; }
        public bool IsPSA { get; set; } = false;
        public bool IsFirstTimeLogin { get; set; } = false;
        public string? OrgCodeFromIdir { get; set; }
    }

    public class IdirUserIdentity
    {
        public string? IdirUserName { get; set; } //idir_username
        public string? DisplayName { get; set; } //display_name
        public string? FirstName { get; set; } //given_name
        public string? LastName { get; set; } //family_name
        public string? PreferredUserName { get; set; } //preferred_username
        public string? UserGuid { get; set; } //idir_user_guid
        public string? UserName { get; set; } //idir_username
        public string? Issuer { get; set; } //iss
        public bool? EmailVerified { get; set; } //email_verified
        public string? Email { get; set; } //email
    }
    #endregion

}
