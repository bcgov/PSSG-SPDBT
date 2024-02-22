using MediatR;
using Spd.Manager.Shared;
using Spd.Utilities.LogonUser;

namespace Spd.Manager.Licence
{
    public interface IUserProfileManager
    {
        public Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct);
        public Task<ApplicantProfileResponse> Handle(ManageApplicantProfileCommand request, CancellationToken ct); //used for worker licensing portal
    }

    #region ApplicantProfile
    public record GetApplicantProfileQuery(string BcscSub) : IRequest<ApplicantProfileResponse>;
    public class ApplicantProfileResponse
    {
        public Guid ApplicantId { get; set; } //which is contact id in db
        public string? FirstName { get; set; } // which is contact firstname
        public string? LastName { get; set; } // which is contact lastname
        public string? Email { get; set; }
        public GenderCode? Gender { get; set; }
        public string Sub { get; set; } = null!;
        public DateOnly BirthDate { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public IdentityProviderTypeCode IdentityProviderTypeCode { get; set; } = IdentityProviderTypeCode.BcServicesCard;
        public Address? ResidentialAddress { get; set; }
        public bool? IsFirstTimeLogin { get; set; }
    }
    public record ManageApplicantProfileCommand(BcscIdentityInfo BcscIdentityInfo) : IRequest<ApplicantProfileResponse>;

    #endregion


}
