
using Spd.Resource.Repository.Biz;

namespace Spd.Resource.Repository.MDRARegistration;
public interface IMDRARegistrationRepository
{
    public Task<MDRARegistrationCmdResp> CreateMDRARegistrationAsync(CreateMDRARegistrationCmd cmd, CancellationToken ct);
    public Task<MDRARegistrationResp> GetMDRARegistrationAsync(Guid registrationId, CancellationToken ct);
}

public record MDRARegistrationCmdResp(Guid RegistrationId);
public record MDRARegistration
{
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public ApplicationOriginTypeEnum ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeEnum.WebForm;
    public string BizOwnerSurname { get; set; }
    public string? BizOwnerGivenNames { get; set; }
    public string? BizLegalName { get; set; }
    public string? BizTradeName { get; set; }
    public Addr? BizMailingAddress { get; set; }
    public Addr? BizAddress { get; set; }
    public string BizManagerFullName { get; set; }
    public string BizManagerEmailAddress { get; set; }
    public string? BizManagerPhoneNumber { get; set; }
    public string? BizPhoneNumber { get; set; }
    public string? BizEmailAddress { get; set; }
    public IList<BranchAddr>? Branches { get; set; }
}
public record CreateMDRARegistrationCmd : MDRARegistration
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public bool? HasPotentialDuplicate { get; set; }
}
public record MDRARegistrationResp : MDRARegistration
{
    public Guid? RegistrationId { get; set; }
    public string RegistrationNumber { get; set; }
}

