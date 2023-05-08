namespace Spd.Resource.Organizations.User
{
    public interface IOrgUserRepository
    {
        Task<OrgUserQryResult> QueryOrgUserAsync(OrgUserQry qry, CancellationToken ct);
        Task<OrgUserManageResult> ManageOrgUserAsync(OrgUserCmd cmd, CancellationToken ct);
        Task<OrgUserInviteResult> QueryOrgUserInvitationAsync(OrgUserInvitationQry qry, CancellationToken ct);
    }

    //command
    public abstract record OrgUserCmd;
    public record UserCreateCmd(User User, string HostUrl) : OrgUserCmd;
    public record UserUpdateCmd(Guid Id, User User) : OrgUserCmd;
    public record UserDeleteCmd(Guid Id) : OrgUserCmd;
    public record OrgUserManageResult(UserResult? UserResult = null);

    //query
    public abstract record OrgUserQry();
    public record OrgUserByIdQry(Guid UserId) : OrgUserQry;
    public record OrgUsersSearch(Guid? OrgId = null, Guid? IdentityId = null) : OrgUserQry;
    public abstract record OrgUserQryResult;
    public record OrgUserResult(UserResult UserResult) : OrgUserQryResult;
    public record OrgUsersResult(IEnumerable<UserResult> UserResults) : OrgUserQryResult;
    public record OrgUserInvitationQry(string InviteIdEncryptedCode);
    public record OrgUserInviteResult
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
        public Guid OrgId { get; set; }
        public Guid OrgGuid { get; set; }
        public string LastName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    //shared content
    public record User
    {
        public Guid? OrganizationId { get; set; }
        public ContactRoleCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }
    public record UserResult() : User()
    {
        public Guid Id { get; set; }
        public Guid? OrgRegistrationId { get; set; }
        public Guid? UserGuid { get; set; }
        public bool IsActive { get; set; }
    };

    public enum ContactRoleCode
    {
        Primary,
        Contact
    }

}
