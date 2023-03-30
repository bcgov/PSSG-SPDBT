namespace Spd.Resource.Applicants
{
    public interface IApplicationRepository
    {
        public Task<bool> AddApplicationInvitesAsync(ApplicationInviteCreateCmd createInviteCmd, CancellationToken cancellationToken);
        Task<bool> CheckInviteDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken);
        public Task<bool> AddApplicationManualSubmissionAsync(ApplicationManualSubmissionCreateCmd createManualSubmissionCmd, CancellationToken cancellationToken);
    }

    public record ApplicationInviteCreateCmd
    {
        public Guid OrgId { get; set; }
        public Guid CreatedByUserId { get; set; }
        public IEnumerable<ApplicationInviteCreateReq> ApplicationInviteCreateReqs { get; set; }
    }

    public record ApplicationInviteCreateReq
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public bool OrgPay { get; set; }
    }

    public record ApplicationInviteCreateResp
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

    public record SearchInvitationQry
    {
        public Guid OrgId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }

    public record ApplicationManualSubmissionCreateCmd
    {
        public Guid OrganizationId { get; set; }
        public string GivenName { get; set; }
        public string MiddleName1 { get; set; }
        public string MiddleName2 { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string DriversLicense { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string BirthPlace { get; set; }
        public string JobTitle { get; set; }

        //vulnerableSectorCategory
        public string Alias1GivenName { get; set; }
        public string Alias1MiddleName1 { get; set; }
        public string Alias1MiddleName2 { get; set; }
        public string Alias1Surname { get; set; }
        public string Alias2GivenName { get; set; }
        public string Alias2MiddleName1 { get; set; }
        public string Alias2MiddleName2 { get; set; }
        public string Alias2Surname { get; set; }
        public string Alias3GivenName { get; set; }
        public string Alias3MiddleName1 { get; set; }
        public string Alias3MiddleName2 { get; set; }
        public string Alias3Surname { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        //	agreeToCompleteAndAccurate
        //	haveVerifiedIdentity
    }
}
