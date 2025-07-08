using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface IMDRARegistrationManager
{
    //anonymous
    public Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationNewCommand command, CancellationToken ct);
    public Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationRenewCommand command, CancellationToken ct);
    public Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationUpdateCommand command, CancellationToken ct);
    public Task<MDRARegistrationResponse?> Handle(GetMDRARegistrationQuery query, CancellationToken ct);
    public Task<Guid?> Handle(GetMDRARegistrationIdQuery query, CancellationToken ct);

}

public record MDRARegistrationNewCommand(MDRARegistrationRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;
public record MDRARegistrationRenewCommand(MDRARegistrationRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;
public record MDRARegistrationUpdateCommand(MDRARegistrationRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<MDRARegistrationCommandResponse>;
public record GetMDRARegistrationIdQuery(Guid BizId) : IRequest<Guid?>;
public record GetMDRARegistrationQuery(Guid BizRegistrationId) : IRequest<MDRARegistrationResponse>;

public abstract record MDRARegistration
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
    public string? BizManagerPhoneNumber { get; set; }
    public string? BizPhoneNumber { get; set; }
    public string? BizEmailAddress { get; set; }
    public IEnumerable<BranchInfo>? Branches { get; set; }
    public Guid? ExpiredLicenceId { get; set; } //for new application type, for renew, replace, update, it means previous licenceId
}

public record MDRARegistrationRequest : MDRARegistration
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public bool? HasPotentialDuplicate { get; set; } //only for new
    public bool RequireDuplicateCheck { get; set; } = true; //only for new
}

public record MDRARegistrationCommandResponse
{
    public Guid? RegistrationId { get; set; }

    //this = true, then fe show message that "if user still want to proceed", if user response with yes, set HasPotentialDuplicate=true, RequireDuplicateCheck= false.
    public bool? HasPotentialDuplicate { get; set; }
}

public record MDRARegistrationResponse : MDRARegistration
{
    public Guid? RegistrationId { get; set; }
    public string RegistrationNumber { get; set; }
}
