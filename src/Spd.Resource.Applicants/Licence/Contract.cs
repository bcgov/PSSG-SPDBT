using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Resource.Applicants.Licence
{
    public interface ILicenceRepository
    {
        public Task<LicenceListResp> QueryAsync(LicenceQry query, CancellationToken cancellationToken);
        public Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken cancellationToken);
    }

    public record LicenceQry(Guid? LicenceId = null, 
        string? LicenceNumber = null, 
        Guid? ContactId = null, 
        Guid? AccountId = null,
        WorkerLicenceTypeEnum? type = null);
    public record LicenceListResp
    {
        public IEnumerable<LicenceResp> Items { get; set; } = Array.Empty<LicenceResp>();
    }

    public abstract record LicenceCmd;
    public record LicenceResp()
    {
        public Guid? LicenceId { get; set; }
        public string? LicenceNumber { get; set; } = null;
        public DateTimeOffset ExpiryDate { get; set; }
    }
}