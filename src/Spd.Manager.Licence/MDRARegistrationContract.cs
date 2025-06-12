using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface IMDRARegistrationManager
{
    //anonymous
    public Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationNewCommand command, CancellationToken ct);
    public Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationRenewCommand command, CancellationToken ct);
    public Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationUpdateCommand command, CancellationToken ct);
}

public record MDRARegistrationNewCommand(MDRARegistrationNewRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;
public record MDRARegistrationRenewCommand(MDRARegistrationRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;
public record MDRARegistrationUpdateCommand(MDRARegistrationRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;

public record MDRARegistrationRequest
{
    public ApplicationTypeCode ApplicationTypeCode { get; set; }
    public ApplicationOriginTypeCode ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeCode.WebForm;
    public string BizOwnerSurname { get; set; }
    public string? BizOwnerGivenNames { get; set; }
    public string? BizLegalName { get; set; }
    public string? BizTradeName { get; set; }
    public Address? BizMailingAddress { get; set; }
    public Address? BizAddress { get; set; }
    public string BizManagerFullName { get; set; }
    public string? BizManagerEmailAddress { get; set; }
    public string? BizPhoneNumber { get; set; }
    public string? BizEmailAddress { get; set; }
    public IEnumerable<BranchInfo>? Branches { get; set; }
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
}

public record MDRARegistrationNewRequest : MDRARegistrationRequest
{
    public BooleanTypeCode HasPotentialDuplicate { get; set; } = BooleanTypeCode.No;
    public bool RequireDuplicateCheck { get; set; } = true;
}
public record MDRARegistrationCommandResponse
{
    public Guid? OrgRegistrationId { get; set; }

    //this = true, then fe show message that "if user still want to proceed", if user response with yes, set HasPotentialDuplicate=true, RequireDuplicateCheck= false.
    public bool? HasPotentialDuplicate { get; set; }
}

