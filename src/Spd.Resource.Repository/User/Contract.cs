namespace Spd.Resource.Repository.Users
{
    public interface IOrgUserRepository
    {
        Task<OrgUserQryResult> QueryOrgUserAsync(OrgUserQry qry, CancellationToken ct);

        Task<OrgUserManageResult> ManageOrgUserAsync(OrgUserCmd cmd, CancellationToken ct);
    }

    //command
    public abstract record OrgUserCmd;
    public record UserCreateCmd(User User, string HostUrl, Guid? IdentityId = null, Guid? CreatedByUserId = null) : OrgUserCmd;
    public record UserUpdateCmd(Guid Id, User User, bool OnlyChangePhoneJob = false) : OrgUserCmd;
    public record UserUpdateLoginCmd(Guid Id) : OrgUserCmd;
    public record UserDeleteCmd(Guid Id) : OrgUserCmd;
    public record UserInvitationVerify(string InviteIdEncryptedCode, Guid OrgGuid, Guid UserGuid) : OrgUserCmd;
    public record OrgUserManageResult(UserResult? UserResult = null);

    //query
    public abstract record OrgUserQry;
    public record OrgUserByIdQry(Guid UserId) : OrgUserQry;
    public record OrgUsersSearch(Guid? OrgId = null, Guid? IdentityId = null) : OrgUserQry;
    public abstract record OrgUserQryResult;
    public record OrgUserResult(UserResult UserResult) : OrgUserQryResult;
    public record OrgUsersResult(IEnumerable<UserResult> UserResults) : OrgUserQryResult;

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
        public bool IsFirstTimeLogin { get; set; }
    }
    public record UserResult() : User()
    {
        public Guid Id { get; set; }
        public Guid? OrgRegistrationId { get; set; }
        public Guid? UserGuid { get; set; }
        public bool IsActive { get; set; }
    };
}