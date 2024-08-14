using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Utilities.LogonUser;

namespace Spd.Manager.Licence
{
    public interface IApplicantProfileManager
    {
        public Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery query, CancellationToken ct);

        public Task<ApplicantLoginResponse> Handle(ApplicantLoginCommand cmd, CancellationToken ct); //used for applicant portal

        public Task<Unit> Handle(ApplicantTermAgreeCommand cmd, CancellationToken ct);

        public Task<IEnumerable<ApplicantListResponse>> Handle(ApplicantSearchCommand cmd, CancellationToken ct);

        public Task<Unit> Handle(ApplicantUpdateCommand cmd, CancellationToken ct);

        public Task<Unit> Handle(ApplicantMergeCommand cmd, CancellationToken ct);
    }

    public record GetApplicantProfileQuery(Guid ApplicantId) : IRequest<ApplicantProfileResponse>;
    public record ApplicantLoginCommand(BcscIdentityInfo BcscIdentityInfo) : IRequest<ApplicantLoginResponse>;
    public record ApplicantTermAgreeCommand(Guid ApplicantId) : IRequest<Unit>;
    public record ApplicantSearchCommand(BcscIdentityInfo BcscIdentityInfo, bool hasIdentity = false) : IRequest<IEnumerable<ApplicantListResponse>>;
    public record ApplicantUpdateCommand(
        Guid ApplicantId,
        ApplicantUpdateRequest ApplicantUpdateRequest,
        IEnumerable<LicAppFileInfo> LicAppFileInfos)
        : IRequest<Unit>;
    public record ApplicantMergeCommand(
        Guid OldApplicantId,
        Guid NewApplicantId)
        : IRequest<Unit>;

    public record ApplicantUpdateRequest : Applicant
    {
        public Guid? LicenceId { get; set; } //used when user is in update, renew or replace flow.
        public ApplicationTypeCode? ApplicationTypeCode { get; set; } //used when user is in update, renew or replace flow.
        public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
        public IEnumerable<Guid>? PreviousDocumentIds { get; set; }
        public bool? HasNewMentalHealthCondition { get; set; }
        public string? CriminalChargeDescription { get; set; }
        public bool? HasNewCriminalRecordCharge { get; set; }
    }

    public record Applicant
    {
        public string? GivenName { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public GenderCode? GenderCode { get; set; }
        public string? PhoneNumber { get; set; }
        public Address? ResidentialAddress { get; set; }
        public Address? MailingAddress { get; set; }
        public IEnumerable<Alias> Aliases { get; set; } = Array.Empty<Alias>();
        public bool? IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
        public string? OtherOfficerRole { get; set; }
        public bool? IsTreatedForMHC { get; set; }
        public bool? HasCriminalHistory { get; set; }
    }
    public record ApplicantProfileResponse : Applicant
    {
        public Guid ApplicantId { get; set; } //which is contact id in db
        public string Sub { get; set; } = null!; //bcsc sub
        public IdentityProviderTypeCode IdentityProviderTypeCode { get; set; } = IdentityProviderTypeCode.BcServicesCard;
        public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
    }
    public record ApplicantListResponse
    {
        public Guid ApplicantId { get; set; } //which is contact id in db
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public DateOnly BirthDate { get; set; }
        public string? LicenceNumber { get; set; }
        public DateOnly? LicenceExpiryDate { get; set; }
    }
    public record ApplicantLoginResponse
    {
        public Guid ApplicantId { get; set; } //which is contact id in db
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public bool? IsFirstTimeLogin { get; set; } = false;
    }
}