namespace Spd.Resource.Organizations.User
{
    public interface IOrgUserRepository
    {
        Task<UserResponse> AddUserAsync(CreateUserCmd createUserCmd, CancellationToken cancellationToken);
        Task<UserResponse> UpdateUserAsync(UpdateUserCmd createUserCmd, CancellationToken cancellationToken);
        Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<UserResponse> GetUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<OrgUserListCmdResponse> GetUserListAsync(Guid organizationId, CancellationToken cancellationToken);
    }

    public abstract record UpsertUserCmd
    {
        public Guid OrganizationId { get; set; }
        public ContactRoleCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }
    public record CreateUserCmd: UpsertUserCmd {}
    public record UpdateUserCmd: UpsertUserCmd
    {
        public Guid Id { get; set; }
    }
    public record UserResponse
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactRoleCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class OrgUserListCmdResponse
    {
        public int? MaximumNumberOfAuthorizedContacts { get; set; }
        public int? MaximumNumberOfPrimaryAuthorizedContacts { get; set; }
        public IEnumerable<UserResponse> Users { get; set; }
    }

    public enum ContactRoleCode
    {
        Primary,
        Contact
    }

}
