
using Spd.Resource.Repository.Biz;

namespace Spd.Resource.Repository.MDRARegistration;
public interface IMDRARegistrationRepository
{
    public Task<MDRARegistrationResp> CreateMDRARegistrationAsync(CreateMDRARegistrationCmd cmd, CancellationToken ct);
}

public record MDRARegistrationResp(Guid RegistrationId);
public record CreateMDRARegistrationCmd
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
    public IEnumerable<BranchAddr>? Branches { get; set; }
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public bool? HasPotentialDuplicate { get; set; }
}

