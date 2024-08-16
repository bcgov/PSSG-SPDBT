using MediatR;
using Spd.Manager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Manager.Licence;
public abstract record CrcControllingMemberApp
{
    public int AccessCode { get; set; } //is it int or string?
    public string GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string Surname { get; set; }
    public bool IsTermsOfUseAccepted { get; set; }
    public DateTime DateSigned { get; set; }
    public DateTime DateOfBirth { get; set; }
    public GenderCode Gender { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public bool HasPreviousName { get; set; }
    public bool HasBcDriverLicence { get; set; }
    public string? LicenceNumber { get; set; }

    public bool IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
    // public LicenceAppDocumentUpload? LetterOfConflictDoucuments { get; set; }

    public bool IsCanadianCitizen { get; set; }
    //public LicenceAppDocumentUpload? CitizenshipProofDoucuments { get; set; }
    public DateOnly? CitizenshipProofExpiryDate { get; set; }
    //public LicenceAppDocumentUpload? FingerPrintDoucuments { get; set; }
    //public LicenceAppDocumentUpload? GovernmentIssuedIdDoucuments1 { get; set; }
    //public LicenceAppDocumentUpload? GovernmentIssuedIdDoucuments2 { get; set; }

    public bool HasCriminalHistory { get; set; }
    public string? CriminalHistoryDetail { get; set; }

    public bool HasBankruptcyHistory { get; set; }
    public string? BankruptcyHistoryDetail { get; set; }

    public bool HasMentalCondition { get; set; }
    //public LicenceAppDocumentUpload? MentalHealthConditionDoucuments { get; set; }

    public Address Address { get; set; }
}

public record CrcControllingMemberCommandResponse : CrcControllingMemberUpsertResponse
{
};

public record CrcControllingMemberUpsertResponse
{
}
public record CrcControllingMemberUpsertRequest : CrcControllingMemberApp
{
    public Guid? CrcControllingMemberId { get; set; }
};

public record CrcControllingMemberUpsertCommand(CrcControllingMemberUpsertRequest CrcControllingMemberUpsertRequest) : IRequest<CrcControllingMemberCommandResponse>;
