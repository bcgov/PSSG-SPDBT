namespace Spd.Resource.Applicants.Licence
{
    public interface ILicenceRepository
    {
        public Task<LicenceListResp> QueryAsync(LicenceQry query, CancellationToken cancellationToken);
        public Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken cancellationToken);
    }

    public record LicenceQry(Guid? LicenceId = null);
    public record LicenceListResp
    {
        public IEnumerable<LicenceResp> Items { get; set; } = Array.Empty<LicenceResp>();
    }

    public record LicenceResp(Guid? LicenceId);
    public abstract record LicenceCmd;
}