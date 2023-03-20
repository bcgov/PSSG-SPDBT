namespace Spd.Resource.Organizations.User
{
    public interface IOrgUserRepository
    {
        Task<UserCmdResponse> AddUserAsync(CreateUserCmd createUserCmd, CancellationToken cancellationToken);
        Task<UserCmdResponse> UpdateUserAsync(UpdateUserCmd createUserCmd, CancellationToken cancellationToken);
        Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<UserCmdResponse> GetUserAsync(Guid userId, CancellationToken cancellationToken);
        Task<OrgUserListCmdResponse> GetUserListAsync(Guid organizationId, CancellationToken cancellationToken);
    }

    public record CreateUserCmd
    {
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }
    public record UpdateUserCmd
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }
    public record UserCmdResponse
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
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
        public IEnumerable<UserCmdResponse> Users { get; set; }
    }

    public enum ContactAuthorizationTypeCode
    {
        Primary,
        Contact
    }

}
