namespace Spd.Resource.Organizations.User
{
    public interface IOrgUserRepository
    {
        Task<OrgUserQryResult> QueryOrgUserAsync(OrgUserQry qry, CancellationToken ct);
        Task<OrgUserManageResult> ManageOrgUserAsync(OrgUserCmd cmd, CancellationToken ct);
    }

    public abstract record OrgUserCmd;
    public record UserCreateCmd(UserInfo UserInfo) : OrgUserCmd;
    public record UserUpdateCmd(Guid Id, UserInfo UserInfo) : OrgUserCmd;
    public record UserDeleteCmd(Guid Id) : OrgUserCmd;

    public record OrgUserManageResult(UserInfoResult UserInfoResult) { }
    public record UserInfo
    {
        public Guid? OrganizationId { get; set; }
        public ContactRoleCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }
    public record UserInfoResult() : UserInfo()
    {
        public Guid Id { get; set;}
        public Guid? OrgRegistrationId { get; set; }
    };    
    public abstract record OrgUserQry;
    public record OrgUserByIdQry(Guid UserId) : OrgUserQry;
    public record OrgUsersByOrgIdQry(Guid OrgId) : OrgUserQry;
    public record OrgUsersByIdentityIdQry(Guid IdentityId) : OrgUserQry;
    public abstract record OrgUserQryResult;
    public record OrgUserResult(UserInfoResult UserInfoResult) : OrgUserQryResult;
    public record OrgUsersResult(IEnumerable<UserInfoResult> UserInfoResults) : OrgUserQryResult;

    public enum ContactRoleCode
    {
        Primary,
        Contact
    }

}
