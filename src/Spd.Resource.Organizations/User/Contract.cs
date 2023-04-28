namespace Spd.Resource.Organizations.User
{
    public interface IOrgUserRepository
    {
        Task<OrgUserQryResult> QueryOrgUserAsync(OrgUserQry qry, CancellationToken ct);
        Task<OrgUserManageResult> ManageOrgUserAsync(OrgUserCmd cmd, CancellationToken ct);
    }

    //command
    public abstract record OrgUserCmd;
    public record UserCreateCmd(User User) : OrgUserCmd;
    public record UserUpdateCmd(Guid Id, User User) : OrgUserCmd;
    public record UserDeleteCmd(Guid Id) : OrgUserCmd;
    public record OrgUserManageResult(UserResult UserResult);

    //query
    public abstract record OrgUserQry();
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
