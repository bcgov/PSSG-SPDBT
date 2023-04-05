namespace Spd.Resource.Organizations.User
{
    public interface IOrgUserRepository
    {
        Task<UserResp> AddUserAsync(UserCreateCmd createUserCmd, CancellationToken cancellationToken);
        Task<UserResp> UpdateUserAsync(UserUpdateCmd createUserCmd, CancellationToken cancellationToken);
        Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<UserResp> GetUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<OrgUsersResp> GetUserListAsync(Guid organizationId, CancellationToken cancellationToken);
    }

    public record UserCreateCmd
    {
        public Guid OrganizationId { get; set; }
        public ContactRoleCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public record UserUpdateCmd
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactRoleCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public record UserResp
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactRoleCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class OrgUsersResp
    {
        public int? MaximumNumberOfAuthorizedContacts { get; set; }
        public int? MaximumNumberOfPrimaryAuthorizedContacts { get; set; }
        public IEnumerable<UserResp> Users { get; set; }
    }

    public enum ContactRoleCode
    {
        Primary,
        Contact
    }

}
