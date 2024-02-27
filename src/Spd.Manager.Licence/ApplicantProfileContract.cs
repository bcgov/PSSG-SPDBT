using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Utilities.LogonUser;

namespace Spd.Manager.Licence
{
    public interface IApplicantProfileManager
    {
        public Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct);
        public Task<ApplicantProfileResponse> Handle(ApplicantLoginCommand request, CancellationToken ct); //used for applicant portal
    }

    public record GetApplicantProfileQuery(Guid ContactId) : IRequest<ApplicantProfileResponse>;
    public record ApplicantLoginCommand(BcscIdentityInfo BcscIdentityInfo) : IRequest<ApplicantProfileResponse>;

    public record Applicant
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public Guid? IdentityId { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public DateOnly BirthDate { get; set; }
        public GenderEnum? Gender { get; set; }
        public Address? ResidentialAddress { get; set; }
        public Address? MailingAddress { get; set; }
        public IEnumerable<Alias> Aliases { get; set; } = Array.Empty<Alias>();
        public bool? IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleEnum? PoliceOfficerRoleCode { get; set; }
        public string? OtherOfficerRole { get; set; }
        public bool? IsTreatedForMHC { get; set; }
        public bool? HasCriminalHistory { get; set; }
        public string? CriminalChargeDescription { get; set; }
    }
    public record ApplicantProfileResponse : Applicant
    {
        public Guid ApplicantId { get; set; } //which is contact id in db
        public string Sub { get; set; } = null!; //bcsc sub
        public IdentityProviderTypeCode IdentityProviderTypeCode { get; set; } = IdentityProviderTypeCode.BcServicesCard;
    }
}
