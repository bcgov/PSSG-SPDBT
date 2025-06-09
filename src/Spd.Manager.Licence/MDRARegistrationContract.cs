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

public record MDRARegistrationNewCommand(MDRARegistrationRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;
public record MDRARegistrationRenewCommand(MDRARegistrationRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;
public record MDRARegistrationUpdateCommand(MDRARegistrationRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;

public record MDRARegistrationRequest
{
    public ApplicationTypeCode ApplicationTypeCode { get; set; }
    public ApplicationOriginTypeCode ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeCode.WebForm;
    public string BizOwnerLastName { get; set; }
    public string BizOwnerFirstName { get; set; }
    public string BizOwnerMiddleName { get; set; }
    public string? BizLegalName { get; set; }
    public string? BizTradeName { get; set; }
    public Address? BizMailingAddress { get; set; }
    public Address? BizAddress { get; set; }
    public string BizManagerLastName { get; set; }
    public string BizManagerFirstName { get; set; }
    public string BizManagerMiddleName { get; set; }
    public string? BizPhoneNumber { get; set; }
    public string? BizEmailAddress { get; set; }
    public IEnumerable<BranchInfo>? Branches { get; set; }
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
}

public record MDRARegistrationCommandResponse
{
    public Guid? OrgRegistrationId { get; set; }
    public string? OrgRegistrationNumber { get; set; }
}

