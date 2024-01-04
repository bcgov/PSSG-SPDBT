using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Resource.Applicants.Licence
{
    public interface ILicenceRepository
    {
        public Task<LicenceListResp> QueryAsync(LicenceQry query, CancellationToken cancellationToken);
        public Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken cancellationToken);
    }

    public record LicenceQry
    {
        public Guid? LicenceId { get; set; } = null;
        public string? LicenceNumber { get; set; } = null;
        public string? AccessCode { get; set; } = null;
        public Guid? ContactId { get; set; } = null;
        public Guid? AccountId { get; set; } = null;
        public WorkerLicenceTypeEnum? Type { get; set; } = null;
        public bool IncludeInactive { get; set; } = false;
        public bool? IsExpired { get; set; } = null;
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
    }
}