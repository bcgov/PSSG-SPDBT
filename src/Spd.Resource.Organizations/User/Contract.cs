namespace Spd.Resource.Organizations.User
{
    public interface IOrgUserRepository
    {
        Task<UserResponse> AddUserAsync(UserCreateCommand createUserCmd, CancellationToken cancellationToken);
        Task<UserResponse> UpdateUserAsync(UserUpdateCommand createUserCmd, CancellationToken cancellationToken);
        Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<UserResponse> GetUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<OrgUsersResponse> GetUserListAsync(Guid organizationId, CancellationToken cancellationToken);
    }

    public record UserCreateCommand
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

    public record UserUpdateCommand
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

    public class OrgUsersResponse
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
