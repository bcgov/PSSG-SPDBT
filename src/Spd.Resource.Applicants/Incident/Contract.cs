using Spd.Resource.Applicants.Application;

namespace Spd.Resource.Applicants.Incident
{
    public interface IIncidentRepository
    {
        public Task<IncidentResp> ManageAsync(IncidentCmd cmd, CancellationToken cancellationToken);
    }

    public record IncidentQry(
        Guid? ApplicationId = null);
    public record IncidentListResp
    {
        public IEnumerable<IncidentResp> Items { get; set; } = Array.Empty<IncidentResp>();
    }

    public record IncidentResp
    {

    }

    public abstract record IncidentCmd;

    public record CreateIncidentCmd : IncidentCmd
    {
        public SpdTempFile TempFile { get; set; }
        public Guid ApplicationId { get; set; }

    }


}
