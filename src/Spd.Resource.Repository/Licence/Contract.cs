using Spd.Resource.Repository.LicenceApplication;

namespace Spd.Resource.Repository.Licence
{
    public interface ILicenceRepository
    {
        public Task<LicenceListResp> QueryAsync(LicenceQry query, CancellationToken cancellationToken);
        public Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken cancellationToken);
    }

    public record LicenceQry
    {
        public Guid? LicenceId { get; set; }
        public string? LicenceNumber { get; set; }
        public string? AccessCode { get; set; }
        public Guid? ContactId { get; set; }
        public Guid? AccountId { get; set; }
        public WorkerLicenceTypeEnum? Type { get; set; }
        public bool IncludeInactive { get; set; }
        public bool? IsExpired { get; set; }
    };
    public record LicenceListResp
    {
        public IEnumerable<LicenceResp> Items { get; set; } = Array.Empty<LicenceResp>();
    }

    public abstract record LicenceCmd;
    public record LicenceResp()
    {
        public Guid? LicenceId { get; set; }
        public Guid? LicenceAppId { get; set; }
        public string? LicenceNumber { get; set; } = null;
        public DateOnly ExpiryDate { get; set; }
        public WorkerLicenceTypeEnum? WorkerLicenceTypeCode { get; set; }
        public LicenceTermEnum? LicenceTermCode { get; set; }
        public Guid? LicenceHolderId { get; set; }
        public string? LicenceHolderFirstName { get; set; }
        public string? LicenceHolderLastName { get; set; }
        public LicenceStatusEnum LicenceStatusCode { get; set; }
        public string? NameOnCard { get; set; }
    }

    public enum LicenceStatusEnum
    {
        Active,
        Inactive,
        Expired,
        Suspended
    }
}