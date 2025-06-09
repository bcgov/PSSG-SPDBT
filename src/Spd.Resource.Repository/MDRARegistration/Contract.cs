
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
    public string BizOwnerLastName { get; set; }
    public string BizOwnerFirstName { get; set; }
    public string BizOwnerMiddleName { get; set; }
    public string? BizLegalName { get; set; }
    public string? BizTradeName { get; set; }
    public Addr? BizMailingAddress { get; set; }
    public Addr? BizAddress { get; set; }
    public string BizManagerLastName { get; set; }
    public string BizManagerFirstName { get; set; }
    public string BizManagerMiddleName { get; set; }
    public string? BizPhoneNumber { get; set; }
    public string? BizEmailAddress { get; set; }
    public IEnumerable<BranchInfo>? Branches { get; set; }
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }

}

