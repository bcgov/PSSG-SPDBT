using MediatR;
using Spd.Manager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Manager.Licence;
public interface IControllingMemberCrcAppManager
{
    public Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppNewCommand command, CancellationToken ct);
    public Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcUpsertCommand command, CancellationToken ct);
    public Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcSubmitCommand command, CancellationToken ct);

}
public record ControllingMemberCrcAppBase : LicenceAppBase
{
    public Guid? ParentBizLicApplicationId { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public GenderCode? GenderCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public bool? HasPreviousNames { get; set; }
    public IEnumerable<Alias> Aliases { get; set; } = Array.Empty<Alias>();
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsCanadianCitizen { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public string? CriminalHistoryDetail { get; set; }
    public bool? HasBankruptcyHistory { get; set; }
    public string? BankruptcyHistoryDetail { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public Address? ResidentialAddress { get; set; }
    public Guid BizContactId { get; set; }
    public bool? HasNewCriminalRecordCharge { get; set; }
}


#region authenticated
public record ControllingMemberCrcUpsertCommand(ControllingMemberCrcAppUpsertRequest ControllingMemberCrcAppUpsertRequest) : IRequest<ControllingMemberCrcAppCommandResponse>;
public record ControllingMemberCrcSubmitCommand(ControllingMemberCrcAppUpsertRequest ControllingMemberCrcUpsertRequest)
    : ControllingMemberCrcUpsertCommand(ControllingMemberCrcUpsertRequest), IRequest<ControllingMemberCrcAppCommandResponse>;
public record ControllingMemberCrcAppUpsertRequest : ControllingMemberCrcAppBase
{
    public IEnumerable<Document>? DocumentInfos { get; set; }
    public Guid? ControllingMemberAppId { get; set; }
    public Guid ApplicantId { get; set; }
};
#endregion
#region anonymous user
public record ControllingMemberCrcAppSubmitRequest : ControllingMemberCrcAppBase
{
    public bool? HasLegalNameChanged { get; set; }
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<DocumentExpiredInfo> DocumentExpiredInfos { get; set; } = Enumerable.Empty<DocumentExpiredInfo>();
    public bool? HasNewMentalHealthCondition { get; set; }
    public Guid? LatestApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be latest application id. 
    public Guid? OriginalApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be original application id. 
    public string? CriminalChargeDescription { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
};

public record ControllingMemberCrcAppNewCommand(ControllingMemberCrcAppSubmitRequest ControllingMemberCrcAppSubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<ControllingMemberCrcAppCommandResponse>;
public record ControllingMemberCrcAppUpdateCommand(
    ControllingMemberCrcAppSubmitRequest ControllingMemberCrcAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos,
    bool IsAuthenticated = false)
    : IRequest<ControllingMemberCrcAppCommandResponse>;
public record ControllingMemberCrcAppCommandResponse
{
    public Guid? ControllingMemberAppId { get; set; }
    public decimal? Cost { get; set; }

};


#endregion